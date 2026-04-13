<?php
/**
 * Template Name: Family Timeline
 * Description: Chronological display of family events (births, deaths, marriages)
 *
 * @package Chapaneri_Heritage
 */

get_header();

// Gather all events from family members
$events = array();

$members = get_posts(array(
    'post_type' => 'family_member',
    'posts_per_page' => -1,
    'post_status' => 'publish',
));

foreach ($members as $member) {
    $birth_date = get_post_meta($member->ID, '_birth_date', true);
    $death_date = get_post_meta($member->ID, '_death_date', true);
    $spouse_id = get_post_meta($member->ID, '_spouse_id', true);
    $gender = get_post_meta($member->ID, '_gender', true);
    $birth_place = get_post_meta($member->ID, '_birth_place', true);
    
    // Birth event
    if ($birth_date) {
        $events[] = array(
            'date' => $birth_date,
            'timestamp' => strtotime($birth_date),
            'type' => 'birth',
            'member_id' => $member->ID,
            'member_name' => $member->post_title,
            'gender' => $gender,
            'location' => $birth_place,
            'description' => sprintf('%s was born%s', $member->post_title, $birth_place ? ' in ' . $birth_place : ''),
        );
    }
    
    // Death event
    if ($death_date) {
        $events[] = array(
            'date' => $death_date,
            'timestamp' => strtotime($death_date),
            'type' => 'death',
            'member_id' => $member->ID,
            'member_name' => $member->post_title,
            'gender' => $gender,
            'location' => '',
            'description' => sprintf('%s passed away', $member->post_title),
        );
    }
    
    // Marriage event (only add once per couple)
    if ($spouse_id && $member->ID < $spouse_id) {
        $spouse = get_post($spouse_id);
        if ($spouse) {
            // Use a default marriage date or estimate from children
            $marriage_year = '';
            $children_ids = get_post_meta($member->ID, '_children_ids', true);
            if (!empty($children_ids) && is_array($children_ids)) {
                $first_child = get_post($children_ids[0]);
                if ($first_child) {
                    $child_birth = get_post_meta($first_child->ID, '_birth_date', true);
                    if ($child_birth) {
                        $marriage_year = date('Y', strtotime($child_birth)) - 1;
                    }
                }
            }
            
            if ($marriage_year || $birth_date) {
                $marriage_date = $marriage_year ? $marriage_year . '-01-01' : date('Y', strtotime($birth_date) + (20 * 365 * 24 * 60 * 60)) . '-01-01';
                $events[] = array(
                    'date' => $marriage_date,
                    'timestamp' => strtotime($marriage_date),
                    'type' => 'marriage',
                    'member_id' => $member->ID,
                    'member_name' => $member->post_title,
                    'spouse_id' => $spouse_id,
                    'spouse_name' => $spouse->post_title,
                    'gender' => $gender,
                    'location' => '',
                    'description' => sprintf('%s and %s were married', $member->post_title, $spouse->post_title),
                );
            }
        }
    }
}

// Sort events by date
usort($events, function($a, $b) {
    return $a['timestamp'] - $b['timestamp'];
});

// Group events by decade
$events_by_decade = array();
foreach ($events as $event) {
    $year = date('Y', $event['timestamp']);
    $decade = floor($year / 10) * 10;
    $decade_label = $decade . 's';
    
    if (!isset($events_by_decade[$decade_label])) {
        $events_by_decade[$decade_label] = array();
    }
    $events_by_decade[$decade_label][] = $event;
}

// Get statistics
$birth_count = count(array_filter($events, function($e) { return $e['type'] === 'birth'; }));
$death_count = count(array_filter($events, function($e) { return $e['type'] === 'death'; }));
$marriage_count = count(array_filter($events, function($e) { return $e['type'] === 'marriage'; }));
?>

