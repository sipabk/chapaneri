<?php
/**
 * Theme Shortcodes
 *
 * Provides shortcodes for embedding family search and statistics anywhere.
 *
 * @package Chapaneri_Heritage
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register all shortcodes
 */
function chapaneri_register_shortcodes() {
    add_shortcode('family_search', 'chapaneri_shortcode_family_search');
    add_shortcode('family_stats', 'chapaneri_shortcode_family_stats');
    add_shortcode('family_member', 'chapaneri_shortcode_family_member');
    add_shortcode('family_members_list', 'chapaneri_shortcode_family_members_list');
}
add_action('init', 'chapaneri_register_shortcodes');

/**
 * Shortcode: [family_search]
 * 
 * Embeds the AJAX-powered family member search box.
 * 
 * Attributes:
 * - placeholder: Custom placeholder text (default: "Search family members...")
 * - min_chars: Minimum characters before search triggers (default: 2)
 * - show_filters: Whether to show filter dropdowns (default: false)
 * 
 * Usage:
 * [family_search]
 * [family_search placeholder="Find a relative..." min_chars="3"]
 * [family_search show_filters="true"]
 */
function chapaneri_shortcode_family_search($atts) {
    $atts = shortcode_atts(array(
        'placeholder'  => __('Search family members...', 'chapaneri-heritage'),
        'min_chars'    => 2,
        'show_filters' => 'false',
    ), $atts, 'family_search');
    
    $show_filters = filter_var($atts['show_filters'], FILTER_VALIDATE_BOOLEAN);
    
    ob_start();
    ?>
    <div class="shortcode-family-search">
        <div class="ajax-search-container" data-ajax-search data-min-chars="<?php echo esc_attr($atts['min_chars']); ?>">
            <div class="ajax-search__input-wrapper">
                <svg class="ajax-search__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                    type="text" 
                    data-ajax-search-input 
                    class="ajax-search__input" 
                    placeholder="<?php echo esc_attr($atts['placeholder']); ?>"
                    aria-label="<?php echo esc_attr($atts['placeholder']); ?>"
                >
                <div class="ajax-search__loader" data-ajax-search-loader>
                    <span class="ajax-search__spinner"></span>
                </div>
            </div>
            
            <?php if ($show_filters) : 
                $generations = get_terms(array(
                    'taxonomy'   => 'generation',
                    'hide_empty' => true,
                ));
                
                $locations = array();
                $members = get_posts(array(
                    'post_type'      => 'family_member',
                    'posts_per_page' => -1,
                    'fields'         => 'ids',
                ));
                foreach ($members as $member_id) {
                    $place = get_post_meta($member_id, '_birth_place', true);
                    if ($place && !in_array($place, $locations)) {
                        $locations[] = $place;
                    }
                }
                sort($locations);
            ?>
                <div class="ajax-search__filters">
                    <select class="ajax-search__filter" data-filter="generation">
                        <option value=""><?php esc_html_e('All Generations', 'chapaneri-heritage'); ?></option>
                        <?php foreach ($generations as $gen) : ?>
                            <option value="<?php echo esc_attr($gen->slug); ?>"><?php echo esc_html($gen->name); ?></option>
                        <?php endforeach; ?>
                    </select>
                    
                    <select class="ajax-search__filter" data-filter="gender">
                        <option value=""><?php esc_html_e('All Genders', 'chapaneri-heritage'); ?></option>
                        <option value="male"><?php esc_html_e('Male', 'chapaneri-heritage'); ?></option>
                        <option value="female"><?php esc_html_e('Female', 'chapaneri-heritage'); ?></option>
                    </select>
                    
                    <select class="ajax-search__filter" data-filter="location">
                        <option value=""><?php esc_html_e('All Locations', 'chapaneri-heritage'); ?></option>
                        <?php foreach ($locations as $location) : ?>
                            <option value="<?php echo esc_attr($location); ?>"><?php echo esc_html($location); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            <?php endif; ?>
            
            <div class="ajax-search__results" data-ajax-search-results></div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Shortcode: [family_stats]
 * 
 * Displays family statistics.
 * 
 * Attributes:
 * - layout: Display layout - "horizontal", "vertical", or "grid" (default: horizontal)
 * - show_total: Show total members count (default: true)
 * - show_generations: Show generations count (default: true)
 * - show_locations: Show locations count (default: true)
 * - show_living: Show living members count (default: true)
 * 
 * Usage:
 * [family_stats]
 * [family_stats layout="grid"]
 * [family_stats layout="vertical" show_living="false"]
 */
function chapaneri_shortcode_family_stats($atts) {
    $atts = shortcode_atts(array(
        'layout'           => 'horizontal',
        'show_total'       => 'true',
        'show_generations' => 'true',
        'show_locations'   => 'true',
        'show_living'      => 'true',
    ), $atts, 'family_stats');
    
    $show_total = filter_var($atts['show_total'], FILTER_VALIDATE_BOOLEAN);
    $show_generations = filter_var($atts['show_generations'], FILTER_VALIDATE_BOOLEAN);
    $show_locations = filter_var($atts['show_locations'], FILTER_VALIDATE_BOOLEAN);
    $show_living = filter_var($atts['show_living'], FILTER_VALIDATE_BOOLEAN);
    
    // Get stats
    $stats = chapaneri_get_family_stats();
    
    $generations = get_terms(array(
        'taxonomy'   => 'generation',
        'hide_empty' => true,
    ));
    $generations_count = is_array($generations) ? count($generations) : 0;
    
    $locations = array();
    $members = get_posts(array(
        'post_type'      => 'family_member',
        'posts_per_page' => -1,
        'fields'         => 'ids',
    ));
    foreach ($members as $member_id) {
        $place = get_post_meta($member_id, '_birth_place', true);
        if ($place && !in_array($place, $locations)) {
            $locations[] = $place;
        }
    }
    $locations_count = count($locations);
    
    $layout_class = in_array($atts['layout'], array('horizontal', 'vertical', 'grid')) ? $atts['layout'] : 'horizontal';
    
    ob_start();
    ?>
    <div class="shortcode-family-stats shortcode-family-stats--<?php echo esc_attr($layout_class); ?>">
        <?php if ($show_total) : ?>
            <div class="shortcode-stat-item">
                <div class="shortcode-stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <div class="shortcode-stat-content">
                    <span class="shortcode-stat-value"><?php echo esc_html($stats['total']); ?></span>
                    <span class="shortcode-stat-label"><?php esc_html_e('Family Members', 'chapaneri-heritage'); ?></span>
                </div>
            </div>
        <?php endif; ?>
        
        <?php if ($show_generations) : ?>
            <div class="shortcode-stat-item">
                <div class="shortcode-stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                </div>
                <div class="shortcode-stat-content">
                    <span class="shortcode-stat-value"><?php echo esc_html($generations_count); ?></span>
                    <span class="shortcode-stat-label"><?php esc_html_e('Generations', 'chapaneri-heritage'); ?></span>
                </div>
            </div>
        <?php endif; ?>
        
        <?php if ($show_locations) : ?>
            <div class="shortcode-stat-item">
                <div class="shortcode-stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </div>
                <div class="shortcode-stat-content">
                    <span class="shortcode-stat-value"><?php echo esc_html($locations_count); ?></span>
                    <span class="shortcode-stat-label"><?php esc_html_e('Locations', 'chapaneri-heritage'); ?></span>
                </div>
            </div>
        <?php endif; ?>
        
        <?php if ($show_living) : ?>
            <div class="shortcode-stat-item">
                <div class="shortcode-stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
                <div class="shortcode-stat-content">
                    <span class="shortcode-stat-value"><?php echo esc_html($stats['living']); ?></span>
                    <span class="shortcode-stat-label"><?php esc_html_e('Living Members', 'chapaneri-heritage'); ?></span>
                </div>
            </div>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Shortcode: [family_member]
 * 
 * Displays a single family member card.
 * 
 * Attributes:
 * - id: The family member post ID (required)
 * - show_photo: Show member photo (default: true)
 * - show_dates: Show birth/death dates (default: true)
 * - show_location: Show birthplace (default: true)
 * 
 * Usage:
 * [family_member id="123"]
 * [family_member id="123" show_dates="false"]
 */
function chapaneri_shortcode_family_member($atts) {
    $atts = shortcode_atts(array(
        'id'            => 0,
        'show_photo'    => 'true',
        'show_dates'    => 'true',
        'show_location' => 'true',
    ), $atts, 'family_member');
    
    $member_id = absint($atts['id']);
    if (!$member_id) {
        return '<p class="shortcode-error">' . esc_html__('Please provide a valid family member ID.', 'chapaneri-heritage') . '</p>';
    }
    
    $post = get_post($member_id);
    if (!$post || $post->post_type !== 'family_member' || $post->post_status !== 'publish') {
        return '<p class="shortcode-error">' . esc_html__('Family member not found.', 'chapaneri-heritage') . '</p>';
    }
    
    $show_photo = filter_var($atts['show_photo'], FILTER_VALIDATE_BOOLEAN);
    $show_dates = filter_var($atts['show_dates'], FILTER_VALIDATE_BOOLEAN);
    $show_location = filter_var($atts['show_location'], FILTER_VALIDATE_BOOLEAN);
    
    $member = chapaneri_get_family_member($member_id);
    $generations = wp_get_object_terms($member_id, 'generation');
    
    ob_start();
    ?>
    <div class="shortcode-member-card">
        <a href="<?php echo esc_url(get_permalink($member_id)); ?>" class="shortcode-member-link">
            <?php if ($show_photo) : ?>
                <div class="shortcode-member-avatar <?php echo esc_attr($member['gender']); ?>">
                    <?php if (has_post_thumbnail($member_id)) : ?>
                        <?php echo get_the_post_thumbnail($member_id, 'thumbnail'); ?>
                    <?php else : ?>
                        <?php echo esc_html(mb_substr($member['name'], 0, 1)); ?>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <div class="shortcode-member-info">
                <h4 class="shortcode-member-name"><?php echo esc_html($member['name']); ?></h4>
                
                <?php if (!empty($generations)) : ?>
                    <span class="shortcode-member-generation"><?php echo esc_html($generations[0]->name); ?></span>
                <?php endif; ?>
                
                <?php if ($show_dates && $member['birthDate']) : ?>
                    <span class="shortcode-member-dates">
                        <?php 
                        echo esc_html(date('Y', strtotime($member['birthDate'])));
                        if ($member['deathDate']) {
                            echo ' - ' . esc_html(date('Y', strtotime($member['deathDate'])));
                        }
                        ?>
                    </span>
                <?php endif; ?>
                
                <?php if ($show_location && $member['birthPlace']) : ?>
                    <span class="shortcode-member-location">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <?php echo esc_html($member['birthPlace']); ?>
                    </span>
                <?php endif; ?>
            </div>
        </a>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Shortcode: [family_members_list]
 * 
 * Displays a list of family members.
 * 
 * Attributes:
 * - count: Number of members to display (default: 6)
 * - generation: Filter by generation slug (default: all)
 * - gender: Filter by gender - male/female (default: all)
 * - orderby: Order by - name, date, rand (default: name)
 * - order: Order direction - ASC, DESC (default: ASC)
 * - layout: Display layout - grid, list (default: grid)
 * - columns: Number of columns for grid layout (default: 3)
 * 
 * Usage:
 * [family_members_list]
 * [family_members_list count="12" generation="first-generation"]
 * [family_members_list orderby="rand" count="4"]
 */
function chapaneri_shortcode_family_members_list($atts) {
    $atts = shortcode_atts(array(
        'count'      => 6,
        'generation' => '',
        'gender'     => '',
        'orderby'    => 'name',
        'order'      => 'ASC',
        'layout'     => 'grid',
        'columns'    => 3,
    ), $atts, 'family_members_list');
    
    $args = array(
        'post_type'      => 'family_member',
        'posts_per_page' => absint($atts['count']),
        'orderby'        => $atts['orderby'] === 'name' ? 'title' : $atts['orderby'],
        'order'          => in_array(strtoupper($atts['order']), array('ASC', 'DESC')) ? strtoupper($atts['order']) : 'ASC',
    );
    
    // Filter by generation
    if (!empty($atts['generation'])) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'generation',
                'field'    => 'slug',
                'terms'    => sanitize_text_field($atts['generation']),
            ),
        );
    }
    
    // Filter by gender
    if (!empty($atts['gender']) && in_array($atts['gender'], array('male', 'female'))) {
        $args['meta_query'] = array(
            array(
                'key'   => '_gender',
                'value' => sanitize_text_field($atts['gender']),
            ),
        );
    }
    
    $query = new WP_Query($args);
    
    if (!$query->have_posts()) {
        return '<p class="shortcode-no-results">' . esc_html__('No family members found.', 'chapaneri-heritage') . '</p>';
    }
    
    $layout_class = $atts['layout'] === 'list' ? 'list' : 'grid';
    $columns = absint($atts['columns']);
    $columns = max(1, min(6, $columns)); // Limit 1-6 columns
    
    ob_start();
    ?>
    <div class="shortcode-members-list shortcode-members-list--<?php echo esc_attr($layout_class); ?>" style="--columns: <?php echo esc_attr($columns); ?>">
        <?php while ($query->have_posts()) : $query->the_post();
            $member = chapaneri_get_family_member(get_the_ID());
            $generations = wp_get_object_terms(get_the_ID(), 'generation');
        ?>
            <div class="shortcode-member-card">
                <a href="<?php echo esc_url(get_permalink()); ?>" class="shortcode-member-link">
                    <div class="shortcode-member-avatar <?php echo esc_attr($member['gender']); ?>">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php the_post_thumbnail('thumbnail'); ?>
                        <?php else : ?>
                            <?php echo esc_html(mb_substr(get_the_title(), 0, 1)); ?>
                        <?php endif; ?>
                    </div>
                    
                    <div class="shortcode-member-info">
                        <h4 class="shortcode-member-name"><?php the_title(); ?></h4>
                        
                        <?php if (!empty($generations)) : ?>
                            <span class="shortcode-member-generation"><?php echo esc_html($generations[0]->name); ?></span>
                        <?php endif; ?>
                        
                        <?php if ($member['birthDate']) : ?>
                            <span class="shortcode-member-dates">
                                <?php 
                                echo esc_html(date('Y', strtotime($member['birthDate'])));
                                if ($member['deathDate']) {
                                    echo ' - ' . esc_html(date('Y', strtotime($member['deathDate'])));
                                }
                                ?>
                            </span>
                        <?php endif; ?>
                    </div>
                </a>
            </div>
        <?php endwhile; wp_reset_postdata(); ?>
    </div>
    <?php
    return ob_get_clean();
}
