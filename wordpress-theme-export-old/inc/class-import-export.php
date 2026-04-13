<?php
/**
 * Import/Export Family Member Data
 *
 * Provides admin functionality for backing up and restoring family member data
 * as JSON or CSV format.
 *
 * @package Chapaneri_Heritage
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Chapaneri_Import_Export
 */
class Chapaneri_Import_Export {

    /**
     * Initialize the import/export functionality
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'handle_export'));
        add_action('admin_init', array($this, 'handle_import'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }

    /**
     * Add admin menu item
     */
    public function add_admin_menu() {
        add_submenu_page(
            'edit.php?post_type=family_member',
            __('Import/Export', 'chapaneri-heritage'),
            __('Import/Export', 'chapaneri-heritage'),
            'manage_options',
            'family-import-export',
            array($this, 'render_admin_page')
        );
    }

    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'family-import-export') === false) {
            return;
        }

        wp_enqueue_style(
            'chapaneri-import-export',
            get_template_directory_uri() . '/assets/css/admin-import-export.css',
            array(),
            wp_get_theme()->get('Version')
        );
    }

    /**
     * Render admin page
     */
    public function render_admin_page() {
        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'chapaneri-heritage'));
        }

        // Get counts
        $member_count = wp_count_posts('family_member')->publish;
        
        ?>
        <div class="wrap chapaneri-import-export">
            <h1><?php _e('Import/Export Family Members', 'chapaneri-heritage'); ?></h1>
            
            <?php
            // Display messages
            if (isset($_GET['exported'])) {
                echo '<div class="notice notice-success"><p>' . esc_html__('Export completed successfully!', 'chapaneri-heritage') . '</p></div>';
            }
            if (isset($_GET['imported'])) {
                $count = intval($_GET['imported']);
                echo '<div class="notice notice-success"><p>' . sprintf(esc_html__('Successfully imported %d family member(s).', 'chapaneri-heritage'), $count) . '</p></div>';
            }
            if (isset($_GET['import_error'])) {
                $error = sanitize_text_field($_GET['import_error']);
                echo '<div class="notice notice-error"><p>' . esc_html($error) . '</p></div>';
            }
            ?>

            <div class="import-export-grid">
                <!-- Export Section -->
                <div class="import-export-card">
                    <div class="card-icon">
                        <span class="dashicons dashicons-download"></span>
                    </div>
                    <h2><?php _e('Export Family Data', 'chapaneri-heritage'); ?></h2>
                    <p><?php printf(__('Export all %d family members including their relationships, meta data, and taxonomies.', 'chapaneri-heritage'), $member_count); ?></p>
                    
                    <form method="post" action="">
                        <?php wp_nonce_field('chapaneri_export_nonce', 'export_nonce'); ?>
                        
                        <div class="export-options">
                            <label>
                                <input type="radio" name="export_format" value="json" checked>
                                <?php _e('JSON Format', 'chapaneri-heritage'); ?>
                                <span class="format-desc"><?php _e('Complete data with relationships, best for backups', 'chapaneri-heritage'); ?></span>
                            </label>
                            <label>
                                <input type="radio" name="export_format" value="csv">
                                <?php _e('CSV Format', 'chapaneri-heritage'); ?>
                                <span class="format-desc"><?php _e('Spreadsheet compatible, basic data only', 'chapaneri-heritage'); ?></span>
                            </label>
                        </div>
                        
                        <div class="export-filters">
                            <h4><?php _e('Filter Export', 'chapaneri-heritage'); ?></h4>
                            <label>
                                <input type="checkbox" name="include_deceased" value="1" checked>
                                <?php _e('Include deceased members', 'chapaneri-heritage'); ?>
                            </label>
                            <label>
                                <input type="checkbox" name="include_photos" value="1" checked>
                                <?php _e('Include photo URLs', 'chapaneri-heritage'); ?>
                            </label>
                        </div>
                        
                        <button type="submit" name="export_action" value="export" class="button button-primary button-hero">
                            <span class="dashicons dashicons-download"></span>
                            <?php _e('Export Family Data', 'chapaneri-heritage'); ?>
                        </button>
                    </form>
                </div>

                <!-- Import Section -->
                <div class="import-export-card">
                    <div class="card-icon">
                        <span class="dashicons dashicons-upload"></span>
                    </div>
                    <h2><?php _e('Import Family Data', 'chapaneri-heritage'); ?></h2>
                    <p><?php _e('Import family members from a JSON or CSV file. Duplicate entries will be updated.', 'chapaneri-heritage'); ?></p>
                    
                    <form method="post" enctype="multipart/form-data" action="">
                        <?php wp_nonce_field('chapaneri_import_nonce', 'import_nonce'); ?>
                        
                        <div class="import-dropzone" id="import-dropzone">
                            <span class="dashicons dashicons-cloud-upload"></span>
                            <p><?php _e('Drag & drop your file here or', 'chapaneri-heritage'); ?></p>
                            <label class="button button-secondary">
                                <?php _e('Choose File', 'chapaneri-heritage'); ?>
                                <input type="file" name="import_file" id="import-file" accept=".json,.csv" style="display: none;">
                            </label>
                            <p class="file-name" id="selected-file"></p>
                        </div>
                        
                        <div class="import-options">
                            <label>
                                <input type="checkbox" name="update_existing" value="1" checked>
                                <?php _e('Update existing members (match by name)', 'chapaneri-heritage'); ?>
                            </label>
                            <label>
                                <input type="checkbox" name="create_relationships" value="1" checked>
                                <?php _e('Create family relationships', 'chapaneri-heritage'); ?>
                            </label>
                            <label>
                                <input type="checkbox" name="download_photos" value="1">
                                <?php _e('Download and import photos', 'chapaneri-heritage'); ?>
                            </label>
                        </div>
                        
                        <button type="submit" name="import_action" value="import" class="button button-primary button-hero">
                            <span class="dashicons dashicons-upload"></span>
                            <?php _e('Import Family Data', 'chapaneri-heritage'); ?>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Data Preview Section -->
            <div class="import-export-card import-preview" style="display: none;" id="import-preview">
                <h3><?php _e('Import Preview', 'chapaneri-heritage'); ?></h3>
                <div class="preview-content"></div>
            </div>
            
            <!-- Help Section -->
            <div class="import-export-help">
                <h3><?php _e('Help & Tips', 'chapaneri-heritage'); ?></h3>
                <div class="help-grid">
                    <div class="help-item">
                        <h4><span class="dashicons dashicons-media-code"></span> <?php _e('JSON Format', 'chapaneri-heritage'); ?></h4>
                        <p><?php _e('JSON exports contain complete data including all relationships, taxonomies, and meta fields. Best for full backups and migrations.', 'chapaneri-heritage'); ?></p>
                    </div>
                    <div class="help-item">
                        <h4><span class="dashicons dashicons-media-spreadsheet"></span> <?php _e('CSV Format', 'chapaneri-heritage'); ?></h4>
                        <p><?php _e('CSV exports are spreadsheet-compatible and contain basic member data. Good for editing in Excel or Google Sheets.', 'chapaneri-heritage'); ?></p>
                    </div>
                    <div class="help-item">
                        <h4><span class="dashicons dashicons-admin-links"></span> <?php _e('Relationships', 'chapaneri-heritage'); ?></h4>
                        <p><?php _e('Relationships are preserved by name matching. Ensure parent and spouse names are consistent for accurate relationship restoration.', 'chapaneri-heritage'); ?></p>
                    </div>
                    <div class="help-item">
                        <h4><span class="dashicons dashicons-backup"></span> <?php _e('Backup First', 'chapaneri-heritage'); ?></h4>
                        <p><?php _e('Always create a JSON export before importing new data. This ensures you can restore if anything goes wrong.', 'chapaneri-heritage'); ?></p>
                    </div>
                </div>
            </div>
        </div>

        <script>
        (function() {
            const dropzone = document.getElementById('import-dropzone');
            const fileInput = document.getElementById('import-file');
            const fileName = document.getElementById('selected-file');

            if (dropzone && fileInput) {
                // Drag and drop handlers
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropzone.addEventListener(eventName, function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });

                ['dragenter', 'dragover'].forEach(eventName => {
                    dropzone.addEventListener(eventName, function() {
                        dropzone.classList.add('dragover');
                    });
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropzone.addEventListener(eventName, function() {
                        dropzone.classList.remove('dragover');
                    });
                });

                dropzone.addEventListener('drop', function(e) {
                    const files = e.dataTransfer.files;
                    if (files.length) {
                        fileInput.files = files;
                        updateFileName(files[0].name);
                    }
                });

                fileInput.addEventListener('change', function() {
                    if (this.files.length) {
                        updateFileName(this.files[0].name);
                    }
                });

                function updateFileName(name) {
                    fileName.textContent = name;
                    dropzone.classList.add('has-file');
                }
            }
        })();
        </script>
        <?php
    }

    /**
     * Handle export request
     */
    public function handle_export() {
        if (!isset($_POST['export_action']) || $_POST['export_action'] !== 'export') {
            return;
        }

        if (!wp_verify_nonce($_POST['export_nonce'], 'chapaneri_export_nonce')) {
            wp_die(__('Security check failed.', 'chapaneri-heritage'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions.', 'chapaneri-heritage'));
        }

        $format = isset($_POST['export_format']) ? sanitize_text_field($_POST['export_format']) : 'json';
        $include_deceased = isset($_POST['include_deceased']);
        $include_photos = isset($_POST['include_photos']);

        // Get all family members
        $args = array(
            'post_type'      => 'family_member',
            'posts_per_page' => -1,
            'orderby'        => 'title',
            'order'          => 'ASC',
        );

        $members = get_posts($args);
        $export_data = array();

        foreach ($members as $member) {
            $death_date = get_post_meta($member->ID, '_death_date', true);
            
            // Skip deceased if not included
            if (!$include_deceased && !empty($death_date)) {
                continue;
            }

            $member_data = array(
                'id'          => $member->ID,
                'name'        => $member->post_title,
                'biography'   => $member->post_content,
                'excerpt'     => $member->post_excerpt,
                'gender'      => get_post_meta($member->ID, '_gender', true),
                'birth_date'  => get_post_meta($member->ID, '_birth_date', true),
                'death_date'  => $death_date,
                'birth_place' => get_post_meta($member->ID, '_birth_place', true),
                'email'       => get_post_meta($member->ID, '_email', true),
                'phone'       => get_post_meta($member->ID, '_phone', true),
                'address'     => get_post_meta($member->ID, '_address', true),
                'father_id'   => get_post_meta($member->ID, '_father_id', true),
                'mother_id'   => get_post_meta($member->ID, '_mother_id', true),
                'spouse_id'   => get_post_meta($member->ID, '_spouse_id', true),
            );

            // Include photo if requested
            if ($include_photos && has_post_thumbnail($member->ID)) {
                $member_data['photo'] = get_the_post_thumbnail_url($member->ID, 'full');
            }

            // Get taxonomies
            $generations = wp_get_object_terms($member->ID, 'generation', array('fields' => 'names'));
            $relationships = wp_get_object_terms($member->ID, 'relationship', array('fields' => 'names'));
            
            $member_data['generation'] = !empty($generations) ? $generations[0] : '';
            $member_data['relationship_type'] = !empty($relationships) ? $relationships[0] : '';

            // For JSON, include full relationship data
            if ($format === 'json') {
                $father_id = get_post_meta($member->ID, '_father_id', true);
                $mother_id = get_post_meta($member->ID, '_mother_id', true);
                $spouse_id = get_post_meta($member->ID, '_spouse_id', true);
                
                $member_data['father_name'] = $father_id ? get_the_title($father_id) : '';
                $member_data['mother_name'] = $mother_id ? get_the_title($mother_id) : '';
                $member_data['spouse_name'] = $spouse_id ? get_the_title($spouse_id) : '';
            }

            $export_data[] = $member_data;
        }

        // Generate export file
        $filename = 'chapaneri-family-export-' . date('Y-m-d-His');

        if ($format === 'csv') {
            $this->export_csv($export_data, $filename);
        } else {
            $this->export_json($export_data, $filename);
        }
    }

    /**
     * Export as JSON
     */
    private function export_json($data, $filename) {
        $export = array(
            'version'     => '1.0',
            'exported_at' => current_time('mysql'),
            'site_url'    => home_url(),
            'members'     => $data,
        );

        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="' . $filename . '.json"');
        header('Pragma: no-cache');
        header('Expires: 0');

        echo json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Export as CSV
     */
    private function export_csv($data, $filename) {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '.csv"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');
        
        // Add BOM for Excel UTF-8 compatibility
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

        // Headers
        $headers = array(
            'Name', 'Gender', 'Birth Date', 'Death Date', 'Birth Place',
            'Email', 'Phone', 'Address', 'Generation', 'Relationship Type',
            'Father Name', 'Mother Name', 'Spouse Name', 'Biography', 'Photo URL'
        );
        fputcsv($output, $headers);

        // Data rows
        foreach ($data as $member) {
            $row = array(
                $member['name'],
                $member['gender'],
                $member['birth_date'],
                $member['death_date'],
                $member['birth_place'],
                $member['email'],
                $member['phone'],
                $member['address'],
                $member['generation'],
                $member['relationship_type'],
                isset($member['father_name']) ? $member['father_name'] : '',
                isset($member['mother_name']) ? $member['mother_name'] : '',
                isset($member['spouse_name']) ? $member['spouse_name'] : '',
                wp_strip_all_tags($member['biography']),
                isset($member['photo']) ? $member['photo'] : '',
            );
            fputcsv($output, $row);
        }

        fclose($output);
        exit;
    }

    /**
     * Handle import request
     */
    public function handle_import() {
        if (!isset($_POST['import_action']) || $_POST['import_action'] !== 'import') {
            return;
        }

        if (!wp_verify_nonce($_POST['import_nonce'], 'chapaneri_import_nonce')) {
            wp_die(__('Security check failed.', 'chapaneri-heritage'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions.', 'chapaneri-heritage'));
        }

        if (empty($_FILES['import_file']['tmp_name'])) {
            wp_redirect(add_query_arg('import_error', urlencode(__('Please select a file to import.', 'chapaneri-heritage')), admin_url('edit.php?post_type=family_member&page=family-import-export')));
            exit;
        }

        $file = $_FILES['import_file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($ext, array('json', 'csv'))) {
            wp_redirect(add_query_arg('import_error', urlencode(__('Invalid file format. Please use JSON or CSV.', 'chapaneri-heritage')), admin_url('edit.php?post_type=family_member&page=family-import-export')));
            exit;
        }

        $update_existing = isset($_POST['update_existing']);
        $create_relationships = isset($_POST['create_relationships']);
        $download_photos = isset($_POST['download_photos']);

        $content = file_get_contents($file['tmp_name']);

        if ($ext === 'json') {
            $imported = $this->import_json($content, $update_existing, $create_relationships, $download_photos);
        } else {
            $imported = $this->import_csv($content, $update_existing, $create_relationships, $download_photos);
        }

        wp_redirect(add_query_arg('imported', $imported, admin_url('edit.php?post_type=family_member&page=family-import-export')));
        exit;
    }

    /**
     * Import from JSON
     */
    private function import_json($content, $update_existing, $create_relationships, $download_photos) {
        $data = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['members'])) {
            wp_redirect(add_query_arg('import_error', urlencode(__('Invalid JSON format.', 'chapaneri-heritage')), admin_url('edit.php?post_type=family_member&page=family-import-export')));
            exit;
        }

        $imported = 0;
        $name_to_id = array();

        // First pass: Create/update members
        foreach ($data['members'] as $member_data) {
            $post_id = $this->import_member($member_data, $update_existing, $download_photos);
            if ($post_id) {
                $name_to_id[$member_data['name']] = $post_id;
                $imported++;
            }
        }

        // Second pass: Create relationships
        if ($create_relationships) {
            foreach ($data['members'] as $member_data) {
                if (!isset($name_to_id[$member_data['name']])) {
                    continue;
                }
                $post_id = $name_to_id[$member_data['name']];

                // Father
                if (!empty($member_data['father_name']) && isset($name_to_id[$member_data['father_name']])) {
                    update_post_meta($post_id, '_father_id', $name_to_id[$member_data['father_name']]);
                }

                // Mother
                if (!empty($member_data['mother_name']) && isset($name_to_id[$member_data['mother_name']])) {
                    update_post_meta($post_id, '_mother_id', $name_to_id[$member_data['mother_name']]);
                }

                // Spouse
                if (!empty($member_data['spouse_name']) && isset($name_to_id[$member_data['spouse_name']])) {
                    update_post_meta($post_id, '_spouse_id', $name_to_id[$member_data['spouse_name']]);
                }
            }
        }

        return $imported;
    }

    /**
     * Import from CSV
     */
    private function import_csv($content, $update_existing, $create_relationships, $download_photos) {
        // Remove BOM if present
        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content);
        
        $lines = array_map('str_getcsv', explode("\n", $content));
        $headers = array_shift($lines);

        if (!$headers) {
            return 0;
        }

        // Normalize headers
        $headers = array_map('trim', $headers);
        $headers = array_map('strtolower', $headers);
        $headers = array_map(function($h) {
            return str_replace(' ', '_', $h);
        }, $headers);

        $imported = 0;
        $name_to_id = array();

        // First pass: Create/update members
        foreach ($lines as $line) {
            if (count($line) < count($headers)) {
                continue;
            }

            $member_data = array_combine($headers, $line);
            
            // Map CSV headers to our format
            $formatted = array(
                'name'              => isset($member_data['name']) ? $member_data['name'] : '',
                'gender'            => isset($member_data['gender']) ? $member_data['gender'] : '',
                'birth_date'        => isset($member_data['birth_date']) ? $member_data['birth_date'] : '',
                'death_date'        => isset($member_data['death_date']) ? $member_data['death_date'] : '',
                'birth_place'       => isset($member_data['birth_place']) ? $member_data['birth_place'] : '',
                'email'             => isset($member_data['email']) ? $member_data['email'] : '',
                'phone'             => isset($member_data['phone']) ? $member_data['phone'] : '',
                'address'           => isset($member_data['address']) ? $member_data['address'] : '',
                'biography'         => isset($member_data['biography']) ? $member_data['biography'] : '',
                'generation'        => isset($member_data['generation']) ? $member_data['generation'] : '',
                'relationship_type' => isset($member_data['relationship_type']) ? $member_data['relationship_type'] : '',
                'father_name'       => isset($member_data['father_name']) ? $member_data['father_name'] : '',
                'mother_name'       => isset($member_data['mother_name']) ? $member_data['mother_name'] : '',
                'spouse_name'       => isset($member_data['spouse_name']) ? $member_data['spouse_name'] : '',
                'photo'             => isset($member_data['photo_url']) ? $member_data['photo_url'] : '',
            );

            if (empty($formatted['name'])) {
                continue;
            }

            $post_id = $this->import_member($formatted, $update_existing, $download_photos);
            if ($post_id) {
                $name_to_id[$formatted['name']] = $post_id;
                $imported++;
            }
        }

        // Second pass: Create relationships
        if ($create_relationships) {
            foreach ($lines as $line) {
                if (count($line) < count($headers)) {
                    continue;
                }

                $member_data = array_combine($headers, $line);
                $name = isset($member_data['name']) ? $member_data['name'] : '';

                if (empty($name) || !isset($name_to_id[$name])) {
                    continue;
                }

                $post_id = $name_to_id[$name];

                // Father
                $father_name = isset($member_data['father_name']) ? $member_data['father_name'] : '';
                if (!empty($father_name) && isset($name_to_id[$father_name])) {
                    update_post_meta($post_id, '_father_id', $name_to_id[$father_name]);
                }

                // Mother
                $mother_name = isset($member_data['mother_name']) ? $member_data['mother_name'] : '';
                if (!empty($mother_name) && isset($name_to_id[$mother_name])) {
                    update_post_meta($post_id, '_mother_id', $name_to_id[$mother_name]);
                }

                // Spouse
                $spouse_name = isset($member_data['spouse_name']) ? $member_data['spouse_name'] : '';
                if (!empty($spouse_name) && isset($name_to_id[$spouse_name])) {
                    update_post_meta($post_id, '_spouse_id', $name_to_id[$spouse_name]);
                }
            }
        }

        return $imported;
    }

    /**
     * Import a single member
     */
    private function import_member($data, $update_existing, $download_photos) {
        $name = sanitize_text_field($data['name']);

        if (empty($name)) {
            return false;
        }

        // Check if member exists
        $existing = get_posts(array(
            'post_type'      => 'family_member',
            'title'          => $name,
            'posts_per_page' => 1,
            'post_status'    => 'any',
        ));

        if (!empty($existing) && $update_existing) {
            $post_id = $existing[0]->ID;
            
            wp_update_post(array(
                'ID'           => $post_id,
                'post_content' => isset($data['biography']) ? wp_kses_post($data['biography']) : '',
            ));
        } elseif (!empty($existing)) {
            // Don't update existing
            return $existing[0]->ID;
        } else {
            // Create new
            $post_id = wp_insert_post(array(
                'post_type'   => 'family_member',
                'post_title'  => $name,
                'post_content'=> isset($data['biography']) ? wp_kses_post($data['biography']) : '',
                'post_status' => 'publish',
            ));

            if (is_wp_error($post_id)) {
                return false;
            }
        }

        // Update meta fields
        $meta_fields = array(
            '_gender'      => 'gender',
            '_birth_date'  => 'birth_date',
            '_death_date'  => 'death_date',
            '_birth_place' => 'birth_place',
            '_email'       => 'email',
            '_phone'       => 'phone',
            '_address'     => 'address',
        );

        foreach ($meta_fields as $meta_key => $data_key) {
            if (isset($data[$data_key]) && !empty($data[$data_key])) {
                update_post_meta($post_id, $meta_key, sanitize_text_field($data[$data_key]));
            }
        }

        // Set taxonomies
        if (!empty($data['generation'])) {
            wp_set_object_terms($post_id, $data['generation'], 'generation');
        }

        if (!empty($data['relationship_type'])) {
            wp_set_object_terms($post_id, $data['relationship_type'], 'relationship');
        }

        // Handle photo
        if ($download_photos && !empty($data['photo'])) {
            $this->import_photo($post_id, $data['photo']);
        }

        return $post_id;
    }

    /**
     * Import photo from URL
     */
    private function import_photo($post_id, $url) {
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $tmp = download_url($url);

        if (is_wp_error($tmp)) {
            return false;
        }

        $file_array = array(
            'name'     => basename(parse_url($url, PHP_URL_PATH)),
            'tmp_name' => $tmp,
        );

        $id = media_handle_sideload($file_array, $post_id);

        if (is_wp_error($id)) {
            @unlink($tmp);
            return false;
        }

        set_post_thumbnail($post_id, $id);
        return true;
    }
}

// Initialize
new Chapaneri_Import_Export();
