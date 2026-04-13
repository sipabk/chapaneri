<?php
/**
 * Family Relationships Manager
 *
 * Custom DB table for storing member-to-member relationships with
 * automatic inverse relationship creation.
 *
 * @package Chapaneri_Heritage
 * @since 3.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Chapaneri_Family_Relationships {

    private static $instance = null;
    private $table_name;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'family_relationships';

        add_action('admin_init', array($this, 'maybe_create_table'));
        add_action('add_meta_boxes', array($this, 'add_relationships_meta_box'));
        add_action('wp_ajax_chapaneri_add_relationship', array($this, 'ajax_add_relationship'));
        add_action('wp_ajax_chapaneri_delete_relationship', array($this, 'ajax_delete_relationship'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    /**
     * Create the relationships table using dbDelta
     */
    public function maybe_create_table() {
        global $wpdb;

        $installed_ver = get_option('chapaneri_relationships_db_version', '0');
        $current_ver = '3.0.0';

        if ($installed_ver === $current_ver) {
            return;
        }

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$this->table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            member_id bigint(20) unsigned NOT NULL,
            related_member_id bigint(20) unsigned NOT NULL,
            relationship_type varchar(50) NOT NULL DEFAULT '',
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY idx_member_id (member_id),
            KEY idx_related_member_id (related_member_id),
            UNIQUE KEY idx_unique_relationship (member_id, related_member_id, relationship_type)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);

        update_option('chapaneri_relationships_db_version', $current_ver);
    }

    /**
     * Get inverse relationship type
     */
    public function get_inverse_type($type, $related_gender = '') {
        $inverses = array(
            'father'    => array('male' => 'son', 'female' => 'daughter'),
            'mother'    => array('male' => 'son', 'female' => 'daughter'),
            'son'       => array('male' => 'father', 'female' => 'mother'),
            'daughter'  => array('male' => 'father', 'female' => 'mother'),
            'spouse'    => array('male' => 'spouse', 'female' => 'spouse'),
            'sibling'   => array('male' => 'sibling', 'female' => 'sibling'),
            'brother'   => array('male' => 'brother', 'female' => 'sister'),
            'sister'    => array('male' => 'brother', 'female' => 'sister'),
        );

        if (isset($inverses[$type])) {
            $gender_key = ($related_gender === 'female') ? 'female' : 'male';
            return $inverses[$type][$gender_key] ?? $type;
        }

        return $type;
    }

    /**
     * Add a relationship (with automatic inverse)
     */
    public function add_relationship($member_id, $related_member_id, $type) {
        global $wpdb;

        // Insert primary relationship
        $result = $wpdb->insert(
            $this->table_name,
            array(
                'member_id'          => $member_id,
                'related_member_id'  => $related_member_id,
                'relationship_type'  => $type,
            ),
            array('%d', '%d', '%s')
        );

        if ($result === false) {
            return false;
        }

        // Create inverse
        $member_gender = get_post_meta($member_id, '_gender', true);
        $inverse_type = $this->get_inverse_type($type, $member_gender);

        $wpdb->insert(
            $this->table_name,
            array(
                'member_id'          => $related_member_id,
                'related_member_id'  => $member_id,
                'relationship_type'  => $inverse_type,
            ),
            array('%d', '%d', '%s')
        );

        // Auto-detect siblings
        if (in_array($type, array('father', 'mother'))) {
            $this->auto_create_siblings($member_id, $related_member_id, $type);
        }

        return true;
    }

    /**
     * Auto-create sibling relationships when parent-child links are added
     */
    private function auto_create_siblings($child_id, $parent_id, $parent_type) {
        global $wpdb;

        // Find other children of this parent
        $other_children = $wpdb->get_col($wpdb->prepare(
            "SELECT related_member_id FROM {$this->table_name}
             WHERE member_id = %d AND relationship_type IN ('son', 'daughter')
             AND related_member_id != %d",
            $parent_id,
            $child_id
        ));

        foreach ($other_children as $sibling_id) {
            // Check if sibling relationship already exists
            $exists = $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM {$this->table_name}
                 WHERE member_id = %d AND related_member_id = %d AND relationship_type = 'sibling'",
                $child_id,
                $sibling_id
            ));

            if (!$exists) {
                $wpdb->insert($this->table_name, array(
                    'member_id'         => $child_id,
                    'related_member_id' => $sibling_id,
                    'relationship_type' => 'sibling',
                ), array('%d', '%d', '%s'));

                $wpdb->insert($this->table_name, array(
                    'member_id'         => $sibling_id,
                    'related_member_id' => $child_id,
                    'relationship_type' => 'sibling',
                ), array('%d', '%d', '%s'));
            }
        }
    }

    /**
     * Delete a relationship (and its inverse)
     */
    public function delete_relationship($id) {
        global $wpdb;

        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE id = %d", $id
        ));

        if (!$row) {
            return false;
        }

        // Delete primary
        $wpdb->delete($this->table_name, array('id' => $id), array('%d'));

        // Delete inverse
        $member_gender = get_post_meta($row->member_id, '_gender', true);
        $inverse_type = $this->get_inverse_type($row->relationship_type, $member_gender);

        $wpdb->delete($this->table_name, array(
            'member_id'          => $row->related_member_id,
            'related_member_id'  => $row->member_id,
            'relationship_type'  => $inverse_type,
        ), array('%d', '%d', '%s'));

        return true;
    }

    /**
     * Get relationships for a member
     */
    public function get_relationships($member_id) {
        global $wpdb;

        return $wpdb->get_results($wpdb->prepare(
            "SELECT r.*, p.post_title AS related_member_name
             FROM {$this->table_name} r
             LEFT JOIN {$wpdb->posts} p ON p.ID = r.related_member_id
             WHERE r.member_id = %d
             ORDER BY r.relationship_type ASC",
            $member_id
        ));
    }

    /**
     * Get all relationships
     */
    public function get_all_relationships() {
        global $wpdb;
        return $wpdb->get_results("SELECT * FROM {$this->table_name} ORDER BY id ASC");
    }

    /**
     * Count total relationships
     */
    public function count_relationships() {
        global $wpdb;
        return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name}");
    }

    /**
     * Add meta box to family member edit screen
     */
    public function add_relationships_meta_box() {
        add_meta_box(
            'family_member_relationships',
            __('Family Relationships', 'chapaneri-heritage'),
            array($this, 'render_meta_box'),
            'family_member',
            'normal',
            'high'
        );
    }

    /**
     * Render relationships meta box
     */
    public function render_meta_box($post) {
        $relationships = $this->get_relationships($post->ID);
        $members = get_posts(array(
            'post_type'      => 'family_member',
            'posts_per_page' => -1,
            'orderby'        => 'title',
            'order'          => 'ASC',
            'exclude'        => array($post->ID),
        ));

        $types = array('father', 'mother', 'spouse', 'son', 'daughter', 'sibling', 'brother', 'sister');
        ?>
        <div class="chapaneri-relationships-box">
            <table class="widefat striped" id="relationships-table">
                <thead>
                    <tr>
                        <th><?php _e('Related Member', 'chapaneri-heritage'); ?></th>
                        <th><?php _e('Relationship', 'chapaneri-heritage'); ?></th>
                        <th width="80"><?php _e('Action', 'chapaneri-heritage'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($relationships)) : ?>
                        <tr class="no-relationships">
                            <td colspan="3"><?php _e('No relationships added yet.', 'chapaneri-heritage'); ?></td>
                        </tr>
                    <?php else : ?>
                        <?php foreach ($relationships as $rel) : ?>
                            <tr>
                                <td>
                                    <a href="<?php echo get_edit_post_link($rel->related_member_id); ?>">
                                        <?php echo esc_html($rel->related_member_name); ?>
                                    </a>
                                </td>
                                <td><span class="relationship-badge rel-<?php echo esc_attr($rel->relationship_type); ?>"><?php echo esc_html(ucfirst($rel->relationship_type)); ?></span></td>
                                <td>
                                    <button type="button" class="button button-small button-link-delete delete-relationship" data-id="<?php echo esc_attr($rel->id); ?>">
                                        <?php _e('Remove', 'chapaneri-heritage'); ?>
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>

            <div class="add-relationship-form" style="margin-top: 15px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px;">
                <h4 style="margin-top: 0;"><?php _e('Add Relationship', 'chapaneri-heritage'); ?></h4>
                <div style="display: flex; gap: 10px; align-items: flex-end;">
                    <div>
                        <label for="new_related_member"><?php _e('Member', 'chapaneri-heritage'); ?></label><br>
                        <select id="new_related_member" style="min-width: 200px;">
                            <option value=""><?php _e('Select member...', 'chapaneri-heritage'); ?></option>
                            <?php foreach ($members as $m) : ?>
                                <option value="<?php echo $m->ID; ?>"><?php echo esc_html($m->post_title); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div>
                        <label for="new_relationship_type"><?php _e('Type', 'chapaneri-heritage'); ?></label><br>
                        <select id="new_relationship_type">
                            <?php foreach ($types as $t) : ?>
                                <option value="<?php echo esc_attr($t); ?>"><?php echo esc_html(ucfirst($t)); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <button type="button" class="button button-primary" id="add-relationship-btn">
                        <?php _e('Add', 'chapaneri-heritage'); ?>
                    </button>
                </div>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            var postId = <?php echo $post->ID; ?>;
            var nonce = '<?php echo wp_create_nonce('chapaneri_relationships'); ?>';

            $('#add-relationship-btn').on('click', function() {
                var relatedId = $('#new_related_member').val();
                var type = $('#new_relationship_type').val();
                if (!relatedId) { alert('Please select a member.'); return; }

                $.post(ajaxurl, {
                    action: 'chapaneri_add_relationship',
                    member_id: postId,
                    related_member_id: relatedId,
                    relationship_type: type,
                    nonce: nonce
                }, function(response) {
                    if (response.success) { location.reload(); }
                    else { alert(response.data.message || 'Error adding relationship.'); }
                });
            });

            $(document).on('click', '.delete-relationship', function() {
                if (!confirm('Remove this relationship?')) return;
                var id = $(this).data('id');
                $.post(ajaxurl, {
                    action: 'chapaneri_delete_relationship',
                    relationship_id: id,
                    nonce: nonce
                }, function(response) {
                    if (response.success) { location.reload(); }
                    else { alert('Error removing relationship.'); }
                });
            });
        });
        </script>
        <?php
    }

    /**
     * AJAX: Add relationship
     */
    public function ajax_add_relationship() {
        check_ajax_referer('chapaneri_relationships', 'nonce');

        if (!current_user_can('edit_posts')) {
            wp_send_json_error(array('message' => 'Permission denied.'));
        }

        $member_id = intval($_POST['member_id']);
        $related_id = intval($_POST['related_member_id']);
        $type = sanitize_text_field($_POST['relationship_type']);

        $result = $this->add_relationship($member_id, $related_id, $type);

        if ($result) {
            // Log activity
            if (class_exists('Chapaneri_Activity_Logger')) {
                Chapaneri_Activity_Logger::instance()->log('relationship_added', 'family_member', $member_id, get_the_title($member_id), array(
                    'related_member' => get_the_title($related_id),
                    'type' => $type,
                ));
            }
            wp_send_json_success();
        } else {
            wp_send_json_error(array('message' => 'Relationship may already exist.'));
        }
    }

    /**
     * AJAX: Delete relationship
     */
    public function ajax_delete_relationship() {
        check_ajax_referer('chapaneri_relationships', 'nonce');

        if (!current_user_can('edit_posts')) {
            wp_send_json_error(array('message' => 'Permission denied.'));
        }

        $id = intval($_POST['relationship_id']);
        $result = $this->delete_relationship($id);
        wp_send_json_success();
    }

    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('chapaneri/v1', '/relationships', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'rest_get_relationships'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('chapaneri/v1', '/relationships/(?P<member_id>\d+)', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'rest_get_member_relationships'),
            'permission_callback' => '__return_true',
        ));
    }

    public function rest_get_relationships($request) {
        return rest_ensure_response($this->get_all_relationships());
    }

    public function rest_get_member_relationships($request) {
        $member_id = (int) $request['member_id'];
        return rest_ensure_response($this->get_relationships($member_id));
    }
}

// Initialize
Chapaneri_Family_Relationships::instance();
