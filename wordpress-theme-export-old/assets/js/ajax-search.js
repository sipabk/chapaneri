/**
 * AJAX-Powered Search for Family Members
 *
 * @package Chapaneri_Heritage
 */

(function() {
    'use strict';

    // Initialize all AJAX search instances on page
    document.addEventListener('DOMContentLoaded', function() {
        const searchContainers = document.querySelectorAll('[data-ajax-search]');
        searchContainers.forEach(container => new AjaxSearch(container));
    });

    /**
     * AJAX Search Class
     */
    class AjaxSearch {
        constructor(container) {
            this.container = container;
            this.input = container.querySelector('[data-ajax-search-input]');
            this.results = container.querySelector('[data-ajax-search-results]');
            this.loader = container.querySelector('[data-ajax-search-loader]');
            this.minChars = parseInt(container.dataset.minChars) || 2;
            this.debounceTimer = null;
            this.debounceDelay = 300;
            this.currentRequest = null;
            
            if (this.input && this.results) {
                this.init();
            }
        }

        init() {
            // Input event listener with debouncing
            this.input.addEventListener('input', (e) => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    this.search(e.target.value);
                }, this.debounceDelay);
            });

            // Focus/blur handling
            this.input.addEventListener('focus', () => {
                if (this.input.value.length >= this.minChars) {
                    this.showResults();
                }
            });

            // Close results when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.container.contains(e.target)) {
                    this.hideResults();
                }
            });

            // Keyboard navigation
            this.input.addEventListener('keydown', (e) => {
                this.handleKeyboard(e);
            });
        }

        search(query) {
            query = query.trim();

            // Clear results if query too short
            if (query.length < this.minChars) {
                this.hideResults();
                this.results.innerHTML = '';
                return;
            }

            // Show loader
            if (this.loader) {
                this.loader.classList.add('active');
            }

            // Cancel previous request
            if (this.currentRequest) {
                this.currentRequest.abort();
            }

            // Create AJAX request
            const formData = new FormData();
            formData.append('action', 'chapaneri_member_search');
            formData.append('nonce', chapaneriAjax.nonce);
            formData.append('query', query);

            this.currentRequest = new AbortController();

            fetch(chapaneriAjax.ajaxUrl, {
                method: 'POST',
                body: formData,
                signal: this.currentRequest.signal
            })
            .then(response => response.json())
            .then(data => {
                this.hideLoader();
                if (data.success) {
                    this.renderResults(data.data);
                } else {
                    this.renderError(data.data.message || 'Search failed');
                }
            })
            .catch(error => {
                this.hideLoader();
                if (error.name !== 'AbortError') {
                    this.renderError('Search failed. Please try again.');
                }
            });
        }

        renderResults(members) {
            if (members.length === 0) {
                this.results.innerHTML = `
                    <div class="ajax-search__no-results">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span>No members found</span>
                    </div>
                `;
            } else {
                const html = members.map(member => this.renderMemberItem(member)).join('');
                this.results.innerHTML = html;
            }
            this.showResults();
        }

        renderMemberItem(member) {
            const avatarClass = member.gender ? `ajax-search__avatar--${member.gender}` : '';
            const initial = member.name.charAt(0).toUpperCase();
            const avatarContent = member.thumbnail 
                ? `<img src="${member.thumbnail}" alt="${this.escapeHtml(member.name)}">`
                : initial;

            let details = [];
            if (member.birth_date) {
                details.push(member.birth_date);
            }
            if (member.birth_place) {
                details.push(member.birth_place);
            }

            return `
                <a href="${member.url}" class="ajax-search__item">
                    <div class="ajax-search__avatar ${avatarClass}">
                        ${avatarContent}
                    </div>
                    <div class="ajax-search__info">
                        <span class="ajax-search__name">${this.highlightMatch(member.name)}</span>
                        ${details.length ? `<span class="ajax-search__details">${details.join(' • ')}</span>` : ''}
                    </div>
                    <svg class="ajax-search__arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </a>
            `;
        }

        highlightMatch(text) {
            const query = this.input.value.trim();
            if (!query) return this.escapeHtml(text);
            
            const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
            return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
        }

        renderError(message) {
            this.results.innerHTML = `
                <div class="ajax-search__error">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>${this.escapeHtml(message)}</span>
                </div>
            `;
            this.showResults();
        }

        showResults() {
            this.results.classList.add('active');
        }

        hideResults() {
            this.results.classList.remove('active');
        }

        hideLoader() {
            if (this.loader) {
                this.loader.classList.remove('active');
            }
        }

        handleKeyboard(e) {
            const items = this.results.querySelectorAll('.ajax-search__item');
            const activeItem = this.results.querySelector('.ajax-search__item--active');
            let currentIndex = Array.from(items).indexOf(activeItem);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < items.length - 1) {
                        this.setActiveItem(items, currentIndex + 1);
                    } else {
                        this.setActiveItem(items, 0);
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        this.setActiveItem(items, currentIndex - 1);
                    } else {
                        this.setActiveItem(items, items.length - 1);
                    }
                    break;

                case 'Enter':
                    if (activeItem) {
                        e.preventDefault();
                        window.location.href = activeItem.href;
                    }
                    break;

                case 'Escape':
                    this.hideResults();
                    this.input.blur();
                    break;
            }
        }

        setActiveItem(items, index) {
            items.forEach(item => item.classList.remove('ajax-search__item--active'));
            if (items[index]) {
                items[index].classList.add('ajax-search__item--active');
                items[index].scrollIntoView({ block: 'nearest' });
            }
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    }

    // Export for external use
    window.ChapaneriAjaxSearch = AjaxSearch;
})();
