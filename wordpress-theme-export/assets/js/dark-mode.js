/**
 * Dark Mode Toggle
 *
 * Handles dark mode toggle functionality with localStorage persistence.
 *
 * @package Chapaneri_Heritage
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'chapaneri-dark-mode';
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const sunIcon = darkModeToggle?.querySelector('.sun-icon');
    const moonIcon = darkModeToggle?.querySelector('.moon-icon');
    const html = document.documentElement;

    /**
     * Get stored preference or system preference
     */
    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (stored) {
            return stored;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }

    /**
     * Set theme
     */
    function setTheme(theme) {
        if (theme === 'dark') {
            html.classList.add('dark');
            html.setAttribute('data-theme', 'dark');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            html.classList.remove('dark');
            html.setAttribute('data-theme', 'light');
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
        
        localStorage.setItem(STORAGE_KEY, theme);
    }

    /**
     * Toggle theme
     */
    function toggleTheme() {
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Initialize theme on load
    setTheme(getPreferredTheme());

    // Toggle button click handler
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            // Only update if no stored preference
            if (!localStorage.getItem(STORAGE_KEY)) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

})();
