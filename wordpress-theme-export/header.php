<?php
/**
 * The header template
 *
 * @package Chapaneri_Heritage
 * @version 2.0.0
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#primary">
        <?php esc_html_e('Skip to content', 'chapaneri-heritage'); ?>
    </a>

    <header id="masthead" class="site-header">
        <div class="container">
            <nav class="site-nav" aria-label="<?php esc_attr_e('Primary Navigation', 'chapaneri-heritage'); ?>">
                <!-- Logo -->
                <div class="site-branding">
                    <?php if (has_custom_logo()) : ?>
                        <?php the_custom_logo(); ?>
                    <?php else : ?>
                        <a href="<?php echo esc_url(home_url('/')); ?>" class="site-logo" rel="home">
                            <div class="site-logo__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 13V2l8 4-8 4"/>
                                    <path d="M20.55 10.23A9 9 0 1 1 8 4.94"/>
                                    <path d="M8 10a5 5 0 1 0 8.9 2.02"/>
                                </svg>
                            </div>
                            <div class="site-logo__text">
                                <span class="site-logo__name font-display"><?php bloginfo('name'); ?></span>
                                <span class="site-logo__tagline"><?php esc_html_e('Family Heritage', 'chapaneri-heritage'); ?></span>
                            </div>
                        </a>
                    <?php endif; ?>
                </div>

                <!-- Desktop Navigation -->
                <div class="nav-desktop hide-mobile">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'menu_class'     => 'nav-menu',
                        'container'      => false,
                        'fallback_cb'    => 'chapaneri_heritage_fallback_menu',
                        'depth'          => 2,
                    ));
                    ?>
                </div>

                <!-- Action Buttons -->
                <div class="header-actions">
                    <!-- Theme Switcher -->
                    <div class="theme-switcher" style="position: relative;">
                        <button type="button" id="theme-switcher-toggle" class="btn btn-ghost theme-switcher__btn" aria-label="<?php esc_attr_e('Change color theme', 'chapaneri-heritage'); ?>">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                            </svg>
                            <span class="theme-switcher__label hide-mobile">Heritage</span>
                        </button>
                        <div class="theme-switcher__dropdown" id="theme-switcher-dropdown">
                            <?php
                            $themes = array(
                                'heritage' => array('Heritage', '#7a2e3a', '#d4a843', '#f5f0e8'),
                                'ocean'    => array('Ocean', '#1e6091', '#48cae4', '#f0f7ff'),
                                'forest'   => array('Forest', '#2d6a4f', '#95d5b2', '#f0f7f0'),
                                'royal'    => array('Royal', '#6a1b9a', '#e1bee7', '#faf5ff'),
                                'sunset'   => array('Sunset', '#c2410c', '#fb923c', '#fff7ed'),
                                'midnight' => array('Midnight', '#1e293b', '#60a5fa', '#0f172a'),
                            );
                            foreach ($themes as $key => $theme) :
                            ?>
                                <button type="button" class="theme-option" data-theme="<?php echo esc_attr($key); ?>">
                                    <span class="theme-option__colors">
                                        <span style="background: <?php echo esc_attr($theme[1]); ?>;"></span>
                                        <span style="background: <?php echo esc_attr($theme[2]); ?>;"></span>
                                        <span style="background: <?php echo esc_attr($theme[3]); ?>;"></span>
                                    </span>
                                    <span class="theme-option__name"><?php echo esc_html($theme[0]); ?></span>
                                </button>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <!-- Search Button -->
                    <a href="<?php echo esc_url(home_url('/search')); ?>" class="btn btn-ghost" aria-label="<?php esc_attr_e('Search', 'chapaneri-heritage'); ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </a>

                    <!-- Mobile Menu Toggle -->
                    <button type="button" id="mobile-menu-toggle" class="btn btn-ghost hide-desktop" aria-label="<?php esc_attr_e('Toggle menu', 'chapaneri-heritage'); ?>" aria-expanded="false">
                        <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                        <svg class="close-icon" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </nav>

            <!-- Mobile Navigation -->
            <div id="mobile-menu" class="mobile-nav hide-desktop" style="display: none;">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_class'     => 'mobile-nav-menu',
                    'container'      => false,
                    'fallback_cb'    => 'chapaneri_heritage_fallback_menu',
                    'depth'          => 2,
                ));
                ?>
            </div>
        </div>
    </header>

    <main id="primary" class="site-main">
