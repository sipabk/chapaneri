<?php
/**
 * Family Statistics Widget
 *
 * Displays family statistics in any widget area.
 *
 * @package Chapaneri_Heritage
 */

class Chapaneri_Family_Stats_Widget extends WP_Widget {

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct(
            'chapaneri_family_stats',
            __('Family Statistics', 'chapaneri-heritage'),
            array(
                'description' => __('Displays family statistics including member count, generations, and locations.', 'chapaneri-heritage'),
                'classname'   => 'widget-family-stats',
            )
        );
    }

    /**
     * Front-end display
     */
    public function widget($args, $instance) {
        $title = !empty($instance['title']) ? $instance['title'] : __('Family Statistics', 'chapaneri-heritage');
        $title = apply_filters('widget_title', $title, $instance, $this->id_base);
        
        $show_total = isset($instance['show_total']) ? (bool) $instance['show_total'] : true;
        $show_generations = isset($instance['show_generations']) ? (bool) $instance['show_generations'] : true;
        $show_locations = isset($instance['show_locations']) ? (bool) $instance['show_locations'] : true;
        $show_living = isset($instance['show_living']) ? (bool) $instance['show_living'] : true;
        $layout = !empty($instance['layout']) ? $instance['layout'] : 'vertical';
        
        // Get stats
        $stats = chapaneri_get_family_stats();
        
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
        
        echo $args['before_widget'];
        
        if ($title) {
            echo $args['before_title'] . esc_html($title) . $args['after_title'];
        }
        ?>
        
        <div class="family-stats-widget family-stats-widget--<?php echo esc_attr($layout); ?>">
            <?php if ($show_total) : ?>
                <div class="family-stats-widget__item">
                    <div class="family-stats-widget__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div class="family-stats-widget__content">
                        <span class="family-stats-widget__value"><?php echo esc_html($stats['total']); ?></span>
                        <span class="family-stats-widget__label"><?php esc_html_e('Family Members', 'chapaneri-heritage'); ?></span>
                    </div>
                </div>
            <?php endif; ?>
            
            <?php if ($show_generations) : ?>
                <div class="family-stats-widget__item">
                    <div class="family-stats-widget__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                    </div>
                    <div class="family-stats-widget__content">
                        <span class="family-stats-widget__value"><?php echo count($generations); ?></span>
                        <span class="family-stats-widget__label"><?php esc_html_e('Generations', 'chapaneri-heritage'); ?></span>
                    </div>
                </div>
            <?php endif; ?>
            
            <?php if ($show_locations) : ?>
                <div class="family-stats-widget__item">
                    <div class="family-stats-widget__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <div class="family-stats-widget__content">
                        <span class="family-stats-widget__value"><?php echo count($locations); ?></span>
                        <span class="family-stats-widget__label"><?php esc_html_e('Locations', 'chapaneri-heritage'); ?></span>
                    </div>
                </div>
            <?php endif; ?>
            
            <?php if ($show_living) : ?>
                <div class="family-stats-widget__item">
                    <div class="family-stats-widget__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>
                    <div class="family-stats-widget__content">
                        <span class="family-stats-widget__value"><?php echo esc_html($stats['living']); ?></span>
                        <span class="family-stats-widget__label"><?php esc_html_e('Living Members', 'chapaneri-heritage'); ?></span>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        
        <?php
        echo $args['after_widget'];
    }

    /**
     * Back-end form
     */
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : __('Family Statistics', 'chapaneri-heritage');
        $show_total = isset($instance['show_total']) ? (bool) $instance['show_total'] : true;
        $show_generations = isset($instance['show_generations']) ? (bool) $instance['show_generations'] : true;
        $show_locations = isset($instance['show_locations']) ? (bool) $instance['show_locations'] : true;
        $show_living = isset($instance['show_living']) ? (bool) $instance['show_living'] : true;
        $layout = !empty($instance['layout']) ? $instance['layout'] : 'vertical';
        ?>
        
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Title:', 'chapaneri-heritage'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('layout')); ?>"><?php esc_html_e('Layout:', 'chapaneri-heritage'); ?></label>
            <select class="widefat" id="<?php echo esc_attr($this->get_field_id('layout')); ?>" name="<?php echo esc_attr($this->get_field_name('layout')); ?>">
                <option value="vertical" <?php selected($layout, 'vertical'); ?>><?php esc_html_e('Vertical', 'chapaneri-heritage'); ?></option>
                <option value="horizontal" <?php selected($layout, 'horizontal'); ?>><?php esc_html_e('Horizontal', 'chapaneri-heritage'); ?></option>
                <option value="grid" <?php selected($layout, 'grid'); ?>><?php esc_html_e('Grid', 'chapaneri-heritage'); ?></option>
            </select>
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_total); ?> id="<?php echo esc_attr($this->get_field_id('show_total')); ?>" name="<?php echo esc_attr($this->get_field_name('show_total')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_total')); ?>"><?php esc_html_e('Show Total Members', 'chapaneri-heritage'); ?></label>
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_generations); ?> id="<?php echo esc_attr($this->get_field_id('show_generations')); ?>" name="<?php echo esc_attr($this->get_field_name('show_generations')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_generations')); ?>"><?php esc_html_e('Show Generations Count', 'chapaneri-heritage'); ?></label>
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_locations); ?> id="<?php echo esc_attr($this->get_field_id('show_locations')); ?>" name="<?php echo esc_attr($this->get_field_name('show_locations')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_locations')); ?>"><?php esc_html_e('Show Locations Count', 'chapaneri-heritage'); ?></label>
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_living); ?> id="<?php echo esc_attr($this->get_field_id('show_living')); ?>" name="<?php echo esc_attr($this->get_field_name('show_living')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_living')); ?>"><?php esc_html_e('Show Living Members', 'chapaneri-heritage'); ?></label>
        </p>
        
        <?php
    }

    /**
     * Sanitize widget form values
     */
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['layout'] = in_array($new_instance['layout'], array('vertical', 'horizontal', 'grid')) ? $new_instance['layout'] : 'vertical';
        $instance['show_total'] = isset($new_instance['show_total']) ? 1 : 0;
        $instance['show_generations'] = isset($new_instance['show_generations']) ? 1 : 0;
        $instance['show_locations'] = isset($new_instance['show_locations']) ? 1 : 0;
        $instance['show_living'] = isset($new_instance['show_living']) ? 1 : 0;
        return $instance;
    }
}
