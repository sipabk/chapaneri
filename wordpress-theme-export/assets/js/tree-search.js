/**
 * Tree Search — Search, highlight, and auto-expand tree nodes
 *
 * @package Chapaneri_Heritage
 * @since 3.0.0
 */

(function () {
  'use strict';

  var searchInput = document.getElementById('tree-search-input');
  var container = document.getElementById('familyTreeContainer');
  if (!searchInput || !container) return;

  var debounceTimer;

  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      performSearch(searchInput.value.trim().toLowerCase());
    }, 300);
  });

  function performSearch(query) {
    // Clear all highlights
    container.querySelectorAll('.tree-node__card').forEach(function (card) {
      card.classList.remove('tree-node--highlighted');
    });

    if (!query || query.length < 2) return;

    var matches = [];

    container.querySelectorAll('.tree-node__card').forEach(function (card) {
      var nameEl = card.querySelector('.tree-node__name');
      if (!nameEl) return;

      var name = nameEl.textContent.toLowerCase();
      if (name.indexOf(query) !== -1) {
        matches.push(card);
        card.classList.add('tree-node--highlighted');
      }
    });

    // Auto-expand parents of matched nodes
    matches.forEach(function (card) {
      expandParents(card);
    });

    // Scroll to first match
    if (matches.length > 0) {
      matches[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Update results count
    var countEl = document.getElementById('tree-search-count');
    if (countEl) {
      countEl.textContent = matches.length + ' found';
      countEl.style.display = matches.length > 0 ? 'inline' : 'none';
    }
  }

  function expandParents(element) {
    var parent = element.closest('.tree-node__children');
    while (parent) {
      parent.style.display = 'block';
      var toggleBtn = parent.parentElement.querySelector('.tree-node__toggle');
      if (toggleBtn) {
        toggleBtn.setAttribute('data-expanded', 'true');
        var icon = toggleBtn.querySelector('.tree-node__toggle-icon');
        if (icon) icon.style.transform = 'rotate(90deg)';
      }
      parent = parent.parentElement.closest('.tree-node__children');
    }
  }

})();
