/**
 * Statistics Charts — Chart.js initialization for all 8 statistics tabs
 *
 * @package Chapaneri_Heritage
 * @since 3.0.0
 */

(function () {
  'use strict';

  if (typeof Chart === 'undefined' || typeof chapaneriStats === 'undefined') return;

  var COLORS = {
    blue: 'hsl(210, 60%, 55%)',
    pink: 'hsl(340, 60%, 55%)',
    green: 'hsl(145, 50%, 45%)',
    grey: 'hsl(0, 0%, 60%)',
    gold: 'hsl(42, 85%, 55%)',
    purple: 'hsl(270, 50%, 55%)',
    orange: 'hsl(25, 80%, 55%)',
    teal: 'hsl(180, 50%, 45%)',
    red: 'hsl(0, 65%, 50%)',
  };

  var PALETTE = [
    COLORS.blue, COLORS.pink, COLORS.green, COLORS.gold,
    COLORS.purple, COLORS.orange, COLORS.teal, COLORS.red,
    COLORS.grey, 'hsl(60, 60%, 50%)', 'hsl(300, 40%, 50%)', 'hsl(120, 40%, 50%)'
  ];

  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.display = false;

  function initChart(id, config) {
    var el = document.getElementById(id);
    if (!el) return null;
    return new Chart(el.getContext('2d'), config);
  }

  // ==================== Overview Tab ====================

  // Gender Pie
  initChart('chart-gender', {
    type: 'doughnut',
    data: {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [chapaneriStats.gender.male, chapaneriStats.gender.female],
        backgroundColor: [COLORS.blue, COLORS.pink],
        borderWidth: 2,
        borderColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '60%',
      plugins: { legend: { display: true, position: 'bottom' } }
    }
  });

  // Living Pie
  initChart('chart-living', {
    type: 'doughnut',
    data: {
      labels: ['Living', 'Deceased'],
      datasets: [{
        data: [chapaneriStats.living.living, chapaneriStats.living.deceased],
        backgroundColor: [COLORS.green, COLORS.grey],
        borderWidth: 2,
        borderColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '60%',
      plugins: { legend: { display: true, position: 'bottom' } }
    }
  });

  // ==================== Relationships Tab ====================

  if (chapaneriStats.relTypes && chapaneriStats.relTypes.length) {
    initChart('chart-rel-types', {
      type: 'bar',
      data: {
        labels: chapaneriStats.relTypes.map(function (r) { return r.type.charAt(0).toUpperCase() + r.type.slice(1); }),
        datasets: [{
          data: chapaneriStats.relTypes.map(function (r) { return r.count; }),
          backgroundColor: PALETTE.slice(0, chapaneriStats.relTypes.length),
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // ==================== Places Tab ====================

  if (chapaneriStats.birthPlaces && chapaneriStats.birthPlaces.length) {
    initChart('chart-birth-places', {
      type: 'bar',
      data: {
        labels: chapaneriStats.birthPlaces.map(function (p) { return p.place; }),
        datasets: [{
          data: chapaneriStats.birthPlaces.map(function (p) { return p.count; }),
          backgroundColor: PALETTE.slice(0, chapaneriStats.birthPlaces.length),
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1 } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // ==================== Ages Tab ====================

  initChart('chart-ages', {
    type: 'bar',
    data: {
      labels: chapaneriStats.ageGroups.map(function (g) { return g.range; }),
      datasets: [
        {
          label: 'Male',
          data: chapaneriStats.ageGroups.map(function (g) { return g.male; }),
          backgroundColor: COLORS.blue,
          borderRadius: 4,
        },
        {
          label: 'Female',
          data: chapaneriStats.ageGroups.map(function (g) { return g.female; }),
          backgroundColor: COLORS.pink,
          borderRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: true, position: 'top' } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      }
    }
  });

  // ==================== Births Tab ====================

  initChart('chart-birth-months', {
    type: 'bar',
    data: {
      labels: chapaneriStats.birthMonths.map(function (m) { return m.month.substring(0, 3); }),
      datasets: [{
        data: chapaneriStats.birthMonths.map(function (m) { return m.count; }),
        backgroundColor: COLORS.gold,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      }
    }
  });

  if (chapaneriStats.zodiac && chapaneriStats.zodiac.length) {
    initChart('chart-zodiac', {
      type: 'doughnut',
      data: {
        labels: chapaneriStats.zodiac.map(function (z) { return z.sign; }),
        datasets: [{
          data: chapaneriStats.zodiac.map(function (z) { return z.count; }),
          backgroundColor: PALETTE.slice(0, chapaneriStats.zodiac.length),
          borderWidth: 2,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '50%',
        plugins: { legend: { display: true, position: 'right' } }
      }
    });
  }

  if (chapaneriStats.decades && chapaneriStats.decades.length) {
    initChart('chart-decades', {
      type: 'bar',
      data: {
        labels: chapaneriStats.decades.map(function (d) { return d.decade; }),
        datasets: [{
          data: chapaneriStats.decades.map(function (d) { return d.count; }),
          backgroundColor: COLORS.purple,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // ==================== Children Tab ====================

  if (chapaneriStats.familySize && chapaneriStats.familySize.length) {
    initChart('chart-family-size', {
      type: 'bar',
      data: {
        labels: chapaneriStats.familySize.map(function (f) { return f.size; }),
        datasets: [{
          data: chapaneriStats.familySize.map(function (f) { return f.count; }),
          backgroundColor: COLORS.teal,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // ==================== Tab Switching ====================

  document.querySelectorAll('.stats-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.stats-tab').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.stats-tab-content').forEach(function (c) { c.classList.remove('active'); });
      btn.classList.add('active');
      var target = document.getElementById('tab-' + btn.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });

})();
