<?php
/**
 * Template Name: Family Search
 * 
 * Advanced search page for family members with filters.
 *
 * @package Chapaneri_Heritage
 */

get_header();

// Get search parameters
$search_query = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
$generation_filter = isset($_GET['generation']) ? sanitize_text_field($_GET['generation']) : '';
$gender_filter = isset($_GET['gender']) ? sanitize_text_field($_GET['gender']) : '';
$location_filter = isset($_GET['location']) ? sanitize_text_field($_GET['location']) : '';
$sort_by = isset($_GET['sort']) ? sanitize_text_field($_GET['sort']) : 'name';
$is_searching = !empty($search_query) || !empty($generation_filter) || !empty($gender_filter) || !empty($location_filter);

// Get all generations for filter
$generations = get_terms(array(
    'taxonomy'   => 'generation',
    'hide_empty' => true,
));

// Get all unique locations
$all_members = get_posts(array(
    'post_type'      => 'family_member',
    'posts_per_page' => -1,
    'fields'         => 'ids',
));

$locations = array();
foreach ($all_members as $member_id) {
    $place = get_post_meta($member_id, '_birth_place', true);
    if ($place && !in_array($place, $locations)) {
        $locations[] = $place;
    }
}
sort($locations);
?>

<div class="container section">
    <!-- Page Header with AJAX Search -->
    <header class="search-page-header">
        <h1 class="page-title font-display"><?php esc_html_e('Search Family Members', 'chapaneri-heritage'); ?></h1>
        <p class="page-description">
            <?php esc_html_e('Find relatives quickly with instant search or use the filters below for detailed results.', 'chapaneri-heritage'); ?>
        </p>
        
        <!-- AJAX Instant Search -->
        <div class="ajax-search-container" data-ajax-search data-min-chars="2">
            <div class="ajax-search__input-wrapper">
                <svg class="ajax-search__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                    type="text" 
                    data-ajax-search-input
                    class="ajax-search__input"
                    placeholder="<?php esc_attr_e('Start typing to search instantly...', 'chapaneri-heritage'); ?>"
                    autocomplete="off"
                >
                <div class="ajax-search__loader" data-ajax-search-loader>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                </div>
            </div>
            <div class="ajax-search__results" data-ajax-search-results></div>
        </div>
    </header>

    <!-- Advanced Filters -->
    <div class="search-filters heritage-card">
        <h3 class="search-filters__title font-display">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <?php esc_html_e('Advanced Filters', 'chapaneri-heritage'); ?>
        </h3>
        
        <form method="get" class="search-filters__form">
            <!-- Search Input -->
            <div class="search-filter-group search-filter--query">
                <label for="s" class="form-label"><?php esc_html_e('Name', 'chapaneri-heritage'); ?></label>
                <input 
                    type="text" 
                    name="s" 
                    id="s" 
                    class="form-input" 
                    placeholder="<?php esc_attr_e('Search by name...', 'chapaneri-heritage'); ?>" 
                    value="<?php echo esc_attr($search_query); ?>"
                >
            </div>
            
            <!-- Generation Filter -->
            <div class="search-filter-group">
                <label for="generation" class="form-label"><?php esc_html_e('Generation', 'chapaneri-heritage'); ?></label>
                <select name="generation" id="generation" class="form-input">
                    <option value=""><?php esc_html_e('All Generations', 'chapaneri-heritage'); ?></option>
                    <?php foreach ($generations as $gen) : ?>
                        <option value="<?php echo esc_attr($gen->slug); ?>" <?php selected($generation_filter, $gen->slug); ?>>
                            <?php echo esc_html($gen->name); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            
            <!-- Gender Filter -->
            <div class="search-filter-group">
                <label for="gender" class="form-label"><?php esc_html_e('Gender', 'chapaneri-heritage'); ?></label>
                <select name="gender" id="gender" class="form-input">
                    <option value=""><?php esc_html_e('All', 'chapaneri-heritage'); ?></option>
                    <option value="male" <?php selected($gender_filter, 'male'); ?>><?php esc_html_e('Male', 'chapaneri-heritage'); ?></option>
                    <option value="female" <?php selected($gender_filter, 'female'); ?>><?php esc_html_e('Female', 'chapaneri-heritage'); ?></option>
                </select>
            </div>
            
            <!-- Location Filter -->
            <div class="search-filter-group">
                <label for="location" class="form-label"><?php esc_html_e('Birthplace', 'chapaneri-heritage'); ?></label>
                <select name="location" id="location" class="form-input">
                    <option value=""><?php esc_html_e('All Locations', 'chapaneri-heritage'); ?></option>
                    <?php foreach ($locations as $loc) : ?>
                        <option value="<?php echo esc_attr($loc); ?>" <?php selected($location_filter, $loc); ?>>
                            <?php echo esc_html($loc); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            
            <!-- Sort By -->
            <div class="search-filter-group">
                <label for="sort" class="form-label"><?php esc_html_e('Sort By', 'chapaneri-heritage'); ?></label>
                <select name="sort" id="sort" class="form-input">
                    <option value="name" <?php selected($sort_by, 'name'); ?>><?php esc_html_e('Name (A-Z)', 'chapaneri-heritage'); ?></option>
                    <option value="name_desc" <?php selected($sort_by, 'name_desc'); ?>><?php esc_html_e('Name (Z-A)', 'chapaneri-heritage'); ?></option>
                    <option value="birth_date" <?php selected($sort_by, 'birth_date'); ?>><?php esc_html_e('Birth Date (Oldest)', 'chapaneri-heritage'); ?></option>
                    <option value="birth_date_desc" <?php selected($sort_by, 'birth_date_desc'); ?>><?php esc_html_e('Birth Date (Newest)', 'chapaneri-heritage'); ?></option>
                </select>
            </div>
            
            <div class="search-filter-actions">
                <button type="submit" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <?php esc_html_e('Search', 'chapaneri-heritage'); ?>
                </button>
                <a href="<?php echo esc_url(get_permalink()); ?>" class="btn btn-ghost">
                    <?php esc_html_e('Clear Filters', 'chapaneri-heritage'); ?>
                </a>
            </div>
        </form>
    </div>

    <!-- Search Results -->
    <?php if ($is_searching) : 
        // Build query args
        $args = array(
            'post_type'      => 'family_member',
            'posts_per_page' => 24,
            'paged'          => get_query_var('paged') ? get_query_var('paged') : 1,
        );
        
        // Search query
        if ($search_query) {
            $args['s'] = $search_query;
        }
        
        // Generation filter
        if ($generation_filter) {
            $args['tax_query'][] = array(
                'taxonomy' => 'generation',
                'field'    => 'slug',
                'terms'    => $generation_filter,
            );
        }
        
        // Gender filter
        if ($gender_filter) {
            $args['meta_query'][] = array(
                'key'   => '_gender',
                'value' => $gender_filter,
            );
        }
        
        // Location filter
        if ($location_filter) {
            $args['meta_query'][] = array(
                'key'     => '_birth_place',
                'value'   => $location_filter,
                'compare' => 'LIKE',
            );
        }
        
        // Sorting
        switch ($sort_by) {
            case 'name_desc':
                $args['orderby'] = 'title';
                $args['order'] = 'DESC';
                break;
            case 'birth_date':
                $args['meta_key'] = '_birth_date';
                $args['orderby'] = 'meta_value';
                $args['order'] = 'ASC';
                break;
            case 'birth_date_desc':
                $args['meta_key'] = '_birth_date';
                $args['orderby'] = 'meta_value';
                $args['order'] = 'DESC';
                break;
            default:
                $args['orderby'] = 'title';
                $args['order'] = 'ASC';
        }
        
        $search_results = new WP_Query($args);
    ?>
        
        <div class="search-results-header">
            <h2 class="search-results-title font-display">
                <?php esc_html_e('Search Results', 'chapaneri-heritage'); ?>
            </h2>
            <p class="search-results-count">
                <?php printf(
                    esc_html(_n('%d member found', '%d members found', $search_results->found_posts, 'chapaneri-heritage')),
                    $search_results->found_posts
                ); ?>
            </p>
        </div>
        
        <?php if ($search_results->have_posts()) : ?>
            <div class="search-results-grid">
                <?php while ($search_results->have_posts()) : $search_results->the_post(); 
                    $member = chapaneri_get_family_member(get_the_ID());
                    $relationships = wp_get_object_terms(get_the_ID(), 'relationship');
                    $generations_terms = wp_get_object_terms(get_the_ID(), 'generation');
                ?>
                    <a href="<?php the_permalink(); ?>" class="search-result-card">
                        <div class="search-result-card__avatar <?php echo esc_attr($member['gender']); ?>">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('thumbnail'); ?>
                            <?php else : ?>
                                <?php echo esc_html(mb_substr(get_the_title(), 0, 1)); ?>
                            <?php endif; ?>
                        </div>
                        
                        <div class="search-result-card__content">
                            <h3 class="search-result-card__name"><?php the_title(); ?></h3>
                            
                            <?php if (!empty($generations_terms)) : ?>
                                <span class="search-result-card__badge"><?php echo esc_html($generations_terms[0]->name); ?></span>
                            <?php endif; ?>
                            
                            <div class="search-result-card__meta">
                                <?php if ($member['birthDate']) : ?>
                                    <span class="search-result-card__meta-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <?php echo esc_html(date('M d, Y', strtotime($member['birthDate']))); ?>
                                    </span>
                                <?php endif; ?>
                                
                                <?php if ($member['birthPlace']) : ?>
                                    <span class="search-result-card__meta-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <?php echo esc_html($member['birthPlace']); ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <svg class="search-result-card__arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>
                <?php endwhile; ?>
            </div>
            
            <!-- Pagination -->
            <div class="pagination-wrapper">
                <?php
                echo paginate_links(array(
                    'total'     => $search_results->max_num_pages,
                    'current'   => max(1, get_query_var('paged')),
                    'prev_text' => '&laquo; ' . __('Previous', 'chapaneri-heritage'),
                    'next_text' => __('Next', 'chapaneri-heritage') . ' &raquo;',
                ));
                ?>
            </div>
            
            <?php wp_reset_postdata(); ?>
            
        <?php else : ?>
            <div class="search-no-results heritage-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="8" x2="14" y2="14"></line>
                    <line x1="14" y1="8" x2="8" y2="14"></line>
                </svg>
                <h3 class="font-display"><?php esc_html_e('No Members Found', 'chapaneri-heritage'); ?></h3>
                <p><?php esc_html_e('No family members match your search criteria. Try adjusting your filters or search terms.', 'chapaneri-heritage'); ?></p>
                <a href="<?php echo esc_url(get_permalink()); ?>" class="btn btn-secondary">
                    <?php esc_html_e('Clear All Filters', 'chapaneri-heritage'); ?>
                </a>
            </div>
        <?php endif; ?>
        
    <?php else : ?>
        <!-- Initial State - No Search Yet -->
        <div class="search-initial-state">
            <div class="search-initial-state__content heritage-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3 class="font-display"><?php esc_html_e('Search Your Family', 'chapaneri-heritage'); ?></h3>
                <p><?php esc_html_e('Use the instant search above for quick lookups, or apply filters for more specific results.', 'chapaneri-heritage'); ?></p>
                
                <div class="search-quick-stats">
                    <?php $stats = function_exists('chapaneri_get_family_stats') ? chapaneri_get_family_stats() : array('total' => 0, 'living' => 0, 'totalMembers' => 0, 'generations' => 0, 'places' => 0, 'marriages' => 0); ?>
                    <div class="search-quick-stat">
                        <span class="search-quick-stat__value"><?php echo esc_html($stats['total']); ?></span>
                        <span class="search-quick-stat__label"><?php esc_html_e('Total Members', 'chapaneri-heritage'); ?></span>
                    </div>
                    <div class="search-quick-stat">
                        <span class="search-quick-stat__value"><?php echo count($generations); ?></span>
                        <span class="search-quick-stat__label"><?php esc_html_e('Generations', 'chapaneri-heritage'); ?></span>
                    </div>
                    <div class="search-quick-stat">
                        <span class="search-quick-stat__value"><?php echo count($locations); ?></span>
                        <span class="search-quick-stat__label"><?php esc_html_e('Locations', 'chapaneri-heritage'); ?></span>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>

<?php
get_footer();
