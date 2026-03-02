<?php
/**
 * Archive Template for Family Members
 *
 * @package Chapaneri_Heritage
 */

get_header();

$search_query = isset($_GET['search']) ? sanitize_text_field($_GET['search']) : '';
$generation_filter = isset($_GET['generation']) ? sanitize_text_field($_GET['generation']) : '';
$gender_filter = isset($_GET['gender']) ? sanitize_text_field($_GET['gender']) : '';

// Get all generations for filter
$generations = get_terms(array(
    'taxonomy'   => 'generation',
    'hide_empty' => true,
));
?>

<div class="container section">
    <!-- Page Header -->
    <header class="page-header">
        <h1 class="page-title font-display"><?php esc_html_e('Family Directory', 'chapaneri-heritage'); ?></h1>
        <p class="page-description">
            <?php esc_html_e('Browse all members of our family tree. Use the filters to find specific relatives.', 'chapaneri-heritage'); ?>
        </p>
    </header>

    <!-- Filters -->
    <div class="filters-bar heritage-card">
        <form method="get" class="filters-form">
            <!-- Search -->
            <div class="filter-group filter-search">
                <label for="search" class="form-label"><?php esc_html_e('Search', 'chapaneri-heritage'); ?></label>
                <div class="search-input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" name="search" id="search" class="form-input" placeholder="<?php esc_attr_e('Search by name...', 'chapaneri-heritage'); ?>" value="<?php echo esc_attr($search_query); ?>">
                </div>
            </div>
            
            <!-- Generation Filter -->
            <div class="filter-group">
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
            <div class="filter-group">
                <label for="gender" class="form-label"><?php esc_html_e('Gender', 'chapaneri-heritage'); ?></label>
                <select name="gender" id="gender" class="form-input">
                    <option value=""><?php esc_html_e('All', 'chapaneri-heritage'); ?></option>
                    <option value="male" <?php selected($gender_filter, 'male'); ?>><?php esc_html_e('Male', 'chapaneri-heritage'); ?></option>
                    <option value="female" <?php selected($gender_filter, 'female'); ?>><?php esc_html_e('Female', 'chapaneri-heritage'); ?></option>
                </select>
            </div>
            
            <div class="filter-actions">
                <button type="submit" class="btn btn-primary"><?php esc_html_e('Apply Filters', 'chapaneri-heritage'); ?></button>
                <a href="<?php echo esc_url(get_post_type_archive_link('family_member')); ?>" class="btn btn-ghost"><?php esc_html_e('Clear', 'chapaneri-heritage'); ?></a>
            </div>
        </form>
    </div>

    <!-- Members Grid -->
    <?php
    $args = array(
        'post_type'      => 'family_member',
        'posts_per_page' => 24,
        'paged'          => get_query_var('paged') ? get_query_var('paged') : 1,
        'orderby'        => 'title',
        'order'          => 'ASC',
    );
    
    // Add search filter
    if ($search_query) {
        $args['s'] = $search_query;
    }
    
    // Add generation filter
    if ($generation_filter) {
        $args['tax_query'][] = array(
            'taxonomy' => 'generation',
            'field'    => 'slug',
            'terms'    => $generation_filter,
        );
    }
    
    // Add gender filter
    if ($gender_filter) {
        $args['meta_query'][] = array(
            'key'   => '_gender',
            'value' => $gender_filter,
        );
    }
    
    $members_query = new WP_Query($args);
    ?>

    <?php if ($members_query->have_posts()) : ?>
        <div class="results-count">
            <?php printf(
                esc_html(_n('%d member found', '%d members found', $members_query->found_posts, 'chapaneri-heritage')),
                $members_query->found_posts
            ); ?>
        </div>
        
        <div class="members-grid">
            <?php while ($members_query->have_posts()) : $members_query->the_post(); 
                $member = chapaneri_get_family_member(get_the_ID());
                $relationships = wp_get_object_terms(get_the_ID(), 'relationship');
                $spouse = chapaneri_get_spouse(get_the_ID());
                $children = chapaneri_get_children(get_the_ID());
            ?>
                <a href="<?php the_permalink(); ?>" class="member-card">
                    <div class="member-card-header">
                        <div class="avatar avatar-lg <?php echo esc_attr($member['gender']); ?>">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('thumbnail'); ?>
                            <?php else : ?>
                                <?php echo esc_html(mb_substr(get_the_title(), 0, 1)); ?>
                            <?php endif; ?>
                        </div>
                        <div>
                            <h3 class="member-card-name"><?php the_title(); ?></h3>
                            <?php if (!empty($relationships)) : ?>
                                <p class="member-card-relation"><?php echo esc_html($relationships[0]->name); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <div class="member-card-details">
                        <?php if ($member['birthDate']) : ?>
                            <span>
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
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <?php echo esc_html($member['birthPlace']); ?>
                            </span>
                        <?php endif; ?>
                        
                        <?php if ($spouse) : ?>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                <?php echo esc_html($spouse['name']); ?>
                            </span>
                        <?php endif; ?>
                        
                        <?php if (!empty($children)) : ?>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <?php printf(esc_html(_n('%d child', '%d children', count($children), 'chapaneri-heritage')), count($children)); ?>
                            </span>
                        <?php endif; ?>
                    </div>
                </a>
            <?php endwhile; ?>
        </div>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
            <?php
            echo paginate_links(array(
                'total'     => $members_query->max_num_pages,
                'current'   => max(1, get_query_var('paged')),
                'prev_text' => '&laquo; ' . __('Previous', 'chapaneri-heritage'),
                'next_text' => __('Next', 'chapaneri-heritage') . ' &raquo;',
            ));
            ?>
        </div>
        
        <?php wp_reset_postdata(); ?>
        
    <?php else : ?>
        <div class="no-results heritage-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto; display: block; opacity: 0.5;">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3 class="font-display"><?php esc_html_e('No Members Found', 'chapaneri-heritage'); ?></h3>
            <p><?php esc_html_e('No family members match your current filters. Try adjusting your search criteria.', 'chapaneri-heritage'); ?></p>
            <a href="<?php echo esc_url(get_post_type_archive_link('family_member')); ?>" class="btn btn-secondary">
                <?php esc_html_e('Clear All Filters', 'chapaneri-heritage'); ?>
            </a>
        </div>
    <?php endif; ?>
</div>

<?php
get_footer();
