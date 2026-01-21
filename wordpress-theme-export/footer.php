<?php
/**
 * The footer template
 *
 * @package Chapaneri_Heritage
 */
?>
    </main><!-- #primary -->

    <footer id="colophon" class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Brand Column -->
                <div class="footer-brand-section">
                    <div class="footer-brand font-display">
                        <?php bloginfo('name'); ?>
                    </div>
                    <p class="footer-description">
                        <?php echo esc_html(get_bloginfo('description')); ?>
                    </p>
                </div>

                <!-- Quick Links -->
                <div class="footer-column">
                    <h4 class="footer-heading font-display"><?php esc_html_e('Quick Links', 'chapaneri-heritage'); ?></h4>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer',
                        'menu_class'     => 'footer-links',
                        'container'      => false,
                        'fallback_cb'    => 'chapaneri_heritage_footer_fallback_menu',
                        'depth'          => 1,
                    ));
                    ?>
                </div>

                <!-- Widget Areas -->
                <?php if (is_active_sidebar('footer-1')) : ?>
                    <div class="footer-column">
                        <?php dynamic_sidebar('footer-1'); ?>
                    </div>
                <?php endif; ?>

                <?php if (is_active_sidebar('footer-2')) : ?>
                    <div class="footer-column">
                        <?php dynamic_sidebar('footer-2'); ?>
                    </div>
                <?php endif; ?>

                <?php if (is_active_sidebar('footer-3')) : ?>
                    <div class="footer-column">
                        <?php dynamic_sidebar('footer-3'); ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <p>
                    &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. 
                    <?php esc_html_e('All rights reserved.', 'chapaneri-heritage'); ?>
                </p>
                <p class="footer-credit">
                    <?php esc_html_e('Made with', 'chapaneri-heritage'); ?> 
                    <span style="color: var(--color-destructive);">&hearts;</span> 
                    <?php esc_html_e('for preserving family heritage', 'chapaneri-heritage'); ?>
                </p>
            </div>
        </div>
    </footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
