<?php
/**
 * Activity Logger
 *
 * Logs member CRUD operations with user, timestamp, and changes JSON.
 *
 * @package Chapaneri_Heritage
 * @since 3.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Chapaneri_Activity_Logger {

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
        $this->table_name = $wpdb->prefix . 'family_activity_logs';

        add_action('admin_init', array($this, 'maybe_create_table'));
        add_action('save_post_family_member', array($this, 'log_member_save'), 20, 3);
        add_action('before_delete_post', array($this, 'log_member_delete'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    /**
     * Create activity logs table
     */
    public function maybe_create_table() {
        global $wpdb;

        $installed_ver = get_option('chapaneri_activity_logs_db_version', '0');
        $current_ver = '3.0.0';

        if ($installed_ver === $current_ver) {
            return;
        }

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$this->table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            action_type varchar(50) NOT NULL DEFAULT '',
            entity_type varchar(50) NOT NULL DEFAULT 'family_member',
            entity_id bigint(20) unsigned NOT NULL DEFAULT 0,
            entity_name varchar(255) NOT NULL DEFAULT '',
            performed_by bigint(20) unsigned DEFAULT NULL,
            performed_by_email varchar(255) NOT NULL DEFAULT '',
            changes longtext DEFAULT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY idx_entity_type (entity_type),
            KEY idx_created_at (created_at)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);

        update_option('chapaneri_activity_logs_db_version', $current_ver);
    }

    /**
     * Log an activity
     */
    public function log($action_type, $entity_type, $entity_id, $entity_name = '', $changes = null) {
        global $wpdb;

        $user = wp_get_current_user();

        $wpdb->insert($this->table_name, array(
            'action_type'        => $action_type,
            'entity_type'        => $entity_type,
            'entity_id'          => $entity_id,
            'entity_name'        => $entity_name,
            'performed_by'       => $user->ID ?: null,
            'performed_by_email' => $user->user_email ?: 'system',
            'changes'            => $changes ? wp_json_encode($changes) : null,
        ), array('%s', '%s', '%d', '%s', '%d', '%s', '%s'));
    }

    /**
     * Auto-log member saves
     */
    public function log_member_save($post_id, $post, $update) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (wp_is_post_revision($post_id)) return;

        $action = $update ? 'updated' : 'created';
        $this->log($action, 'family_member', $post_id, $post->post_title);
    }

    /**
     * Auto-log member deletes
     */
    public function log_member_delete($post_id) {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'family_member') return;
        $this->log('deleted', 'family_member', $post_id, $post->post_title);
    }

    /**
     * Get recent activity logs
     */
    public function get_logs($limit = 50, $offset = 0) {
        global $wpdb;

        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$this->table_name} ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $limit, $offset
        ));
    }

    /**
     * Count total logs
     */
    public function count_logs() {
        global $wpdb;
        return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name}");
    }

    /**
     * Register REST routes
     */
    public function register_rest_routes() {
        register_rest_route('chapaneri/v1', '/activity-logs', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'rest_get_logs'),
            'permission_callback' => function() { return current_user_can('manage_options'); },
        ));
    }

    public function rest_get_logs($request) {
        $limit = $request->get_param('limit') ?: 50;
        return rest_ensure_response($this->get_logs($limit));
    }
}

Chapaneri_Activity_Logger::instance();
