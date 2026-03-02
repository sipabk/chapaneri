<?php
/**
 * Related Family Members Widget
 *
 * Displays parents, siblings, and children for the current family member.
 *
 * @package Chapaneri_Heritage
 */

if (!defined('ABSPATH')) {
    exit;
}

class Chapaneri_Related_Members_Widget extends WP_Widget {

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct(
            'chapaneri_related_members',
            __('Related Family Members', 'chapaneri-heritage'),
            array(
                'description' => __('Displays parents, siblings, spouse, and children for the current family member. Best used on single member pages.', 'chapaneri-heritage'),
                'classname'   => 'widget-related-members',
            )
        );
    }

    /**
     * Front-end display
     */
    public function widget($args, $instance) {
        // Only show on single family member pages
        if (!is_singular('family_member')) {
            return;
        }
        
        $member_id = get_the_ID();
        
        $title = !empty($instance['title']) ? $instance['title'] : __('Family Connections', 'chapaneri-heritage');
        $title = apply_filters('widget_title', $title, $instance, $this->id_base);
        
        $show_parents = isset($instance['show_parents']) ? (bool) $instance['show_parents'] : true;
        $show_siblings = isset($instance['show_siblings']) ? (bool) $instance['show_siblings'] : true;
        $show_spouse = isset($instance['show_spouse']) ? (bool) $instance['show_spouse'] : true;
        $show_children = isset($instance['show_children']) ? (bool) $instance['show_children'] : true;
        
        // Get family connections
        $parents = $show_parents ? chapaneri_get_parents($member_id) : array();
        $siblings = $show_siblings ? $this->get_siblings($member_id) : array();
        $spouse = $show_spouse ? chapaneri_get_spouse($member_id) : null;
        $children = $show_children ? chapaneri_get_children($member_id) : array();
        
        // Don't display if no connections
        if (empty($parents) && empty($siblings) && !$spouse && empty($children)) {
            return;
        }
        
        echo $args['before_widget'];
        
        if ($title) {
            echo $args['before_title'] . esc_html($title) . $args['after_title'];
        }
        ?>
        
        <div class="related-members-widget">
            <?php if (!empty($parents)) : ?>
                <div class="related-members-section">
                    <h4 class="related-members-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <?php esc_html_e('Parents', 'chapaneri-heritage'); ?>
                    </h4>
                    <ul class="related-members-list">
                        <?php foreach ($parents as $parent) : ?>
                            <li class="related-member-item">
                                <a href="<?php echo esc_url($parent['permalink']); ?>" class="related-member-link">
                                    <div class="related-member-avatar <?php echo esc_attr($parent['gender'] ?? ''); ?>">
                                        <?php if (!empty($parent['photo'])) : ?>
                                            <img src="<?php echo esc_url($parent['photo']); ?>" alt="<?php echo esc_attr($parent['name']); ?>">
                                        <?php else : ?>
                                            <?php echo esc_html(mb_substr($parent['name'], 0, 1)); ?>
                                        <?php endif; ?>
                                    </div>
                                    <span class="related-member-name"><?php echo esc_html($parent['name']); ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($siblings)) : ?>
                <div class="related-members-section">
                    <h4 class="related-members-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <?php esc_html_e('Siblings', 'chapaneri-heritage'); ?>
                    </h4>
                    <ul class="related-members-list">
                        <?php foreach ($siblings as $sibling) : ?>
                            <li class="related-member-item">
                                <a href="<?php echo esc_url($sibling['permalink']); ?>" class="related-member-link">
                                    <div class="related-member-avatar <?php echo esc_attr($sibling['gender'] ?? ''); ?>">
                                        <?php if (!empty($sibling['photo'])) : ?>
                                            <img src="<?php echo esc_url($sibling['photo']); ?>" alt="<?php echo esc_attr($sibling['name']); ?>">
                                        <?php else : ?>
                                            <?php echo esc_html(mb_substr($sibling['name'], 0, 1)); ?>
                                        <?php endif; ?>
                                    </div>
                                    <span class="related-member-name"><?php echo esc_html($sibling['name']); ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
            
            <?php if ($spouse) : ?>
                <div class="related-members-section">
                    <h4 class="related-members-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <?php esc_html_e('Spouse', 'chapaneri-heritage'); ?>
                    </h4>
                    <ul class="related-members-list">
                        <li class="related-member-item">
                            <a href="<?php echo esc_url($spouse['permalink']); ?>" class="related-member-link">
                                <div class="related-member-avatar <?php echo esc_attr($spouse['gender'] ?? ''); ?>">
                                    <?php if (!empty($spouse['photo'])) : ?>
                                        <img src="<?php echo esc_url($spouse['photo']); ?>" alt="<?php echo esc_attr($spouse['name']); ?>">
                                    <?php else : ?>
                                        <?php echo esc_html(mb_substr($spouse['name'], 0, 1)); ?>
                                    <?php endif; ?>
                                </div>
                                <span class="related-member-name"><?php echo esc_html($spouse['name']); ?></span>
                            </a>
                        </li>
                    </ul>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($children)) : ?>
                <div class="related-members-section">
                    <h4 class="related-members-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="4" r="2"></circle>
                            <circle cx="6" cy="16" r="2"></circle>
                            <circle cx="18" cy="16" r="2"></circle>
                            <path d="M12 6v4"></path>
                            <path d="M6 14v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <?php esc_html_e('Children', 'chapaneri-heritage'); ?>
                        <span class="related-members-count"><?php echo count($children); ?></span>
                    </h4>
                    <ul class="related-members-list">
                        <?php foreach ($children as $child) : ?>
                            <li class="related-member-item">
                                <a href="<?php echo esc_url($child['permalink']); ?>" class="related-member-link">
                                    <div class="related-member-avatar <?php echo esc_attr($child['gender'] ?? ''); ?>">
                                        <?php if (!empty($child['photo'])) : ?>
                                            <img src="<?php echo esc_url($child['photo']); ?>" alt="<?php echo esc_attr($child['name']); ?>">
                                        <?php else : ?>
                                            <?php echo esc_html(mb_substr($child['name'], 0, 1)); ?>
                                        <?php endif; ?>
                                    </div>
                                    <span class="related-member-name"><?php echo esc_html($child['name']); ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
        
        <?php
        echo $args['after_widget'];
    }

    /**
     * Get siblings for a member
     */
    private function get_siblings($member_id) {
        $siblings = array();
        $parents = chapaneri_get_parents($member_id);
        
        if (empty($parents)) {
            return $siblings;
        }
        
        // Get all children of parents
        $sibling_ids = array();
        foreach ($parents as $parent) {
            $parent_children = get_post_meta($parent['id'], '_children_ids', true);
            if (is_array($parent_children)) {
                $sibling_ids = array_merge($sibling_ids, $parent_children);
            }
        }
        
        // Remove current member and duplicates
        $sibling_ids = array_unique($sibling_ids);
        $sibling_ids = array_filter($sibling_ids, function($id) use ($member_id) {
            return $id != $member_id;
        });
        
        foreach ($sibling_ids as $sibling_id) {
            $post = get_post($sibling_id);
            if (!$post || $post->post_status !== 'publish') {
                continue;
            }
            
            $siblings[] = array(
                'id'        => $sibling_id,
                'name'      => $post->post_title,
                'permalink' => get_permalink($sibling_id),
                'photo'     => get_the_post_thumbnail_url($sibling_id, 'thumbnail'),
                'gender'    => get_post_meta($sibling_id, '_gender', true),
            );
        }
        
        return $siblings;
    }

    /**
     * Back-end form
     */
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : __('Family Connections', 'chapaneri-heritage');
        $show_parents = isset($instance['show_parents']) ? (bool) $instance['show_parents'] : true;
        $show_siblings = isset($instance['show_siblings']) ? (bool) $instance['show_siblings'] : true;
        $show_spouse = isset($instance['show_spouse']) ? (bool) $instance['show_spouse'] : true;
        $show_children = isset($instance['show_children']) ? (bool) $instance['show_children'] : true;
        ?>
        
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Title:', 'chapaneri-heritage'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_parents); ?> id="<?php echo esc_attr($this->get_field_id('show_parents')); ?>" name="<?php echo esc_attr($this->get_field_name('show_parents')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_parents')); ?>"><?php esc_html_e('Show Parents', 'chapaneri-heritage'); ?></label>
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_siblings); ?> id="<?php echo esc_attr($this->get_field_id('show_siblings')); ?>" name="<?php echo esc_attr($this->get_field_name('show_siblings')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_siblings')); ?>"><?php esc_html_e('Show Siblings', 'chapaneri-heritage'); ?></label>
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_spouse); ?> id="<?php echo esc_attr($this->get_field_id('show_spouse')); ?>" name="<?php echo esc_attr($this->get_field_name('show_spouse')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_spouse')); ?>"><?php esc_html_e('Show Spouse', 'chapaneri-heritage'); ?></label>
        </p>
        
        <p>
            <input class="checkbox" type="checkbox" <?php checked($show_children); ?> id="<?php echo esc_attr($this->get_field_id('show_children')); ?>" name="<?php echo esc_attr($this->get_field_name('show_children')); ?>">
            <label for="<?php echo esc_attr($this->get_field_id('show_children')); ?>"><?php esc_html_e('Show Children', 'chapaneri-heritage'); ?></label>
        </p>
        
        <p class="description">
            <?php esc_html_e('This widget only displays on single family member pages.', 'chapaneri-heritage'); ?>
        </p>
        
        <?php
    }

    /**
     * Sanitize widget form values
     */
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['show_parents'] = isset($new_instance['show_parents']) ? 1 : 0;
        $instance['show_siblings'] = isset($new_instance['show_siblings']) ? 1 : 0;
        $instance['show_spouse'] = isset($new_instance['show_spouse']) ? 1 : 0;
        $instance['show_children'] = isset($new_instance['show_children']) ? 1 : 0;
        return $instance;
    }
}
