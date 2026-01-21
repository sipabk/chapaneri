<?php
/**
 * Chapaneri Family Heritage Theme Functions
 *
 * @package Chapaneri_Heritage
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function chapaneri_heritage_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    
    // Add theme support for dark mode
    add_theme_support('dark-editor-style');
    
    // Add editor color palette
    add_theme_support('editor-color-palette', array(
        array(
            'name'  => __('Primary (Burgundy)', 'chapaneri-heritage'),
            'slug'  => 'primary',
            'color' => 'hsl(350, 45%, 35%)',
        ),
        array(
            'name'  => __('Secondary (Cream)', 'chapaneri-heritage'),
            'slug'  => 'secondary',
            'color' => 'hsl(38, 35%, 92%)',
        ),
        array(
            'name'  => __('Accent (Gold)', 'chapaneri-heritage'),
            'slug'  => 'accent',
            'color' => 'hsl(42, 85%, 55%)',
        ),
        array(
            'name'  => __('Success (Heritage Green)', 'chapaneri-heritage'),
            'slug'  => 'success',
            'color' => 'hsl(145, 35%, 38%)',
        ),
        array(
            'name'  => __('Background', 'chapaneri-heritage'),
            'slug'  => 'background',
            'color' => 'hsl(40, 20%, 98%)',
        ),
        array(
            'name'  => __('Foreground', 'chapaneri-heritage'),
            'slug'  => 'foreground',
            'color' => 'hsl(25, 30%, 12%)',
        ),
        array(
            'name'  => __('Muted', 'chapaneri-heritage'),
            'slug'  => 'muted',
            'color' => 'hsl(35, 20%, 90%)',
        ),
        array(
            'name'  => __('Border', 'chapaneri-heritage'),
            'slug'  => 'border',
            'color' => 'hsl(35, 25%, 85%)',
        ),
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary'   => __('Primary Menu', 'chapaneri-heritage'),
        'footer'    => __('Footer Menu', 'chapaneri-heritage'),
    ));
    
    // Set content width
    if (!isset($content_width)) {
        $content_width = 1200;
    }
}
add_action('after_setup_theme', 'chapaneri_heritage_setup');

/**
 * Enqueue Scripts and Styles
 */
function chapaneri_heritage_scripts() {
    // Main stylesheet
    wp_enqueue_style(
        'chapaneri-heritage-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get('Version')
    );
    
    // Google Fonts
    wp_enqueue_style(
        'chapaneri-heritage-fonts',
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );
    
    // Theme JavaScript
    wp_enqueue_script(
        'chapaneri-heritage-navigation',
        get_template_directory_uri() . '/assets/js/navigation.js',
        array(),
        wp_get_theme()->get('Version'),
        true
    );
    
    // Dark mode toggle
    wp_enqueue_script(
        'chapaneri-heritage-dark-mode',
        get_template_directory_uri() . '/assets/js/dark-mode.js',
        array(),
        wp_get_theme()->get('Version'),
        true
    );
}
add_action('wp_enqueue_scripts', 'chapaneri_heritage_scripts');

/**
 * Register Sidebars
 */
