<?php
/**
 * Admin Dashboard Widget
 *
 * Displays recent family member additions and quick statistics in the WordPress admin dashboard.
 *
 * @package Chapaneri_Heritage
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the dashboard widget
 */
function chapaneri_register_dashboard_widget() {
    wp_add_dashboard_widget(
        'chapaneri_family_dashboard',
        __('Family Heritage Overview', 'chapaneri-heritage'),
        'chapaneri_dashboard_widget_display'
    );
}
add_action('wp_dashboard_setup', 'chapaneri_register_dashboard_widget');

/**
 * Dashboard widget display callback
 */
function chapaneri_dashboard_widget_display() {
    // Get statistics
    $stats = function_exists('chapaneri_get_family_stats') ? chapaneri_get_family_stats() : array('total' => 0, 'living' => 0, 'totalMembers' => 0, 'generations' => 0, 'places' => 0, 'marriages' => 0);
    
    // Get generations count
    $generations = get_terms(array(
        'taxonomy'   => 'generation',
        'hide_empty' => true,
    ));
    $generations_count = is_array($generations) ? count($generations) : 0;
    
    // Get recent members
    $recent_members = get_posts(array(
        'post_type'      => 'family_member',
        'posts_per_page' => 5,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ));
    
    // Get locations count
    $locations = array();
    $all_members = get_posts(array(
        'post_type'      => 'family_member',
        'posts_per_page' => -1,
        'fields'         => 'ids',
    ));
    foreach ($all_members as $member_id) {
        $place = get_post_meta($member_id, '_birth_place', true);
        if ($place && !in_array($place, $locations)) {
            $locations[] = $place;
        }
    }
    $locations_count = count($locations);
    ?>
    
    <style>
        .chapaneri-dashboard-widget {
            margin: -12px;
        }
        .chapaneri-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            padding: 16px;
            background: linear-gradient(135deg, #f8f6f4 0%, #f0ebe6 100%);
            border-bottom: 1px solid #e5e0da;
        }
        .chapaneri-stat-item {
            text-align: center;
            padding: 12px 8px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .chapaneri-stat-value {
            display: block;
            font-size: 24px;
            font-weight: 700;
            color: #81313e;
            line-height: 1.2;
        }
        .chapaneri-stat-label {
            display: block;
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
        }
        .chapaneri-recent-members {
            padding: 16px;
        }
        .chapaneri-recent-members h4 {
            margin: 0 0 12px 0;
            font-size: 13px;
            font-weight: 600;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .chapaneri-member-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .chapaneri-member-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .chapaneri-member-item:last-child {
            border-bottom: none;
        }
        .chapaneri-member-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #81313e;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            margin-right: 12px;
            flex-shrink: 0;
            overflow: hidden;
        }
        .chapaneri-member-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .chapaneri-member-avatar.female {
            background: #d4a574;
        }
        .chapaneri-member-info {
            flex: 1;
            min-width: 0;
        }
        .chapaneri-member-name {
            display: block;
            font-weight: 500;
            color: #1e1e1e;
            text-decoration: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .chapaneri-member-name:hover {
            color: #81313e;
        }
        .chapaneri-member-meta {
            display: block;
            font-size: 12px;
            color: #888;
        }
        .chapaneri-member-date {
            font-size: 12px;
            color: #999;
            white-space: nowrap;
        }
        .chapaneri-quick-links {
            display: flex;
            gap: 8px;
            padding: 16px;
            background: #f8f6f4;
            border-top: 1px solid #e5e0da;
        }
        .chapaneri-quick-link {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 12px;
            background: #81313e;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            transition: background 0.2s;
        }
        .chapaneri-quick-link:hover {
            background: #6a2833;
            color: #fff;
        }
        .chapaneri-quick-link svg {
            width: 16px;
            height: 16px;
        }
        .chapaneri-no-members {
            padding: 24px;
            text-align: center;
            color: #888;
        }
    </style>
    
    <div class="chapaneri-dashboard-widget">
        <!-- Statistics Grid -->
        <div class="chapaneri-stats-grid">
            <div class="chapaneri-stat-item">
                <span class="chapaneri-stat-value"><?php echo esc_html($stats['total']); ?></span>
                <span class="chapaneri-stat-label"><?php esc_html_e('Members', 'chapaneri-heritage'); ?></span>
            </div>
            <div class="chapaneri-stat-item">
                <span class="chapaneri-stat-value"><?php echo esc_html($generations_count); ?></span>
                <span class="chapaneri-stat-label"><?php esc_html_e('Generations', 'chapaneri-heritage'); ?></span>
            </div>
            <div class="chapaneri-stat-item">
                <span class="chapaneri-stat-value"><?php echo esc_html($locations_count); ?></span>
                <span class="chapaneri-stat-label"><?php esc_html_e('Locations', 'chapaneri-heritage'); ?></span>
            </div>
            <div class="chapaneri-stat-item">
                <span class="chapaneri-stat-value"><?php echo esc_html($stats['living']); ?></span>
                <span class="chapaneri-stat-label"><?php esc_html_e('Living', 'chapaneri-heritage'); ?></span>
            </div>
        </div>
        
        <!-- Recent Members -->
        <div class="chapaneri-recent-members">
            <h4><?php esc_html_e('Recently Added Members', 'chapaneri-heritage'); ?></h4>
            
            <?php if (!empty($recent_members)) : ?>
                <ul class="chapaneri-member-list">
                    <?php foreach ($recent_members as $member) : 
                        $gender = get_post_meta($member->ID, '_gender', true);
                        $birth_place = get_post_meta($member->ID, '_birth_place', true);
                        $thumbnail = get_the_post_thumbnail_url($member->ID, 'thumbnail');
                    ?>
                        <li class="chapaneri-member-item">
                            <div class="chapaneri-member-avatar <?php echo esc_attr($gender); ?>">
                                <?php if ($thumbnail) : ?>
                                    <img src="<?php echo esc_url($thumbnail); ?>" alt="">
                                <?php else : ?>
                                    <?php echo esc_html(mb_substr($member->post_title, 0, 1)); ?>
                                <?php endif; ?>
                            </div>
                            <div class="chapaneri-member-info">
                                <a href="<?php echo esc_url(get_edit_post_link($member->ID)); ?>" class="chapaneri-member-name">
                                    <?php echo esc_html($member->post_title); ?>
                                </a>
                                <?php if ($birth_place) : ?>
                                    <span class="chapaneri-member-meta"><?php echo esc_html($birth_place); ?></span>
                                <?php endif; ?>
                            </div>
                            <span class="chapaneri-member-date">
                                <?php echo esc_html(human_time_diff(strtotime($member->post_date), current_time('timestamp')) . ' ago'); ?>
                            </span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php else : ?>
                <div class="chapaneri-no-members">
                    <p><?php esc_html_e('No family members added yet.', 'chapaneri-heritage'); ?></p>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Quick Links -->
        <div class="chapaneri-quick-links">
            <a href="<?php echo esc_url(admin_url('post-new.php?post_type=family_member')); ?>" class="chapaneri-quick-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <?php esc_html_e('Add Member', 'chapaneri-heritage'); ?>
            </a>
            <a href="<?php echo esc_url(admin_url('edit.php?post_type=family_member')); ?>" class="chapaneri-quick-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <?php esc_html_e('View All', 'chapaneri-heritage'); ?>
            </a>
        </div>
    </div>
    <?php
}
