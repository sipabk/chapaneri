<?php
/**
 * Gutenberg Blocks for Family Heritage
 *
 * Provides visual editor blocks for family member shortcodes.
 *
 * @package Chapaneri_Heritage
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Chapaneri_Gutenberg_Blocks
 */
class Chapaneri_Gutenberg_Blocks {

    /**
     * Initialize the blocks
     */
    public function __construct() {
        add_action('init', array($this, 'register_blocks'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
    }

    /**
     * Register blocks
     */
    public function register_blocks() {
        // Family Search Block
        register_block_type('chapaneri/family-search', array(
            'editor_script'   => 'chapaneri-blocks-editor',
            'editor_style'    => 'chapaneri-blocks-editor-style',
            'render_callback' => array($this, 'render_search_block'),
            'attributes'      => array(
                'showFilters' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
                'placeholder' => array(
                    'type'    => 'string',
                    'default' => 'Search family members...',
                ),
            ),
        ));

        // Family Stats Block
        register_block_type('chapaneri/family-stats', array(
            'editor_script'   => 'chapaneri-blocks-editor',
            'editor_style'    => 'chapaneri-blocks-editor-style',
            'render_callback' => array($this, 'render_stats_block'),
            'attributes'      => array(
                'layout' => array(
                    'type'    => 'string',
                    'default' => 'grid',
                ),
                'showTotal' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
                'showGenerations' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
                'showLocations' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
                'showLiving' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
            ),
        ));

        // Family Member Block
        register_block_type('chapaneri/family-member', array(
            'editor_script'   => 'chapaneri-blocks-editor',
            'editor_style'    => 'chapaneri-blocks-editor-style',
            'render_callback' => array($this, 'render_member_block'),
            'attributes'      => array(
                'memberId' => array(
                    'type'    => 'number',
                    'default' => 0,
                ),
                'showPhoto' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
                'showDates' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
                'showPlace' => array(
                    'type'    => 'boolean',
                    'default' => true,
                ),
            ),
        ));

        // Family Members List Block
        register_block_type('chapaneri/family-members-list', array(
            'editor_script'   => 'chapaneri-blocks-editor',
            'editor_style'    => 'chapaneri-blocks-editor-style',
            'render_callback' => array($this, 'render_members_list_block'),
            'attributes'      => array(
                'generation' => array(
                    'type'    => 'string',
                    'default' => '',
                ),
                'gender' => array(
                    'type'    => 'string',
                    'default' => '',
                ),
                'count' => array(
                    'type'    => 'number',
                    'default' => 12,
                ),
                'layout' => array(
                    'type'    => 'string',
                    'default' => 'grid',
                ),
            ),
        ));
    }

    /**
     * Enqueue editor assets
     */
    public function enqueue_editor_assets() {
        // Editor script
        wp_enqueue_script(
            'chapaneri-blocks-editor',
            get_template_directory_uri() . '/assets/js/blocks.js',
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-data'),
            wp_get_theme()->get('Version'),
            true
        );

        // Get family members for the member selector
        $members = get_posts(array(
            'post_type'      => 'family_member',
            'posts_per_page' => -1,
            'orderby'        => 'title',
            'order'          => 'ASC',
        ));

        $member_options = array(array('value' => 0, 'label' => __('Select a member...', 'chapaneri-heritage')));
        foreach ($members as $member) {
            $member_options[] = array(
                'value' => $member->ID,
                'label' => $member->post_title,
            );
        }

        // Get generations
        $generations = get_terms(array(
            'taxonomy'   => 'generation',
            'hide_empty' => false,
        ));

        $generation_options = array(array('value' => '', 'label' => __('All Generations', 'chapaneri-heritage')));
        foreach ($generations as $gen) {
            $generation_options[] = array(
                'value' => $gen->slug,
                'label' => $gen->name,
            );
        }

        wp_localize_script('chapaneri-blocks-editor', 'chapaneriBlocksData', array(
            'members'     => $member_options,
            'generations' => $generation_options,
            'siteUrl'     => home_url(),
        ));

        // Editor styles
        wp_enqueue_style(
            'chapaneri-blocks-editor-style',
            get_template_directory_uri() . '/assets/css/blocks-editor.css',
            array('wp-edit-blocks'),
            wp_get_theme()->get('Version')
        );
    }

    /**
     * Render search block
     */
    public function render_search_block($attributes) {
        $show_filters = $attributes['showFilters'] ? 'true' : 'false';
        $placeholder = esc_attr($attributes['placeholder']);

        return do_shortcode("[family_search show_filters=\"{$show_filters}\" placeholder=\"{$placeholder}\"]");
    }

    /**
     * Render stats block
     */
    public function render_stats_block($attributes) {
        $layout = esc_attr($attributes['layout']);
        $stats = array();

        if ($attributes['showTotal']) $stats[] = 'total';
        if ($attributes['showGenerations']) $stats[] = 'generations';
        if ($attributes['showLocations']) $stats[] = 'locations';
        if ($attributes['showLiving']) $stats[] = 'living';

        $show = implode(',', $stats);

        return do_shortcode("[family_stats layout=\"{$layout}\" show=\"{$show}\"]");
    }

    /**
     * Render member block
     */
    public function render_member_block($attributes) {
        if (empty($attributes['memberId'])) {
            return '<p class="shortcode-empty">' . esc_html__('Please select a family member.', 'chapaneri-heritage') . '</p>';
        }

        $id = intval($attributes['memberId']);
        $show_photo = $attributes['showPhoto'] ? 'true' : 'false';
        $show_dates = $attributes['showDates'] ? 'true' : 'false';
        $show_place = $attributes['showPlace'] ? 'true' : 'false';

        return do_shortcode("[family_member id=\"{$id}\" show_photo=\"{$show_photo}\" show_dates=\"{$show_dates}\" show_place=\"{$show_place}\"]");
    }

    /**
     * Render members list block
     */
    public function render_members_list_block($attributes) {
        $generation = esc_attr($attributes['generation']);
        $gender = esc_attr($attributes['gender']);
        $count = intval($attributes['count']);
        $layout = esc_attr($attributes['layout']);

        return do_shortcode("[family_members_list generation=\"{$generation}\" gender=\"{$gender}\" count=\"{$count}\" layout=\"{$layout}\"]");
    }
}

// Initialize
new Chapaneri_Gutenberg_Blocks();
