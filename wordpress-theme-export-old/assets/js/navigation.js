/**
 * Navigation JavaScript
 *
 * Handles mobile menu toggle and navigation interactions.
 *
 * @package Chapaneri_Heritage
 */

(function() {
    'use strict';

    /**
     * Mobile Menu Toggle
     */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuToggle?.querySelector('.menu-icon');
    const closeIcon = mobileMenuToggle?.querySelector('.close-icon');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            if (isExpanded) {
                mobileMenu.style.display = 'none';
                this.setAttribute('aria-expanded', 'false');
                menuIcon.style.display = 'block';
                closeIcon.style.display = 'none';
                document.body.style.overflow = '';
            } else {
                mobileMenu.style.display = 'block';
                this.setAttribute('aria-expanded', 'true');
                menuIcon.style.display = 'none';
                closeIcon.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
                mobileMenu.style.display = 'none';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                menuIcon.style.display = 'block';
                closeIcon.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                if (mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
                    mobileMenu.style.display = 'none';
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    menuIcon.style.display = 'block';
                    closeIcon.style.display = 'none';
                    document.body.style.overflow = '';
                }
            }
        });

        // Close menu on resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
                mobileMenu.style.display = 'none';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                menuIcon.style.display = 'block';
                closeIcon.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    /**
     * Add active state to current navigation item
     */
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-menu a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    /**
     * Sticky header shadow on scroll
     */
    const header = document.querySelector('.site-header');
    
    if (header) {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    /**
     * Animate elements on scroll
     */
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight * 0.8;
            
            if (isVisible) {
                el.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run on load

})();
