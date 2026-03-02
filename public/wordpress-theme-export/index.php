<?php
/**
 * The main template file
 *
 * @package Chapaneri_Heritage
 */

get_header();
?>

<div class="container section">
    <?php if (have_posts()) : ?>
        
        <header class="page-header">
            <?php if (is_home() && !is_front_page()) : ?>
                <h1 class="page-title font-display"><?php single_post_title(); ?></h1>
            <?php elseif (is_archive()) : ?>
                <?php the_archive_title('<h1 class="page-title font-display">', '</h1>'); ?>
                <?php the_archive_description('<div class="archive-description">', '</div>'); ?>
            <?php elseif (is_search()) : ?>
                <h1 class="page-title font-display">
                    <?php printf(esc_html__('Search Results for: %s', 'chapaneri-heritage'), '<span>' . get_search_query() . '</span>'); ?>
                </h1>
            <?php endif; ?>
        </header>

        <div class="posts-grid">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('card'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="card-image">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium_large'); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                    
                    <div class="card-header">
                        <h2 class="card-title">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                        <p class="card-description">
                            <?php echo get_the_date(); ?>
                        </p>
                    </div>
                    
                    <div class="card-content">
                        <?php the_excerpt(); ?>
                    </div>
                    
                    <div class="card-footer">
                        <a href="<?php the_permalink(); ?>" class="btn btn-secondary">
                            <?php esc_html_e('Read More', 'chapaneri-heritage'); ?>
                        </a>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>

        <?php the_posts_pagination(array(
            'mid_size'  => 2,
            'prev_text' => __('&laquo; Previous', 'chapaneri-heritage'),
            'next_text' => __('Next &raquo;', 'chapaneri-heritage'),
        )); ?>

    <?php else : ?>
        
        <div class="no-results heritage-card">
            <h2 class="font-display"><?php esc_html_e('Nothing Found', 'chapaneri-heritage'); ?></h2>
            <p><?php esc_html_e('It seems we can\'t find what you\'re looking for.', 'chapaneri-heritage'); ?></p>
            
            <?php if (is_search()) : ?>
                <p><?php esc_html_e('Perhaps try a different search term?', 'chapaneri-heritage'); ?></p>
                <?php get_search_form(); ?>
            <?php endif; ?>
        </div>

    <?php endif; ?>
</div>

<?php
get_footer();
