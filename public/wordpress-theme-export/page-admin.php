<?php
/**
 * Template Name: Admin Dashboard
 * Description: Admin-only dashboard for managing user roles and activity logs
 *
 * @package Chapaneri_Heritage
 * @since 3.0.0
 */

get_header();

// Restrict to admins
if (!current_user_can('manage_options')) {
    ?>
    <div class="container section">
        <div class="heritage-card" style="text-align: center; padding: var(--spacing-16);">
            <h2 class="font-display"><?php esc_html_e('Access Denied', 'chapaneri-heritage'); ?></h2>
            <p><?php esc_html_e('You do not have permission to view this page.', 'chapaneri-heritage'); ?></p>
            <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary"><?php esc_html_e('Go Home', 'chapaneri-heritage'); ?></a>
        </div>
    </div>
    <?php
    get_footer();
    return;
}

// Load activity logger
if (!class_exists('Chapaneri_Activity_Logger')) {
    require_once get_template_directory() . '/inc/class-activity-logger.php';
}

$logger = Chapaneri_Activity_Logger::instance();
$logs = $logger->get_logs(50);
$total_logs = $logger->count_logs();

// Load relationships
if (!class_exists('Chapaneri_Family_Relationships')) {
    require_once get_template_directory() . '/inc/class-family-relationships.php';
}
$rel_manager = Chapaneri_Family_Relationships::instance();
$total_relationships = $rel_manager->count_relationships();

// Get stats
$stats = function_exists('chapaneri_get_family_stats') ? chapaneri_get_family_stats() : array('total' => 0, 'living' => 0);

// Get user counts
$users = count_users();
?>

<div class="container section">
    <header class="page-header-section">
        <div class="page-header__badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
            </svg>
            <span><?php esc_html_e('Administration', 'chapaneri-heritage'); ?></span>
        </div>
        <h1 class="page-title font-display"><?php esc_html_e('Admin Dashboard', 'chapaneri-heritage'); ?></h1>
    </header>

    <!-- Summary Cards -->
    <div class="stats-summary-grid">
        <div class="stat-card heritage-card">
            <div class="stat-card__value"><?php echo esc_html($stats['total']); ?></div>
            <div class="stat-card__label"><?php esc_html_e('Family Members', 'chapaneri-heritage'); ?></div>
        </div>
        <div class="stat-card heritage-card">
            <div class="stat-card__value"><?php echo esc_html($total_relationships); ?></div>
            <div class="stat-card__label"><?php esc_html_e('Relationships', 'chapaneri-heritage'); ?></div>
        </div>
        <div class="stat-card heritage-card">
            <div class="stat-card__value"><?php echo esc_html($users['total_users']); ?></div>
            <div class="stat-card__label"><?php esc_html_e('Registered Users', 'chapaneri-heritage'); ?></div>
        </div>
        <div class="stat-card heritage-card">
            <div class="stat-card__value"><?php echo esc_html($total_logs); ?></div>
            <div class="stat-card__label"><?php esc_html_e('Activity Logs', 'chapaneri-heritage'); ?></div>
        </div>
    </div>

    <!-- Activity Log -->
    <div class="heritage-card" style="margin-top: var(--spacing-8);">
        <h2 class="font-display" style="margin-bottom: var(--spacing-4);"><?php esc_html_e('Recent Activity', 'chapaneri-heritage'); ?></h2>
        
        <?php if (!empty($logs)) : ?>
            <table class="stats-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Action', 'chapaneri-heritage'); ?></th>
                        <th><?php esc_html_e('Member', 'chapaneri-heritage'); ?></th>
                        <th><?php esc_html_e('By', 'chapaneri-heritage'); ?></th>
                        <th><?php esc_html_e('Date', 'chapaneri-heritage'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($logs as $log) : ?>
                        <tr>
                            <td>
                                <span class="relationship-badge rel-<?php echo esc_attr($log->action_type); ?>">
                                    <?php echo esc_html(ucfirst($log->action_type)); ?>
                                </span>
                            </td>
                            <td><?php echo esc_html($log->entity_name); ?></td>
                            <td><?php echo esc_html($log->performed_by_email); ?></td>
                            <td><?php echo esc_html(date('M j, Y g:ia', strtotime($log->created_at))); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else : ?>
            <p class="stats-empty"><?php esc_html_e('No activity logs recorded yet.', 'chapaneri-heritage'); ?></p>
        <?php endif; ?>
    </div>

    <!-- Quick Links -->
    <div class="heritage-card" style="margin-top: var(--spacing-8);">
        <h2 class="font-display" style="margin-bottom: var(--spacing-4);"><?php esc_html_e('Quick Actions', 'chapaneri-heritage'); ?></h2>
        <div style="display: flex; gap: var(--spacing-4); flex-wrap: wrap;">
            <a href="<?php echo admin_url('post-new.php?post_type=family_member'); ?>" class="btn btn-primary">
                <?php esc_html_e('Add New Member', 'chapaneri-heritage'); ?>
            </a>
            <a href="<?php echo admin_url('edit.php?post_type=family_member'); ?>" class="btn btn-secondary">
                <?php esc_html_e('Manage Members', 'chapaneri-heritage'); ?>
            </a>
            <a href="<?php echo admin_url('users.php'); ?>" class="btn btn-secondary">
                <?php esc_html_e('Manage Users', 'chapaneri-heritage'); ?>
            </a>
            <a href="<?php echo admin_url('admin.php?page=chapaneri-import-export'); ?>" class="btn btn-secondary">
                <?php esc_html_e('Import / Export', 'chapaneri-heritage'); ?>
            </a>
        </div>
    </div>
</div>

<?php get_footer(); ?>
