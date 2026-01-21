<?php
/**
 * Front Page Template
 *
 * @package Chapaneri_Heritage
 */

get_header();

// Get customizer settings
$hero_title = get_theme_mod('hero_title', __('Chapaneri Family', 'chapaneri-heritage'));
$hero_subtitle = get_theme_mod('hero_subtitle', __('Heritage Archive', 'chapaneri-heritage'));
$hero_description = get_theme_mod('hero_description', __('Preserving our legacy, honoring our ancestors, and connecting generations through shared history and stories.', 'chapaneri-heritage'));
$hero_bg_id = get_theme_mod('hero_background');
$hero_bg_url = $hero_bg_id ? wp_get_attachment_image_url($hero_bg_id, 'full') : '';
$show_stats = get_theme_mod('show_stats', true);

// Get family statistics
$stats = chapaneri_get_family_stats();
?>

<!-- Hero Section -->
<section class="hero" <?php echo $hero_bg_url ? 'style="background-image: url(' . esc_url($hero_bg_url) . '); background-size: cover; background-position: center;"' : ''; ?>>
    <div class="hero-overlay"></div>
    
    <!-- Decorative Elements -->
    <div class="hero-decorations">
        <div class="decoration decoration-top-left"></div>
        <div class="decoration decoration-top-right"></div>
    </div>
    
    <div class="hero-content animate-fade-in">
        <!-- Ornamental Divider -->
        <div class="ornament-divider">
            <span class="ornament-line"></span>
            <span class="ornament-icon">✦</span>
            <span class="ornament-line"></span>
        </div>
        
        <!-- Title -->
        <h1 class="hero-title font-display">
            <?php echo esc_html($hero_title); ?>
            <span class="text-gradient-gold"><?php echo esc_html($hero_subtitle); ?></span>
        </h1>
        
        <!-- Description -->
        <p class="hero-subtitle">
            <?php echo esc_html($hero_description); ?>
        </p>
        
        <!-- Statistics -->
        <?php if ($show_stats && !empty($stats)) : ?>
            <div class="hero-stats">
                <div class="stat-item">
                    <span class="stat-number"><?php echo esc_html($stats['totalMembers']); ?></span>
                    <span class="stat-label"><?php esc_html_e('Family Members', 'chapaneri-heritage'); ?></span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-number"><?php echo esc_html($stats['generations']); ?></span>
                    <span class="stat-label"><?php esc_html_e('Generations', 'chapaneri-heritage'); ?></span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <span class="stat-number"><?php echo esc_html($stats['places']); ?></span>
                    <span class="stat-label"><?php esc_html_e('Places', 'chapaneri-heritage'); ?></span>
                </div>
            </div>
        <?php endif; ?>
        
        <!-- CTA Buttons -->
        <div class="hero-buttons">
            <a href="<?php echo esc_url(get_post_type_archive_link('family_member')); ?>" class="btn btn-accent btn-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <?php esc_html_e('Explore Family Tree', 'chapaneri-heritage'); ?>
            </a>
            <a href="<?php echo esc_url(home_url('/timeline')); ?>" class="btn btn-outline btn-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <?php esc_html_e('View Timeline', 'chapaneri-heritage'); ?>
            </a>
        </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    </div>
</section>

<!-- Featured Members Section -->
<section class="section bg-gradient-parchment">
    <div class="container">
        <header class="section-header">
            <h2 class="section-title font-display"><?php esc_html_e('Featured Family Members', 'chapaneri-heritage'); ?></h2>
            <p class="section-description"><?php esc_html_e('Key members of our family heritage', 'chapaneri-heritage'); ?></p>
        </header>
        
        <?php
        $featured_members = chapaneri_get_all_family_members(array(
            'posts_per_page' => 6,
            'orderby'        => 'menu_order',
            'order'          => 'ASC',
        ));
        ?>
        
        <?php if (!empty($featured_members)) : ?>
            <div class="members-grid">
                <?php foreach ($featured_members as $member) : ?>
                    <a href="<?php echo esc_url($member['permalink']); ?>" class="member-card">
                        <div class="member-card-header">
                            <div class="avatar avatar-lg">
                                <?php if ($member['photo']) : ?>
                                    <img src="<?php echo esc_url($member['photo']); ?>" alt="<?php echo esc_attr($member['name']); ?>">
                                <?php else : ?>
                                    <?php echo esc_html(mb_substr($member['name'], 0, 1)); ?>
                                <?php endif; ?>
                            </div>
                            <div>
                                <h3 class="member-card-name"><?php echo esc_html($member['name']); ?></h3>
                                <?php 
                                $relationships = wp_get_object_terms($member['id'], 'relationship');
                                if (!empty($relationships)) :
                                ?>
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
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
            
            <div class="section-footer">
                <a href="<?php echo esc_url(get_post_type_archive_link('family_member')); ?>" class="btn btn-secondary btn-lg">
                    <?php esc_html_e('View All Family Members', 'chapaneri-heritage'); ?>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </a>
            </div>
        <?php else : ?>
            <div class="no-members heritage-card">
                <p><?php esc_html_e('No family members have been added yet. Add members from the WordPress admin.', 'chapaneri-heritage'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- Statistics Section -->
<?php if ($show_stats) : ?>
<section class="section">
    <div class="container">
        <div class="stats-grid">
            <div class="stat-card heritage-card">
                <div class="stat-icon" style="background: var(--gradient-hero);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <h3 class="stat-value font-display"><?php echo esc_html($stats['totalMembers']); ?></h3>
                <p class="stat-label"><?php esc_html_e('Family Members', 'chapaneri-heritage'); ?></p>
            </div>
            
            <div class="stat-card heritage-card">
                <div class="stat-icon" style="background: var(--gradient-gold);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <h3 class="stat-value font-display"><?php echo esc_html($stats['generations']); ?></h3>
                <p class="stat-label"><?php esc_html_e('Generations', 'chapaneri-heritage'); ?></p>
            </div>
            
            <div class="stat-card heritage-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, hsl(145, 35%, 38%), hsl(145, 35%, 28%));">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </div>
                <h3 class="stat-value font-display"><?php echo esc_html($stats['places']); ?></h3>
                <p class="stat-label"><?php esc_html_e('Unique Places', 'chapaneri-heritage'); ?></p>
            </div>
            
            <div class="stat-card heritage-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, hsl(350, 60%, 50%), hsl(350, 45%, 35%));">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
                <h3 class="stat-value font-display"><?php echo esc_html($stats['marriages']); ?></h3>
                <p class="stat-label"><?php esc_html_e('Marriages', 'chapaneri-heritage'); ?></p>
            </div>
        </div>
    </div>
</section>
<?php endif; ?>

<?php
get_footer();