<main id="primary" class="site-main">
    <!-- Page Header -->
    <section class="page-header">
        <div class="container">
            <div class="page-header__content">
                <div class="page-header__badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Chronological Events</span>
                </div>
                <h1 class="page-header__title">Family Timeline</h1>
                <p class="page-header__description">
                    Journey through the significant moments that shaped our family history.
                </p>
            </div>
        </div>
    </section>

    <!-- Timeline Stats -->
    <section class="timeline-stats">
        <div class="container">
            <div class="timeline-stats__grid">
                <div class="timeline-stats__item timeline-stats__item--birth">
                    <div class="timeline-stats__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                        </svg>
                    </div>
                    <span class="timeline-stats__count"><?php echo esc_html($birth_count); ?></span>
                    <span class="timeline-stats__label">Births</span>
                </div>
                <div class="timeline-stats__item timeline-stats__item--marriage">
                    <div class="timeline-stats__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                    </div>
                    <span class="timeline-stats__count"><?php echo esc_html($marriage_count); ?></span>
                    <span class="timeline-stats__label">Marriages</span>
                </div>
                <div class="timeline-stats__item timeline-stats__item--death">
                    <div class="timeline-stats__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2v8"/>
                            <path d="m4.93 10.93 1.41 1.41"/>
                            <path d="M2 18h2"/>
                            <path d="M20 18h2"/>
                            <path d="m19.07 10.93-1.41 1.41"/>
                            <path d="M22 22H2"/>
                            <path d="m8 6 4-4 4 4"/>
                            <path d="M16 18a4 4 0 0 0-8 0"/>
                        </svg>
                    </div>
                    <span class="timeline-stats__count"><?php echo esc_html($death_count); ?></span>
                    <span class="timeline-stats__label">Passings</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Timeline Content -->
    <section class="timeline-content">
        <div class="container">
            <?php if (!empty($events_by_decade)) : ?>
                <div class="timeline">
                    <?php foreach ($events_by_decade as $decade => $decade_events) : ?>
                        <!-- Decade Marker -->
                        <div class="timeline__decade">
                            <span class="timeline__decade-label"><?php echo esc_html($decade); ?></span>
                        </div>
                        
                        <?php foreach ($decade_events as $index => $event) : 
                            $is_left = $index % 2 === 0;
                            $event_class = 'timeline__event--' . $event['type'];
                        ?>
                            <div class="timeline__event <?php echo esc_attr($event_class); ?> <?php echo $is_left ? 'timeline__event--left' : 'timeline__event--right'; ?>">
                                <div class="timeline__event-content">
                                    <div class="timeline__event-header">
                                        <span class="timeline__event-type timeline__event-type--<?php echo esc_attr($event['type']); ?>">
                                            <?php if ($event['type'] === 'birth') : ?>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                                                </svg>
                                                Birth
                                            <?php elseif ($event['type'] === 'marriage') : ?>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                                </svg>
                                                Marriage
                                            <?php else : ?>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M12 2v8"/>
                                                    <path d="m4.93 10.93 1.41 1.41"/>
                                                    <path d="M2 18h2"/>
                                                    <path d="M20 18h2"/>
                                                    <path d="m19.07 10.93-1.41 1.41"/>
                                                    <path d="M22 22H2"/>
                                                    <path d="m8 6 4-4 4 4"/>
                                                    <path d="M16 18a4 4 0 0 0-8 0"/>
                                                </svg>
                                                Passing
                                            <?php endif; ?>
                                        </span>
                                        <span class="timeline__event-date"><?php echo esc_html(date('F j, Y', $event['timestamp'])); ?></span>
                                    </div>
                                    
                                    <h3 class="timeline__event-title">
                                        <?php echo esc_html($event['description']); ?>
                                    </h3>
                                    
                                    <?php if (!empty($event['location'])) : ?>
                                        <p class="timeline__event-location">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                                <circle cx="12" cy="10" r="3"/>
                                            </svg>
                                            <?php echo esc_html($event['location']); ?>
                                        </p>
                                    <?php endif; ?>
                                    
                                    <div class="timeline__event-links">
                                        <a href="<?php echo get_permalink($event['member_id']); ?>" class="timeline__event-link">
                                            View <?php echo esc_html($event['member_name']); ?>
                                        </a>
                                        <?php if ($event['type'] === 'marriage' && !empty($event['spouse_id'])) : ?>
                                            <a href="<?php echo get_permalink($event['spouse_id']); ?>" class="timeline__event-link">
                                                View <?php echo esc_html($event['spouse_name']); ?>
                                            </a>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                
                                <!-- Timeline Dot -->
                                <div class="timeline__dot timeline__dot--<?php echo esc_attr($event['type']); ?>"></div>
                            </div>
                        <?php endforeach; ?>
                    <?php endforeach; ?>
                </div>
            <?php else : ?>
                <div class="timeline-empty">
                    <p>No timeline events found. Add family members with birth and death dates to populate the timeline.</p>
                </div>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>
