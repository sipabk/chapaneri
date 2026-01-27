<?php
/**
 * Featured Members Widget
 *
 * Displays featured or random family members in any widget area.
 *
 * @package Chapaneri_Heritage
 */

class Chapaneri_Featured_Members_Widget extends WP_Widget {

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct(
            'chapaneri_featured_members',
            __('Featured Family Members', 'chapaneri-heritage'),
            array(
                'description' => __('Displays featured or random family members with photos and details.', 'chapaneri-heritage'),
                'classname'   => 'widget-featured-members',
            )
        );
    }

    /**
     * Front-end display
     */
    public function widget($args, $instance) {
        $title = !empty($instance['title']) ? $instance['title'] : __('Featured Members', 'chapaneri-heritage');
        $title = apply_filters('widget_title', $title, $instance, $this->id_base);
        
        $number = !empty($instance['number']) ? absint($instance['number']) : 3;
        $display_mode = !empty($instance['display_mode']) ? $instance['display_mode'] : 'random';
        $show_details = isset($instance['show_details']) ? (bool) $instance['show_details'] : true;
        $layout = !empty($instance['layout']) ? $instance['layout'] : 'list';
        
        // Build query
        $query_args = array(
            'post_type'      => 'family_member',
            'posts_per_page' => $number,
        );
        
        switch ($display_mode) {
            case 'random':
                $query_args['orderby'] = 'rand';
                break;
            case 'recent':
                $query_args['orderby'] = 'date';
                $query_args['order'] = 'DESC';
                break;
            case 'featured':
                $query_args['meta_key'] = '_featured_member';
                $query_args['meta_value'] = '1';
                break;
            case 'birth_newest':
                $query_args['meta_key'] = '_birth_date';
                $query_args['orderby'] = 'meta_value';
                $query_args['order'] = 'DESC';
                break;
            case 'birth_oldest':
                $query_args['meta_key'] = '_birth_date';
                $query_args['orderby'] = 'meta_value';
                $query_args['order'] = 'ASC';
                break;
        }
        
        $members = new WP_Query($query_args);
        
        if (!$members->have_posts()) {
            return;
        }
        
        echo $args['before_widget'];
        
        if ($title) {
            echo $args['before_title'] . esc_html($title) . $args['after_title'];
        }
        ?>
        
        <div class="featured-members-widget featured-members-widget--<?php echo esc_attr($layout); ?>">
            <?php while ($members->have_posts()) : $members->the_post(); 
                $member = chapaneri_get_family_member(get_the_ID());
                $gender_class = $member['gender'] ? 'featured-member--' . $member['gender'] : '';
            ?>
                <a href="<?php the_permalink(); ?>" class="featured-member <?php echo esc_attr($gender_class); ?>">
                    <div class="featured-member__avatar">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php the_post_thumbnail('thumbnail'); ?>
                        <?php else : ?>
                            <span class="featured-member__initial"><?php echo esc_html(mb_substr(get_the_title(), 0, 1)); ?></span>
                        <?php endif; ?>
                    </div>
                    
                    <div class="featured-member__info">
                        <span class="featured-member__name"><?php the_title(); ?></span>
                        
                        <?php if ($show_details) : ?>
                            <span class="featured-member__details">
                                <?php 
                                $details = array();
                                if ($member['birthDate']) {
                                    $details[] = date('Y', strtotime($member['birthDate']));
                                }
                                if ($member['birthPlace']) {
                                    $details[] = $member['birthPlace'];
                                }
                                echo esc_html(implode(' • ', $details));
                                ?>
                            </span>
                        <?php endif; ?>
                    </div>
                </a>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
        
        <a href="<?php echo esc_url(get_post_type_archive_link('family_member')); ?>" class="featured-members-widget__link">
            <?php esc_html_e('View all members', 'chapaneri-heritage'); ?>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        </a>
        
        <?php
        echo $args['after_widget'];
    }

    /**
     * Back-end form
     */
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : __('Featured Members', 'chapaneri-heritage');
        $number = !empty($instance['number']) ? absint($instance['number']) : 3;
        $display_mode = !empty($instance['display_mode']) ? $instance['display_mode'] : 'random';
        $show_details = isset($instance['show_details']) ? (bool) $instance['show_details'] : true;
        $layout = !empty($instance['layout']) ? $instance['layout'] : 'list';
        ?>
        
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Title:', 'chapaneri-heritage'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('number')); ?>"><?php esc_html_e('Number of members:', 'chapaneri-heritage'); ?></label>
            <input class="tiny-text" id="<?php echo esc_attr($this->get_field_id('number')); ?>" name="<?php echo esc_attr($this->get_field_name('number')); ?>" type="number" min="1" max="10" value="<?php echo esc_attr($number); ?>">
        </p>
        
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('display_mode')); ?>"><?php esc_html_e('Display Mode:', 'chapaneri-heritage'); ?></label>
            <select class="widefat" id="<?php echo esc_attr($this->get_field_id('display_mode')); ?>" name="<?php echo esc_attr($this->get_field_name('display_mode')); ?>">
                <option value="random" <?php selected($display_mode, 'random'); ?>><?php esc_html_e('Random Members', 'chapaneri-heritage'); ?></option>
                <option value="recent" <?php selected($display_mode, 'recent'); ?>><?php esc_html_e('Recently Added', 'chapaneri-heritage'); ?></option>
                <option value="featured" <?php selected($display_mode, 'featured'); ?>><?php esc_html_e('Featured Only', 'chapaneri-heritage'); ?></option>
                <option value="birth_newest" <?php selected($display_mode, 'birth_newest'); ?>><?php esc_html_e('Newest by Birth', 'chapaneri-heritage'); ?></option>
                <option value="birth_oldest" <?php selected($display_mode, 'birth_oldest'); ?>><?php esc_html_e('Oldest by Birth', 'chapaneri-heritage'); ?></option>
            </select>
        </p>
        
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('layout')); ?>"><?php esc_html_e('Layout:', 'chapaneri-heritage'); ?></label>
            <select class="widefat" id="<?php echo esc_attr($this->get_field_id('layout')); ?>" name="<?php echo esc_attr($this->get_field_name('layout')); ?>">
                <option value="list" <?php selected($layout, 'list'); ?>><?php esc_html_e('List', 'chapaneri-heritage'); ?></option>
                <option value="grid" <?php selected($layout, 'grid'); ?>><?php esc_html_e('Grid', 'chapaneri-heritage'); ?></option>
                <option value="compact" <?php selected($layout, 'compact'); ?>><?php esc_html_e('Compact', 'chapaneri-heritage'); ?></option>
            </select>
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_details); ?> id="<?php echo esc_attr($this->get_field_id('show_details')); ?>" name="<?php echo esc_attr($this->get_field_name('show_details')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_details')); ?>"><?php esc_html_e('Show birth year and location', 'chapaneri-heritage'); ?></label>
        </p>
        
        <?php
    }

    /**
     * Sanitize widget form values
     */
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['number'] = absint($new_instance['number']);
        $instance['display_mode'] = in_array($new_instance['display_mode'], array('random', 'recent', 'featured', 'birth_newest', 'birth_oldest')) ? $new_instance['display_mode'] : 'random';
        $instance['layout'] = in_array($new_instance['layout'], array('list', 'grid', 'compact')) ? $new_instance['layout'] : 'list';
        $instance['show_details'] = isset($new_instance['show_details']) ? 1 : 0;
        return $instance;
    }
}