function chapaneri_heritage_widgets_init() {
    register_sidebar(array(
        'name'          => __('Main Sidebar', 'chapaneri-heritage'),
        'id'            => 'sidebar-main',
        'description'   => __('Add widgets here to appear in the main sidebar.', 'chapaneri-heritage'),
        'before_widget' => '<section id="%1$s" class="widget heritage-card %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title font-display">',
        'after_title'   => '</h3>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Column 1', 'chapaneri-heritage'),
        'id'            => 'footer-1',
        'description'   => __('Add widgets for the first footer column.', 'chapaneri-heritage'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title font-display">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Column 2', 'chapaneri-heritage'),
        'id'            => 'footer-2',
        'description'   => __('Add widgets for the second footer column.', 'chapaneri-heritage'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title font-display">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Column 3', 'chapaneri-heritage'),
        'id'            => 'footer-3',
        'description'   => __('Add widgets for the third footer column.', 'chapaneri-heritage'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title font-display">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'chapaneri_heritage_widgets_init');

/**
 * Custom Post Type: Family Member
 */
function chapaneri_heritage_register_family_member_cpt() {
    $labels = array(
        'name'                  => _x('Family Members', 'Post type general name', 'chapaneri-heritage'),
        'singular_name'         => _x('Family Member', 'Post type singular name', 'chapaneri-heritage'),
        'menu_name'             => _x('Family Members', 'Admin Menu text', 'chapaneri-heritage'),
        'name_admin_bar'        => _x('Family Member', 'Add New on Toolbar', 'chapaneri-heritage'),
        'add_new'               => __('Add New', 'chapaneri-heritage'),
        'add_new_item'          => __('Add New Family Member', 'chapaneri-heritage'),
        'new_item'              => __('New Family Member', 'chapaneri-heritage'),
        'edit_item'             => __('Edit Family Member', 'chapaneri-heritage'),
        'view_item'             => __('View Family Member', 'chapaneri-heritage'),
        'all_items'             => __('All Members', 'chapaneri-heritage'),
        'search_items'          => __('Search Family Members', 'chapaneri-heritage'),
        'parent_item_colon'     => __('Parent Member:', 'chapaneri-heritage'),
        'not_found'             => __('No family members found.', 'chapaneri-heritage'),
        'not_found_in_trash'    => __('No family members found in Trash.', 'chapaneri-heritage'),
        'featured_image'        => _x('Member Photo', 'Overrides the "Featured Image" phrase', 'chapaneri-heritage'),
        'set_featured_image'    => _x('Set member photo', 'Overrides the "Set featured image" phrase', 'chapaneri-heritage'),
        'remove_featured_image' => _x('Remove member photo', 'Overrides the "Remove featured image" phrase', 'chapaneri-heritage'),
        'use_featured_image'    => _x('Use as member photo', 'Overrides the "Use as featured image" phrase', 'chapaneri-heritage'),
        'archives'              => _x('Family Member Archives', 'The post type archive label', 'chapaneri-heritage'),
        'insert_into_item'      => _x('Insert into family member', 'Overrides the "Insert into post" phrase', 'chapaneri-heritage'),
        'uploaded_to_this_item' => _x('Uploaded to this family member', 'Overrides the "Uploaded to this post" phrase', 'chapaneri-heritage'),
        'filter_items_list'     => _x('Filter family members list', 'Screen reader text', 'chapaneri-heritage'),
        'items_list_navigation' => _x('Family members list navigation', 'Screen reader text', 'chapaneri-heritage'),
        'items_list'            => _x('Family members list', 'Screen reader text', 'chapaneri-heritage'),
    );
    
    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'family-member'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-groups',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'show_in_rest'       => true,
    );
    
    register_post_type('family_member', $args);
}
add_action('init', 'chapaneri_heritage_register_family_member_cpt');

/**
 * Custom Taxonomy: Generation
 */
function chapaneri_heritage_register_generation_taxonomy() {
    $labels = array(
        'name'              => _x('Generations', 'taxonomy general name', 'chapaneri-heritage'),
        'singular_name'     => _x('Generation', 'taxonomy singular name', 'chapaneri-heritage'),
        'search_items'      => __('Search Generations', 'chapaneri-heritage'),
        'all_items'         => __('All Generations', 'chapaneri-heritage'),
        'parent_item'       => __('Parent Generation', 'chapaneri-heritage'),
        'parent_item_colon' => __('Parent Generation:', 'chapaneri-heritage'),
        'edit_item'         => __('Edit Generation', 'chapaneri-heritage'),
        'update_item'       => __('Update Generation', 'chapaneri-heritage'),
        'add_new_item'      => __('Add New Generation', 'chapaneri-heritage'),
        'new_item_name'     => __('New Generation Name', 'chapaneri-heritage'),
        'menu_name'         => __('Generations', 'chapaneri-heritage'),
    );
    
    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'generation'),
        'show_in_rest'      => true,
    );
    
    register_taxonomy('generation', array('family_member'), $args);
}
add_action('init', 'chapaneri_heritage_register_generation_taxonomy');

/**
 * Custom Taxonomy: Relationship
 */
function chapaneri_heritage_register_relationship_taxonomy() {
    $labels = array(
        'name'              => _x('Relationships', 'taxonomy general name', 'chapaneri-heritage'),
        'singular_name'     => _x('Relationship', 'taxonomy singular name', 'chapaneri-heritage'),
        'search_items'      => __('Search Relationships', 'chapaneri-heritage'),
        'all_items'         => __('All Relationships', 'chapaneri-heritage'),
        'edit_item'         => __('Edit Relationship', 'chapaneri-heritage'),
        'update_item'       => __('Update Relationship', 'chapaneri-heritage'),
        'add_new_item'      => __('Add New Relationship', 'chapaneri-heritage'),
        'new_item_name'     => __('New Relationship Name', 'chapaneri-heritage'),
        'menu_name'         => __('Relationships', 'chapaneri-heritage'),
    );
    
    $args = array(
        'hierarchical'      => false,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'relationship'),
        'show_in_rest'      => true,
    );
    
    register_taxonomy('relationship', array('family_member'), $args);
}
add_action('init', 'chapaneri_heritage_register_relationship_taxonomy');

/**
 * Add Custom Meta Boxes for Family Member
 */
function chapaneri_heritage_add_family_member_meta_boxes() {
    add_meta_box(
        'family_member_details',
        __('Member Details', 'chapaneri-heritage'),
        'chapaneri_heritage_family_member_details_callback',
        'family_member',
        'normal',
        'high'
    );
    
    add_meta_box(
        'family_member_connections',
        __('Family Connections', 'chapaneri-heritage'),
        'chapaneri_heritage_family_member_connections_callback',
        'family_member',
        'normal',
        'default'
    );
}
add_action('add_meta_boxes', 'chapaneri_heritage_add_family_member_meta_boxes');

/**
 * Meta Box Callback: Member Details
 */
function chapaneri_heritage_family_member_details_callback($post) {
    wp_nonce_field('chapaneri_heritage_save_meta', 'chapaneri_heritage_meta_nonce');
    
    $birth_date = get_post_meta($post->ID, '_birth_date', true);
    $death_date = get_post_meta($post->ID, '_death_date', true);
    $birth_place = get_post_meta($post->ID, '_birth_place', true);
    $gender = get_post_meta($post->ID, '_gender', true);
    $email = get_post_meta($post->ID, '_email', true);
    $phone = get_post_meta($post->ID, '_phone', true);
    $address = get_post_meta($post->ID, '_address', true);
    
    ?>
    <table class="form-table">
        <tr>
            <th><label for="gender"><?php _e('Gender', 'chapaneri-heritage'); ?></label></th>
            <td>
                <select name="gender" id="gender">
                    <option value=""><?php _e('Select Gender', 'chapaneri-heritage'); ?></option>
                    <option value="male" <?php selected($gender, 'male'); ?>><?php _e('Male', 'chapaneri-heritage'); ?></option>
                    <option value="female" <?php selected($gender, 'female'); ?>><?php _e('Female', 'chapaneri-heritage'); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="birth_date"><?php _e('Birth Date', 'chapaneri-heritage'); ?></label></th>
            <td><input type="date" name="birth_date" id="birth_date" value="<?php echo esc_attr($birth_date); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="death_date"><?php _e('Death Date', 'chapaneri-heritage'); ?></label></th>
            <td><input type="date" name="death_date" id="death_date" value="<?php echo esc_attr($death_date); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="birth_place"><?php _e('Birth Place', 'chapaneri-heritage'); ?></label></th>
            <td><input type="text" name="birth_place" id="birth_place" value="<?php echo esc_attr($birth_place); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="email"><?php _e('Email', 'chapaneri-heritage'); ?></label></th>
            <td><input type="email" name="email" id="email" value="<?php echo esc_attr($email); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="phone"><?php _e('Phone', 'chapaneri-heritage'); ?></label></th>
            <td><input type="tel" name="phone" id="phone" value="<?php echo esc_attr($phone); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="address"><?php _e('Address', 'chapaneri-heritage'); ?></label></th>
            <td><textarea name="address" id="address" class="large-text" rows="3"><?php echo esc_textarea($address); ?></textarea></td>
        </tr>
    </table>
    <?php
}

/**
 * Meta Box Callback: Family Connections
 */
function chapaneri_heritage_family_member_connections_callback($post) {
    $spouse_id = get_post_meta($post->ID, '_spouse_id', true);
    $parent_ids = get_post_meta($post->ID, '_parent_ids', true);
    $children_ids = get_post_meta($post->ID, '_children_ids', true);
    
    // Get all family members for dropdown
    $members = get_posts(array(
        'post_type'      => 'family_member',
        'posts_per_page' => -1,
        'orderby'        => 'title',
        'order'          => 'ASC',
        'exclude'        => array($post->ID),
    ));
    
    ?>
    <table class="form-table">
        <tr>
            <th><label for="spouse_id"><?php _e('Spouse', 'chapaneri-heritage'); ?></label></th>
            <td>
                <select name="spouse_id" id="spouse_id">
                    <option value=""><?php _e('Select Spouse', 'chapaneri-heritage'); ?></option>
                    <?php foreach ($members as $member) : ?>
                        <option value="<?php echo $member->ID; ?>" <?php selected($spouse_id, $member->ID); ?>>
                            <?php echo esc_html($member->post_title); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="parent_ids"><?php _e('Parents', 'chapaneri-heritage'); ?></label></th>
            <td>
                <select name="parent_ids[]" id="parent_ids" multiple style="width: 100%; min-height: 100px;">
                    <?php foreach ($members as $member) : ?>
                        <option value="<?php echo $member->ID; ?>" <?php echo (is_array($parent_ids) && in_array($member->ID, $parent_ids)) ? 'selected' : ''; ?>>
                            <?php echo esc_html($member->post_title); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <p class="description"><?php _e('Hold Ctrl/Cmd to select multiple parents.', 'chapaneri-heritage'); ?></p>
            </td>
        </tr>
        <tr>
            <th><label for="children_ids"><?php _e('Children', 'chapaneri-heritage'); ?></label></th>
            <td>
                <select name="children_ids[]" id="children_ids" multiple style="width: 100%; min-height: 100px;">
                    <?php foreach ($members as $member) : ?>
                        <option value="<?php echo $member->ID; ?>" <?php echo (is_array($children_ids) && in_array($member->ID, $children_ids)) ? 'selected' : ''; ?>>
                            <?php echo esc_html($member->post_title); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <p class="description"><?php _e('Hold Ctrl/Cmd to select multiple children.', 'chapaneri-heritage'); ?></p>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Save Meta Box Data
 */
function chapaneri_heritage_save_family_member_meta($post_id) {
    // Check nonce
    if (!isset($_POST['chapaneri_heritage_meta_nonce']) || !wp_verify_nonce($_POST['chapaneri_heritage_meta_nonce'], 'chapaneri_heritage_save_meta')) {
        return;
    }
    
    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // Check permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Save meta fields
    $fields = array('birth_date', 'death_date', 'birth_place', 'gender', 'email', 'phone', 'address', 'spouse_id');
    
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
    
    // Save array fields
    if (isset($_POST['parent_ids'])) {
        update_post_meta($post_id, '_parent_ids', array_map('intval', $_POST['parent_ids']));
    } else {
        delete_post_meta($post_id, '_parent_ids');
    }
    
    if (isset($_POST['children_ids'])) {
        update_post_meta($post_id, '_children_ids', array_map('intval', $_POST['children_ids']));
    } else {
        delete_post_meta($post_id, '_children_ids');
    }
}
add_action('save_post_family_member', 'chapaneri_heritage_save_family_member_meta');

/**
 * Customizer Settings
 */
function chapaneri_heritage_customize_register($wp_customize) {
    // Hero Section
    $wp_customize->add_section('chapaneri_hero_section', array(
        'title'    => __('Hero Section', 'chapaneri-heritage'),
        'priority' => 30,
    ));
    
    $wp_customize->add_setting('hero_title', array(
        'default'           => __('Chapaneri Family', 'chapaneri-heritage'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    
    $wp_customize->add_control('hero_title', array(
        'label'   => __('Hero Title', 'chapaneri-heritage'),
        'section' => 'chapaneri_hero_section',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('hero_subtitle', array(
        'default'           => __('Heritage Archive', 'chapaneri-heritage'),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));
    
    $wp_customize->add_control('hero_subtitle', array(
        'label'   => __('Hero Subtitle', 'chapaneri-heritage'),
        'section' => 'chapaneri_hero_section',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('hero_description', array(
        'default'           => __('Preserving our legacy, honoring our ancestors, and connecting generations through shared history and stories.', 'chapaneri-heritage'),
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ));
    
    $wp_customize->add_control('hero_description', array(
        'label'   => __('Hero Description', 'chapaneri-heritage'),
        'section' => 'chapaneri_hero_section',
        'type'    => 'textarea',
    ));
    
    $wp_customize->add_setting('hero_background', array(
        'default'           => '',
        'sanitize_callback' => 'absint',
    ));
    
    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'hero_background', array(
        'label'     => __('Hero Background Image', 'chapaneri-heritage'),
        'section'   => 'chapaneri_hero_section',
        'mime_type' => 'image',
    )));
    
    // Family Stats Section
    $wp_customize->add_section('chapaneri_stats_section', array(
        'title'    => __('Family Statistics', 'chapaneri-heritage'),
        'priority' => 35,
    ));
    
    $wp_customize->add_setting('show_stats', array(
        'default'           => true,
        'sanitize_callback' => 'wp_validate_boolean',
    ));
    
    $wp_customize->add_control('show_stats', array(
        'label'   => __('Show Statistics Section', 'chapaneri-heritage'),
        'section' => 'chapaneri_stats_section',
        'type'    => 'checkbox',
    ));
}
add_action('customize_register', 'chapaneri_heritage_customize_register');

/**
 * Helper Functions
 */

/**
 * Get Family Member by ID
 */
function chapaneri_get_family_member($id) {
    $post = get_post($id);
    
    if (!$post || $post->post_type !== 'family_member') {
        return null;
    }
    
    return array(
        'id'         => $post->ID,
        'name'       => $post->post_title,
        'bio'        => $post->post_content,
        'excerpt'    => $post->post_excerpt,
        'gender'     => get_post_meta($post->ID, '_gender', true),
        'birthDate'  => get_post_meta($post->ID, '_birth_date', true),
        'deathDate'  => get_post_meta($post->ID, '_death_date', true),
        'birthPlace' => get_post_meta($post->ID, '_birth_place', true),
        'email'      => get_post_meta($post->ID, '_email', true),
        'phone'      => get_post_meta($post->ID, '_phone', true),
        'address'    => get_post_meta($post->ID, '_address', true),
        'spouseId'   => get_post_meta($post->ID, '_spouse_id', true),
        'parentIds'  => get_post_meta($post->ID, '_parent_ids', true) ?: array(),
        'childIds'   => get_post_meta($post->ID, '_children_ids', true) ?: array(),
        'photo'      => get_the_post_thumbnail_url($post->ID, 'medium'),
        'permalink'  => get_permalink($post->ID),
    );
}

/**
 * Get All Family Members
 */
function chapaneri_get_all_family_members($args = array()) {
    $defaults = array(
        'post_type'      => 'family_member',
        'posts_per_page' => -1,
        'orderby'        => 'title',
        'order'          => 'ASC',
    );
    
    $query_args = wp_parse_args($args, $defaults);
    $posts = get_posts($query_args);
    
    return array_map('chapaneri_get_family_member', wp_list_pluck($posts, 'ID'));
}

/**
 * Get Family Members by Generation
 */
function chapaneri_get_members_by_generation($generation) {
    return chapaneri_get_all_family_members(array(
        'tax_query' => array(
            array(
                'taxonomy' => 'generation',
                'field'    => 'slug',
                'terms'    => $generation,
            ),
        ),
    ));
}

/**
 * Get Children of a Member
 */
function chapaneri_get_children($member_id) {
    $children_ids = get_post_meta($member_id, '_children_ids', true);
    
    if (empty($children_ids)) {
        return array();
    }
    
    return array_filter(array_map('chapaneri_get_family_member', $children_ids));
}

/**
 * Get Parents of a Member
 */
function chapaneri_get_parents($member_id) {
    $parent_ids = get_post_meta($member_id, '_parent_ids', true);
    
    if (empty($parent_ids)) {
        return array();
    }
    
    return array_filter(array_map('chapaneri_get_family_member', $parent_ids));
}

/**
 * Get Spouse of a Member
 */
function chapaneri_get_spouse($member_id) {
    $spouse_id = get_post_meta($member_id, '_spouse_id', true);
    
    if (empty($spouse_id)) {
        return null;
    }
    
    return chapaneri_get_family_member($spouse_id);
}

/**
 * Get Family Statistics
 */
function chapaneri_get_family_stats() {
    $members = chapaneri_get_all_family_members();
    
    $generations = wp_get_object_terms(wp_list_pluck($members, 'id'), 'generation');
    $unique_places = array_unique(array_filter(wp_list_pluck($members, 'birthPlace')));
    $marriages = count(array_filter(wp_list_pluck($members, 'spouseId'))) / 2;
    
    return array(
        'totalMembers'  => count($members),
        'generations'   => count($generations),
        'places'        => count($unique_places),
        'marriages'     => intval($marriages),
    );
}

/**
 * Flush Rewrite Rules on Theme Activation
 */
function chapaneri_heritage_rewrite_flush() {
    chapaneri_heritage_register_family_member_cpt();
    chapaneri_heritage_register_generation_taxonomy();
    chapaneri_heritage_register_relationship_taxonomy();
    flush_rewrite_rules();
}
add_action('after_switch_theme', 'chapaneri_heritage_rewrite_flush');
