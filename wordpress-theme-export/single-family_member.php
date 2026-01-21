<?php
/**
 * Single Family Member Template
 *
 * @package Chapaneri_Heritage
 */

get_header();

while (have_posts()) : the_post();
    $member = chapaneri_get_family_member(get_the_ID());
    $spouse = chapaneri_get_spouse(get_the_ID());
    $parents = chapaneri_get_parents(get_the_ID());
    $children = chapaneri_get_children(get_the_ID());
    $generations = wp_get_object_terms(get_the_ID(), 'generation');
    $relationships = wp_get_object_terms(get_the_ID(), 'relationship');
?>

<div class="container section">
    <!-- Back Button -->
    <div class="back-navigation">
        <a href="<?php echo esc_url(get_post_type_archive_link('family_member')); ?>" class="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <?php esc_html_e('Back to All Members', 'chapaneri-heritage'); ?>
        </a>
    </div>

    <div class="member-detail-grid">
        <!-- Main Content -->
        <div class="member-main">
            <!-- Profile Card -->
            <div class="heritage-card member-profile">
                <div class="member-header">
                    <div class="avatar avatar-xl <?php echo esc_attr($member['gender']); ?>">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php the_post_thumbnail('thumbnail'); ?>
                        <?php else : ?>
                            <?php echo esc_html(mb_substr($member['name'], 0, 1)); ?>
                        <?php endif; ?>
                    </div>
                    
                    <div class="member-info">
                        <h1 class="member-name font-display"><?php the_title(); ?></h1>
                        
                        <?php if (!empty($relationships)) : ?>
                            <span class="badge badge-primary"><?php echo esc_html($relationships[0]->name); ?></span>
                        <?php endif; ?>
                        
                        <?php if (!empty($generations)) : ?>
                            <span class="badge badge-secondary"><?php echo esc_html($generations[0]->name); ?></span>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Member Details -->
                <div class="member-details">
                    <?php if ($member['birthDate']) : ?>
                        <div class="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <div>
                                <span class="detail-label"><?php esc_html_e('Born', 'chapaneri-heritage'); ?></span>
                                <span class="detail-value"><?php echo esc_html(date('F d, Y', strtotime($member['birthDate']))); ?></span>
                            </div>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($member['deathDate']) : ?>
                        <div class="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                            <div>
                                <span class="detail-label"><?php esc_html_e('Passed', 'chapaneri-heritage'); ?></span>
                                <span class="detail-value"><?php echo esc_html(date('F d, Y', strtotime($member['deathDate']))); ?></span>
                            </div>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($member['birthPlace']) : ?>
                        <div class="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <div>
                                <span class="detail-label"><?php esc_html_e('Birthplace', 'chapaneri-heritage'); ?></span>
                                <span class="detail-value"><?php echo esc_html($member['birthPlace']); ?></span>
                            </div>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($member['email']) : ?>
                        <div class="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <div>
                                <span class="detail-label"><?php esc_html_e('Email', 'chapaneri-heritage'); ?></span>
                                <a href="mailto:<?php echo esc_attr($member['email']); ?>" class="detail-value"><?php echo esc_html($member['email']); ?></a>
                            </div>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($member['phone']) : ?>
                        <div class="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <div>
                                <span class="detail-label"><?php esc_html_e('Phone', 'chapaneri-heritage'); ?></span>
                                <a href="tel:<?php echo esc_attr($member['phone']); ?>" class="detail-value"><?php echo esc_html($member['phone']); ?></a>
                            </div>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($member['address']) : ?>
                        <div class="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div>
                                <span class="detail-label"><?php esc_html_e('Address', 'chapaneri-heritage'); ?></span>
                                <span class="detail-value"><?php echo nl2br(esc_html($member['address'])); ?></span>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
                
                <!-- Biography -->
                <?php if (get_the_content()) : ?>
                    <div class="member-bio">
                        <h3 class="bio-title font-display"><?php esc_html_e('Biography', 'chapaneri-heritage'); ?></h3>
                        <div class="bio-content">
                            <?php the_content(); ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Sidebar - Family Connections -->
        <aside class="member-sidebar">
            <!-- Spouse -->
            <?php if ($spouse) : ?>
                <div class="card connection-card">
                    <div class="card-header">
                        <h3 class="card-title font-display">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <?php esc_html_e('Spouse', 'chapaneri-heritage'); ?>
                        </h3>
                    </div>
                    <div class="card-content">
                        <a href="<?php echo esc_url($spouse['permalink']); ?>" class="connection-link">
                            <div class="avatar">
                                <?php if ($spouse['photo']) : ?>
                                    <img src="<?php echo esc_url($spouse['photo']); ?>" alt="<?php echo esc_attr($spouse['name']); ?>">
                                <?php else : ?>
                                    <?php echo esc_html(mb_substr($spouse['name'], 0, 1)); ?>
                                <?php endif; ?>
                            </div>
                            <span><?php echo esc_html($spouse['name']); ?></span>
                        </a>
                    </div>
                </div>
            <?php endif; ?>
            
            <!-- Parents -->
            <?php if (!empty($parents)) : ?>
                <div class="card connection-card">
                    <div class="card-header">
                        <h3 class="card-title font-display">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <?php esc_html_e('Parents', 'chapaneri-heritage'); ?>
                        </h3>
                    </div>
                    <div class="card-content">
                        <?php foreach ($parents as $parent) : ?>
                            <a href="<?php echo esc_url($parent['permalink']); ?>" class="connection-link">
                                <div class="avatar">
                                    <?php if ($parent['photo']) : ?>
                                        <img src="<?php echo esc_url($parent['photo']); ?>" alt="<?php echo esc_attr($parent['name']); ?>">
                                    <?php else : ?>
                                        <?php echo esc_html(mb_substr($parent['name'], 0, 1)); ?>
                                    <?php endif; ?>
                                </div>
                                <span><?php echo esc_html($parent['name']); ?></span>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
            
            <!-- Children -->
            <?php if (!empty($children)) : ?>
                <div class="card connection-card">
                    <div class="card-header">
                        <h3 class="card-title font-display">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <?php esc_html_e('Children', 'chapaneri-heritage'); ?> 
                            <span class="badge badge-muted"><?php echo count($children); ?></span>
                        </h3>
                    </div>
                    <div class="card-content">
                        <?php foreach ($children as $child) : ?>
                            <a href="<?php echo esc_url($child['permalink']); ?>" class="connection-link">
                                <div class="avatar">
                                    <?php if ($child['photo']) : ?>
                                        <img src="<?php echo esc_url($child['photo']); ?>" alt="<?php echo esc_attr($child['name']); ?>">
                                    <?php else : ?>
                                        <?php echo esc_html(mb_substr($child['name'], 0, 1)); ?>
                                    <?php endif; ?>
                                </div>
                                <span><?php echo esc_html($child['name']); ?></span>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
            
            <!-- View Family Tree Button -->
            <a href="<?php echo esc_url(home_url('/family-tree?highlight=' . get_the_ID())); ?>" class="btn btn-primary btn-lg" style="width: 100%;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <?php esc_html_e('View in Family Tree', 'chapaneri-heritage'); ?>
            </a>
        </aside>
    </div>
</div>

<?php endwhile;

get_footer();
