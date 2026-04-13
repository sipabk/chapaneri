<?php
/**
 * Template Name: Family Statistics
 * Description: Comprehensive statistics dashboard with 8 tabs
 *
 * @package Chapaneri_Heritage
 * @since 3.0.0
 */

get_header();

// Load stats calculator
if (!class_exists('Chapaneri_Statistics_Calculator')) {
    require_once get_template_directory() . '/inc/class-statistics-calculator.php';
}

$stats = Chapaneri_Statistics_Calculator::instance();
$gender = $stats->get_gender_stats();
$living = $stats->get_living_stats();
$age_groups = $stats->get_age_groups();
$oldest = $stats->get_oldest_living();
$youngest = $stats->get_youngest_living();
$birth_months = $stats->get_birth_months();
$zodiac = $stats->get_zodiac_signs();
$decades = $stats->get_birth_decades();
$network = $stats->get_relationship_network();
$children = $stats->get_children_stats();
$places = $stats->get_places_stats();
?>

<div class="container section">
    <!-- Page Header -->
    <header class="page-header-section">
        <div class="page-header__badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <span><?php esc_html_e('Family Analytics', 'chapaneri-heritage'); ?></span>
        </div>
        <h1 class="page-title font-display"><?php esc_html_e('Family Statistics', 'chapaneri-heritage'); ?></h1>
        <p class="page-description"><?php esc_html_e('Comprehensive analytics and insights about the family tree.', 'chapaneri-heritage'); ?></p>
        
        <!-- Print/Export Button -->
        <div class="stats-actions" style="margin-top: var(--spacing-4);">
            <button type="button" onclick="window.print()" class="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                <?php esc_html_e('Print / Export PDF', 'chapaneri-heritage'); ?>
            </button>
        </div>
    </header>

    <!-- Stats Summary Cards -->
    <div class="stats-summary-grid">
        <div class="stat-card heritage-card">
            <div class="stat-card__value"><?php echo esc_html($gender['total']); ?></div>
            <div class="stat-card__label"><?php esc_html_e('Total Members', 'chapaneri-heritage'); ?></div>
        </div>
        <div class="stat-card heritage-card">
            <div class="stat-card__value"><?php echo esc_html($living['living']); ?></div>
            <div class="stat-card__label"><?php esc_html_e('Living', 'chapaneri-heritage'); ?></div>
        </div>
        <div class="stat-card heritage-card">
            <div class="stat-card__value"><?php echo esc_html($network['totalConnections']); ?></div>
            <div class="stat-card__label"><?php esc_html_e('Relationships', 'chapaneri-heritage'); ?></div>
        </div>
        <div class="stat-card heritage-card">
            <div class="stat-card__value"><?php echo esc_html($network['treeDepth']); ?></div>
            <div class="stat-card__label"><?php esc_html_e('Generations', 'chapaneri-heritage'); ?></div>
        </div>
    </div>

    <!-- Tabs -->
    <div class="stats-tabs" id="statistics-tabs">
        <div class="stats-tabs__nav">
            <button class="stats-tab active" data-tab="overview"><?php esc_html_e('Overview', 'chapaneri-heritage'); ?></button>
            <button class="stats-tab" data-tab="relationships"><?php esc_html_e('Relationships', 'chapaneri-heritage'); ?></button>
            <button class="stats-tab" data-tab="places"><?php esc_html_e('Places', 'chapaneri-heritage'); ?></button>
            <button class="stats-tab" data-tab="ages"><?php esc_html_e('Ages', 'chapaneri-heritage'); ?></button>
            <button class="stats-tab" data-tab="births"><?php esc_html_e('Births', 'chapaneri-heritage'); ?></button>
            <button class="stats-tab" data-tab="marriages"><?php esc_html_e('Marriages', 'chapaneri-heritage'); ?></button>
            <button class="stats-tab" data-tab="children"><?php esc_html_e('Children', 'chapaneri-heritage'); ?></button>
            <button class="stats-tab" data-tab="divorces"><?php esc_html_e('Divorces', 'chapaneri-heritage'); ?></button>
        </div>

        <!-- Overview Tab -->
        <div class="stats-tab-content active" id="tab-overview">
            <div class="stats-charts-grid">
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Gender Distribution', 'chapaneri-heritage'); ?></h3>
                    <canvas id="chart-gender" width="400" height="300"></canvas>
                    <div class="chart-legend">
                        <span class="chart-legend__item"><span class="legend-dot" style="background: hsl(210, 60%, 55%);"></span> <?php printf(__('Male: %d (%d%%)', 'chapaneri-heritage'), $gender['male'], $gender['malePercent']); ?></span>
                        <span class="chart-legend__item"><span class="legend-dot" style="background: hsl(340, 60%, 55%);"></span> <?php printf(__('Female: %d (%d%%)', 'chapaneri-heritage'), $gender['female'], $gender['femalePercent']); ?></span>
                    </div>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Living vs Deceased', 'chapaneri-heritage'); ?></h3>
                    <canvas id="chart-living" width="400" height="300"></canvas>
                    <div class="chart-legend">
                        <span class="chart-legend__item"><span class="legend-dot" style="background: hsl(145, 50%, 45%);"></span> <?php printf(__('Living: %d (%d%%)', 'chapaneri-heritage'), $living['living'], $living['livingPercent']); ?></span>
                        <span class="chart-legend__item"><span class="legend-dot" style="background: hsl(0, 0%, 60%);"></span> <?php printf(__('Deceased: %d (%d%%)', 'chapaneri-heritage'), $living['deceased'], $living['deceasedPercent']); ?></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Relationships Tab -->
        <div class="stats-tab-content" id="tab-relationships">
            <div class="stats-charts-grid">
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Network Overview', 'chapaneri-heritage'); ?></h3>
                    <div class="stats-info-grid">
                        <div class="stats-info-item">
                            <span class="stats-info-value"><?php echo esc_html($network['totalConnections']); ?></span>
                            <span class="stats-info-label"><?php esc_html_e('Total Connections', 'chapaneri-heritage'); ?></span>
                        </div>
                        <div class="stats-info-item">
                            <span class="stats-info-value"><?php echo esc_html($network['avgConnectionsPerPerson']); ?></span>
                            <span class="stats-info-label"><?php esc_html_e('Avg per Person', 'chapaneri-heritage'); ?></span>
                        </div>
                        <div class="stats-info-item">
                            <span class="stats-info-value"><?php echo esc_html($network['treeDepth']); ?></span>
                            <span class="stats-info-label"><?php esc_html_e('Tree Depth', 'chapaneri-heritage'); ?></span>
                        </div>
                    </div>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Most Connected Members', 'chapaneri-heritage'); ?></h3>
                    <?php if (!empty($network['mostConnected'])) : ?>
                        <table class="stats-table">
                            <thead><tr><th><?php esc_html_e('Name', 'chapaneri-heritage'); ?></th><th><?php esc_html_e('Connections', 'chapaneri-heritage'); ?></th></tr></thead>
                            <tbody>
                                <?php foreach ($network['mostConnected'] as $mc) : ?>
                                    <tr><td><?php echo esc_html($mc['name']); ?></td><td><strong><?php echo esc_html($mc['count']); ?></strong></td></tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <p class="stats-empty"><?php esc_html_e('No relationship data available.', 'chapaneri-heritage'); ?></p>
                    <?php endif; ?>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Relationship Types', 'chapaneri-heritage'); ?></h3>
                    <canvas id="chart-rel-types" width="400" height="300"></canvas>
                </div>
            </div>
        </div>

        <!-- Places Tab -->
        <div class="stats-tab-content" id="tab-places">
            <div class="stats-charts-grid">
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Birth Places', 'chapaneri-heritage'); ?></h3>
                    <?php if (!empty($places['birthPlaces'])) : ?>
                        <canvas id="chart-birth-places" width="400" height="300"></canvas>
                    <?php else : ?>
                        <p class="stats-empty"><?php esc_html_e('No birth place data available.', 'chapaneri-heritage'); ?></p>
                    <?php endif; ?>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Places Summary', 'chapaneri-heritage'); ?></h3>
                    <div class="stats-info-grid">
                        <div class="stats-info-item">
                            <span class="stats-info-value"><?php echo count($places['birthPlaces']); ?></span>
                            <span class="stats-info-label"><?php esc_html_e('Unique Birth Places', 'chapaneri-heritage'); ?></span>
                        </div>
                        <div class="stats-info-item">
                            <span class="stats-info-value"><?php echo count($places['residences']); ?></span>
                            <span class="stats-info-label"><?php esc_html_e('Residences', 'chapaneri-heritage'); ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ages Tab -->
        <div class="stats-tab-content" id="tab-ages">
            <div class="stats-charts-grid">
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Age Distribution', 'chapaneri-heritage'); ?></h3>
                    <canvas id="chart-ages" width="400" height="300"></canvas>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Oldest Living Members', 'chapaneri-heritage'); ?></h3>
                    <?php if (!empty($oldest)) : ?>
                        <table class="stats-table">
                            <thead><tr><th><?php esc_html_e('Name', 'chapaneri-heritage'); ?></th><th><?php esc_html_e('Age', 'chapaneri-heritage'); ?></th><th><?php esc_html_e('Born', 'chapaneri-heritage'); ?></th></tr></thead>
                            <tbody>
                                <?php foreach ($oldest as $p) : ?>
                                    <tr><td><?php echo esc_html($p['name']); ?></td><td><strong><?php echo esc_html($p['age']); ?></strong></td><td><?php echo esc_html($p['birthYear']); ?></td></tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <p class="stats-empty"><?php esc_html_e('No age data available.', 'chapaneri-heritage'); ?></p>
                    <?php endif; ?>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Youngest Living Members', 'chapaneri-heritage'); ?></h3>
                    <?php if (!empty($youngest)) : ?>
                        <table class="stats-table">
                            <thead><tr><th><?php esc_html_e('Name', 'chapaneri-heritage'); ?></th><th><?php esc_html_e('Age', 'chapaneri-heritage'); ?></th><th><?php esc_html_e('Born', 'chapaneri-heritage'); ?></th></tr></thead>
                            <tbody>
                                <?php foreach ($youngest as $p) : ?>
                                    <tr><td><?php echo esc_html($p['name']); ?></td><td><strong><?php echo esc_html($p['age']); ?></strong></td><td><?php echo esc_html($p['birthYear']); ?></td></tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <p class="stats-empty"><?php esc_html_e('No age data available.', 'chapaneri-heritage'); ?></p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Births Tab -->
        <div class="stats-tab-content" id="tab-births">
            <div class="stats-charts-grid">
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Births by Month', 'chapaneri-heritage'); ?></h3>
                    <canvas id="chart-birth-months" width="400" height="300"></canvas>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Zodiac Signs', 'chapaneri-heritage'); ?></h3>
                    <canvas id="chart-zodiac" width="400" height="300"></canvas>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Births by Decade', 'chapaneri-heritage'); ?></h3>
                    <canvas id="chart-decades" width="400" height="300"></canvas>
                </div>
            </div>
        </div>

        <!-- Marriages Tab -->
        <div class="stats-tab-content" id="tab-marriages">
            <div class="heritage-card">
                <h3 class="font-display"><?php esc_html_e('Marriage Statistics', 'chapaneri-heritage'); ?></h3>
                <?php
                $spouse_count = 0;
                foreach ($network['typeDistribution'] as $td) {
                    if ($td['type'] === 'spouse') { $spouse_count = intval($td['count'] / 2); break; }
                }
                ?>
                <div class="stats-info-grid">
                    <div class="stats-info-item">
                        <span class="stats-info-value"><?php echo esc_html($spouse_count); ?></span>
                        <span class="stats-info-label"><?php esc_html_e('Married Couples', 'chapaneri-heritage'); ?></span>
                    </div>
                </div>
                <p class="stats-note"><?php esc_html_e('Marriage date tracking is available when marriage dates are recorded in member profiles.', 'chapaneri-heritage'); ?></p>
            </div>
        </div>

        <!-- Children Tab -->
        <div class="stats-tab-content" id="tab-children">
            <div class="stats-charts-grid">
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Family Size Distribution', 'chapaneri-heritage'); ?></h3>
                    <canvas id="chart-family-size" width="400" height="300"></canvas>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Children Summary', 'chapaneri-heritage'); ?></h3>
                    <div class="stats-info-grid">
                        <div class="stats-info-item">
                            <span class="stats-info-value"><?php echo esc_html($children['avgChildrenPerFamily']); ?></span>
                            <span class="stats-info-label"><?php esc_html_e('Avg Children/Family', 'chapaneri-heritage'); ?></span>
                        </div>
                        <div class="stats-info-item">
                            <span class="stats-info-value"><?php echo esc_html($children['childlessMarried']); ?></span>
                            <span class="stats-info-label"><?php esc_html_e('Childless Married', 'chapaneri-heritage'); ?></span>
                        </div>
                    </div>
                    <?php if ($children['familyWithMostChildren']) : ?>
                        <p class="stats-highlight">
                            <strong><?php esc_html_e('Most children:', 'chapaneri-heritage'); ?></strong>
                            <?php echo esc_html($children['familyWithMostChildren']['parents']); ?> — <?php echo esc_html($children['familyWithMostChildren']['count']); ?> <?php esc_html_e('children', 'chapaneri-heritage'); ?>
                        </p>
                    <?php endif; ?>
                </div>
                <div class="heritage-card">
                    <h3 class="font-display"><?php esc_html_e('Most Children', 'chapaneri-heritage'); ?></h3>
                    <?php if (!empty($children['peopleWithMostChildren'])) : ?>
                        <table class="stats-table">
                            <thead><tr><th><?php esc_html_e('Name', 'chapaneri-heritage'); ?></th><th><?php esc_html_e('Children', 'chapaneri-heritage'); ?></th></tr></thead>
                            <tbody>
                                <?php foreach ($children['peopleWithMostChildren'] as $p) : ?>
                                    <tr><td><?php echo esc_html($p['name']); ?></td><td><strong><?php echo esc_html($p['count']); ?></strong></td></tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else : ?>
                        <p class="stats-empty"><?php esc_html_e('No children data available.', 'chapaneri-heritage'); ?></p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Divorces Tab -->
        <div class="stats-tab-content" id="tab-divorces">
            <div class="heritage-card">
                <h3 class="font-display"><?php esc_html_e('Divorce Statistics', 'chapaneri-heritage'); ?></h3>
                <p class="stats-empty"><?php esc_html_e('Divorce data tracking is available when divorce dates and details are recorded in member profiles. No divorce records found.', 'chapaneri-heritage'); ?></p>
            </div>
        </div>
    </div>
</div>

<!-- Chart.js Data -->
<script>
var chapaneriStats = {
    gender: <?php echo wp_json_encode($gender); ?>,
    living: <?php echo wp_json_encode($living); ?>,
    ageGroups: <?php echo wp_json_encode($age_groups); ?>,
    birthMonths: <?php echo wp_json_encode($birth_months); ?>,
    zodiac: <?php echo wp_json_encode($zodiac); ?>,
    decades: <?php echo wp_json_encode($decades); ?>,
    relTypes: <?php echo wp_json_encode($network['typeDistribution']); ?>,
    birthPlaces: <?php echo wp_json_encode(array_slice($places['birthPlaces'], 0, 10)); ?>,
    familySize: <?php echo wp_json_encode($children['familySizeDistribution']); ?>
};
</script>

<?php get_footer(); ?>
