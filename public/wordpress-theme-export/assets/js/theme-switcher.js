/**
 * Multi-Theme Switcher
 *
 * Handles switching between 6 color themes with localStorage persistence.
 * Replaces the simple dark mode toggle from v1.
 *
 * @package Chapaneri_Heritage
 * @version 2.0.0
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'chapaneri-theme';
    const THEMES = ['heritage', 'ocean', 'forest', 'royal', 'sunset', 'midnight'];
    const html = document.documentElement;

    /**
     * Theme CSS variable definitions
     */
    const themeVars = {
        heritage: {
            '--color-background': 'hsl(40, 20%, 98%)',
            '--color-foreground': 'hsl(25, 30%, 12%)',
            '--color-card': 'hsl(40, 25%, 97%)',
            '--color-card-foreground': 'hsl(25, 30%, 12%)',
            '--color-popover': 'hsl(40, 25%, 97%)',
            '--color-popover-foreground': 'hsl(25, 30%, 12%)',
            '--color-primary': 'hsl(350, 45%, 35%)',
            '--color-primary-foreground': 'hsl(40, 20%, 98%)',
            '--color-secondary': 'hsl(38, 35%, 92%)',
            '--color-secondary-foreground': 'hsl(25, 30%, 18%)',
            '--color-muted': 'hsl(35, 20%, 90%)',
            '--color-muted-foreground': 'hsl(25, 15%, 45%)',
            '--color-accent': 'hsl(42, 85%, 55%)',
            '--color-accent-foreground': 'hsl(25, 30%, 12%)',
            '--color-success': 'hsl(145, 35%, 38%)',
            '--color-success-foreground': 'hsl(40, 20%, 98%)',
            '--color-destructive': 'hsl(0, 65%, 50%)',
            '--color-destructive-foreground': 'hsl(40, 20%, 98%)',
            '--color-border': 'hsl(35, 25%, 85%)',
            '--color-input': 'hsl(35, 25%, 85%)',
            '--color-ring': 'hsl(350, 45%, 35%)',
            '--gradient-hero': 'linear-gradient(135deg, hsl(350, 45%, 35%) 0%, hsl(25, 35%, 28%) 100%)',
            '--gradient-gold': 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(38, 75%, 45%) 100%)',
            '--gradient-parchment': 'linear-gradient(180deg, hsl(40, 25%, 97%) 0%, hsl(38, 30%, 93%) 100%)',
        },
        ocean: {
            '--color-background': 'hsl(210, 30%, 98%)',
            '--color-foreground': 'hsl(210, 40%, 10%)',
            '--color-card': 'hsl(210, 25%, 97%)',
            '--color-card-foreground': 'hsl(210, 40%, 10%)',
            '--color-popover': 'hsl(210, 25%, 97%)',
            '--color-popover-foreground': 'hsl(210, 40%, 10%)',
            '--color-primary': 'hsl(205, 65%, 35%)',
            '--color-primary-foreground': 'hsl(210, 30%, 98%)',
            '--color-secondary': 'hsl(205, 30%, 92%)',
            '--color-secondary-foreground': 'hsl(210, 35%, 18%)',
            '--color-muted': 'hsl(210, 20%, 90%)',
            '--color-muted-foreground': 'hsl(210, 15%, 45%)',
            '--color-accent': 'hsl(190, 80%, 55%)',
            '--color-accent-foreground': 'hsl(210, 40%, 10%)',
            '--color-success': 'hsl(160, 45%, 38%)',
            '--color-success-foreground': 'hsl(210, 30%, 98%)',
            '--color-destructive': 'hsl(0, 65%, 50%)',
            '--color-destructive-foreground': 'hsl(210, 30%, 98%)',
            '--color-border': 'hsl(210, 25%, 85%)',
            '--color-input': 'hsl(210, 25%, 85%)',
            '--color-ring': 'hsl(205, 65%, 35%)',
            '--gradient-hero': 'linear-gradient(135deg, hsl(205, 65%, 35%) 0%, hsl(220, 50%, 25%) 100%)',
            '--gradient-gold': 'linear-gradient(135deg, hsl(190, 80%, 55%) 0%, hsl(200, 70%, 45%) 100%)',
            '--gradient-parchment': 'linear-gradient(180deg, hsl(210, 25%, 97%) 0%, hsl(210, 30%, 93%) 100%)',
        },
        forest: {
            '--color-background': 'hsl(140, 20%, 98%)',
            '--color-foreground': 'hsl(150, 30%, 10%)',
            '--color-card': 'hsl(140, 25%, 97%)',
            '--color-card-foreground': 'hsl(150, 30%, 10%)',
            '--color-popover': 'hsl(140, 25%, 97%)',
            '--color-popover-foreground': 'hsl(150, 30%, 10%)',
            '--color-primary': 'hsl(153, 50%, 33%)',
            '--color-primary-foreground': 'hsl(140, 20%, 98%)',
            '--color-secondary': 'hsl(140, 30%, 92%)',
            '--color-secondary-foreground': 'hsl(150, 25%, 18%)',
            '--color-muted': 'hsl(140, 18%, 90%)',
            '--color-muted-foreground': 'hsl(150, 12%, 45%)',
            '--color-accent': 'hsl(80, 55%, 50%)',
            '--color-accent-foreground': 'hsl(150, 30%, 10%)',
            '--color-success': 'hsl(145, 40%, 38%)',
            '--color-success-foreground': 'hsl(140, 20%, 98%)',
            '--color-destructive': 'hsl(0, 65%, 50%)',
            '--color-destructive-foreground': 'hsl(140, 20%, 98%)',
            '--color-border': 'hsl(140, 22%, 85%)',
            '--color-input': 'hsl(140, 22%, 85%)',
            '--color-ring': 'hsl(153, 50%, 33%)',
            '--gradient-hero': 'linear-gradient(135deg, hsl(153, 50%, 33%) 0%, hsl(160, 40%, 22%) 100%)',
            '--gradient-gold': 'linear-gradient(135deg, hsl(80, 55%, 50%) 0%, hsl(100, 45%, 40%) 100%)',
            '--gradient-parchment': 'linear-gradient(180deg, hsl(140, 25%, 97%) 0%, hsl(140, 28%, 93%) 100%)',
        },
        royal: {
            '--color-background': 'hsl(280, 20%, 98%)',
            '--color-foreground': 'hsl(270, 30%, 10%)',
            '--color-card': 'hsl(280, 25%, 97%)',
            '--color-card-foreground': 'hsl(270, 30%, 10%)',
            '--color-popover': 'hsl(280, 25%, 97%)',
            '--color-popover-foreground': 'hsl(270, 30%, 10%)',
            '--color-primary': 'hsl(280, 60%, 35%)',
            '--color-primary-foreground': 'hsl(280, 20%, 98%)',
            '--color-secondary': 'hsl(280, 30%, 92%)',
            '--color-secondary-foreground': 'hsl(270, 25%, 18%)',
            '--color-muted': 'hsl(275, 18%, 90%)',
            '--color-muted-foreground': 'hsl(270, 12%, 45%)',
            '--color-accent': 'hsl(45, 80%, 55%)',
            '--color-accent-foreground': 'hsl(270, 30%, 10%)',
            '--color-success': 'hsl(145, 35%, 38%)',
            '--color-success-foreground': 'hsl(280, 20%, 98%)',
            '--color-destructive': 'hsl(0, 65%, 50%)',
            '--color-destructive-foreground': 'hsl(280, 20%, 98%)',
            '--color-border': 'hsl(275, 22%, 85%)',
            '--color-input': 'hsl(275, 22%, 85%)',
            '--color-ring': 'hsl(280, 60%, 35%)',
            '--gradient-hero': 'linear-gradient(135deg, hsl(280, 60%, 35%) 0%, hsl(260, 50%, 25%) 100%)',
            '--gradient-gold': 'linear-gradient(135deg, hsl(45, 80%, 55%) 0%, hsl(35, 70%, 45%) 100%)',
            '--gradient-parchment': 'linear-gradient(180deg, hsl(280, 25%, 97%) 0%, hsl(280, 28%, 93%) 100%)',
        },
        sunset: {
            '--color-background': 'hsl(30, 30%, 98%)',
            '--color-foreground': 'hsl(20, 35%, 10%)',
            '--color-card': 'hsl(30, 30%, 97%)',
            '--color-card-foreground': 'hsl(20, 35%, 10%)',
            '--color-popover': 'hsl(30, 30%, 97%)',
            '--color-popover-foreground': 'hsl(20, 35%, 10%)',
            '--color-primary': 'hsl(20, 80%, 42%)',
            '--color-primary-foreground': 'hsl(30, 30%, 98%)',
            '--color-secondary': 'hsl(30, 35%, 92%)',
            '--color-secondary-foreground': 'hsl(20, 28%, 18%)',
            '--color-muted': 'hsl(28, 22%, 90%)',
            '--color-muted-foreground': 'hsl(20, 12%, 45%)',
            '--color-accent': 'hsl(45, 90%, 55%)',
            '--color-accent-foreground': 'hsl(20, 35%, 10%)',
            '--color-success': 'hsl(145, 35%, 38%)',
            '--color-success-foreground': 'hsl(30, 30%, 98%)',
            '--color-destructive': 'hsl(0, 65%, 50%)',
            '--color-destructive-foreground': 'hsl(30, 30%, 98%)',
            '--color-border': 'hsl(28, 25%, 85%)',
            '--color-input': 'hsl(28, 25%, 85%)',
            '--color-ring': 'hsl(20, 80%, 42%)',
            '--gradient-hero': 'linear-gradient(135deg, hsl(20, 80%, 42%) 0%, hsl(350, 60%, 35%) 100%)',
            '--gradient-gold': 'linear-gradient(135deg, hsl(45, 90%, 55%) 0%, hsl(30, 80%, 50%) 100%)',
            '--gradient-parchment': 'linear-gradient(180deg, hsl(30, 30%, 97%) 0%, hsl(28, 32%, 93%) 100%)',
        },
        midnight: {
            '--color-background': 'hsl(222, 30%, 7%)',
            '--color-foreground': 'hsl(210, 20%, 90%)',
            '--color-card': 'hsl(222, 25%, 11%)',
            '--color-card-foreground': 'hsl(210, 20%, 90%)',
            '--color-popover': 'hsl(222, 25%, 11%)',
            '--color-popover-foreground': 'hsl(210, 20%, 90%)',
            '--color-primary': 'hsl(217, 70%, 55%)',
            '--color-primary-foreground': 'hsl(222, 30%, 7%)',
            '--color-secondary': 'hsl(220, 20%, 18%)',
            '--color-secondary-foreground': 'hsl(210, 18%, 82%)',
            '--color-muted': 'hsl(220, 15%, 16%)',
            '--color-muted-foreground': 'hsl(215, 12%, 50%)',
            '--color-accent': 'hsl(38, 80%, 55%)',
            '--color-accent-foreground': 'hsl(222, 30%, 7%)',
            '--color-success': 'hsl(160, 45%, 40%)',
            '--color-success-foreground': 'hsl(222, 30%, 7%)',
            '--color-destructive': 'hsl(0, 60%, 50%)',
            '--color-destructive-foreground': 'hsl(210, 20%, 90%)',
            '--color-border': 'hsl(220, 15%, 20%)',
            '--color-input': 'hsl(220, 15%, 20%)',
            '--color-ring': 'hsl(217, 70%, 55%)',
            '--gradient-hero': 'linear-gradient(135deg, hsl(217, 70%, 35%) 0%, hsl(240, 50%, 22%) 100%)',
            '--gradient-gold': 'linear-gradient(135deg, hsl(38, 80%, 55%) 0%, hsl(45, 70%, 45%) 100%)',
            '--gradient-parchment': 'linear-gradient(180deg, hsl(222, 25%, 11%) 0%, hsl(222, 22%, 9%) 100%)',
        },
    };

    const themeLabels = {
        heritage: 'Heritage',
        ocean: 'Ocean',
        forest: 'Forest',
        royal: 'Royal',
        sunset: 'Sunset',
        midnight: 'Midnight',
    };

    const themeColors = {
        heritage: ['#7a2e3a', '#d4a843', '#f5f0e8'],
        ocean: ['#1e6091', '#48cae4', '#f0f7ff'],
        forest: ['#2d6a4f', '#95d5b2', '#f0f7f0'],
        royal: ['#6a1b9a', '#e1bee7', '#faf5ff'],
        sunset: ['#c2410c', '#fb923c', '#fff7ed'],
        midnight: ['#1e293b', '#60a5fa', '#0f172a'],
    };

    /**
     * Get stored theme or default
     */
    function getStoredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(stored) ? stored : 'heritage';
    }

    /**
     * Apply theme CSS variables
     */
    function applyTheme(themeName) {
        if (!themeVars[themeName]) return;
        
        const vars = themeVars[themeName];
        Object.entries(vars).forEach(([key, value]) => {
            html.style.setProperty(key, value);
        });
        
        html.setAttribute('data-theme', themeName);
        localStorage.setItem(STORAGE_KEY, themeName);

        // Update header background for dark themes
        const header = document.querySelector('.site-header');
        if (header) {
            if (themeName === 'midnight') {
                header.style.backgroundColor = 'hsla(222, 30%, 7%, 0.95)';
            } else {
                header.style.backgroundColor = '';
            }
        }

        // Update active state in dropdown
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.theme === themeName);
        });

        // Update button label
        const label = document.querySelector('.theme-switcher__label');
        if (label) {
            label.textContent = themeLabels[themeName] || themeName;
        }
    }

    /**
     * Initialize theme switcher
     */
    function init() {
        // Apply stored theme immediately
        applyTheme(getStoredTheme());

        // Setup dropdown toggle
        const toggle = document.getElementById('theme-switcher-toggle');
        const dropdown = document.getElementById('theme-switcher-dropdown');

        if (toggle && dropdown) {
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Close dropdown on outside click
            document.addEventListener('click', function(e) {
                if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });

            // Theme option clicks
            dropdown.querySelectorAll('.theme-option').forEach(option => {
                option.addEventListener('click', function() {
                    applyTheme(this.dataset.theme);
                    dropdown.classList.remove('active');
                });
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.ChapaneriThemeSwitcher = { applyTheme, getStoredTheme, THEMES };
})();
