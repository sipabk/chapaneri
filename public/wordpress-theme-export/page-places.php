<?php
/**
 * Template Name: Family Places
 * Description: Geographic grouping of family members by birthplace
 *
 * @package Chapaneri_Heritage
 */

get_header();

// Gather all members and group by location
$places = array();

$members = get_posts(array(
    'post_type' => 'family_member',
    'posts_per_page' => -1,
    'post_status' => 'publish',
));

foreach ($members as $member) {
    $birth_place = get_post_meta($member->ID, '_birth_place', true);
    $gender = get_post_meta($member->ID, '_gender', true);
    $birth_date = get_post_meta($member->ID, '_birth_date', true);
    
    $location = $birth_place ? trim($birth_place) : 'Unknown Location';
    
    if (!isset($places[$location])) {
        $places[$location] = array(
            'name' => $location,
            'members' => array(),
            'count' => 0,
        );
    }
    
    $places[$location]['members'][] = array(
        'id' => $member->ID,
        'name' => $member->post_title,
        'gender' => $gender,
        'birth_date' => $birth_date,
        'has_thumbnail' => has_post_thumbnail($member->ID),
    );
    $places[$location]['count']++;
}

// Sort places by member count (descending)
uasort($places, function($a, $b) {
    return $b['count'] - $a['count'];
});

// Move "Unknown Location" to the end if it exists
if (isset($places['Unknown Location'])) {
    $unknown = $places['Unknown Location'];
    unset($places['Unknown Location']);
    $places['Unknown Location'] = $unknown;
}

$total_places = count($places);
$total_members = count($members);
?>

<main id="primary" class="site-main">
    <!-- Page Header -->
    <section class="page-header">
        <div class="container">
            <div class="page-header__content">
                <div class="page-header__badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>Geographic Heritage</span>
                </div>
                <h1 class="page-header__title">Places & Origins</h1>
                <p class="page-header__description">
                    Discover the geographic roots of our family across different locations.
                </p>
            </div>
        </div>
    </section>

    <!-- Places Stats -->
    <section class="places-stats">
        <div class="container">
            <div class="places-stats__grid">
                <div class="places-stats__item">
                    <div class="places-stats__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                    </div>
                    <span class="places-stats__count"><?php echo esc_html($total_places); ?></span>
                    <span class="places-stats__label">Locations</span>
                </div>
                <div class="places-stats__item">
                    <div class="places-stats__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <span class="places-stats__count"><?php echo esc_html($total_members); ?></span>
                    <span class="places-stats__label">Family Members</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Places Grid -->
    <section class="places-content">
        <div class="container">
            <?php if (!empty($places)) : ?>
                <div class="places-grid">
                    <?php foreach ($places as $location => $place) : ?>
                        <div class="place-card" id="place-<?php echo esc_attr(sanitize_title($location)); ?>">
                            <div class="place-card__header">
                                <div class="place-card__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </div>
                                <div class="place-card__info">
                                    <h2 class="place-card__name"><?php echo esc_html($location); ?></h2>
                                    <p class="place-card__count">
                                        <?php echo esc_html($place['count']); ?> 
                                        <?php echo $place['count'] === 1 ? 'member' : 'members'; ?>
                                    </p>
                                </div>
                            </div>
                            
                            <div class="place-card__members">
                                <?php foreach ($place['members'] as $member) : 
                                    $avatar_class = $member['gender'] === 'male' ? 'place-member--male' : 'place-member--female';
                                ?>
                                    <a href="<?php echo get_permalink($member['id']); ?>" class="place-member">
                                        <div class="place-member__avatar <?php echo esc_attr($avatar_class); ?>">
                                            <?php if ($member['has_thumbnail']) : ?>
                                                <?php echo get_the_post_thumbnail($member['id'], 'thumbnail'); ?>
                                            <?php else : ?>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="12" cy="7" r="4"/>
                                                </svg>
                                            <?php endif; ?>
                                        </div>
                                        <div class="place-member__info">
                                            <span class="place-member__name"><?php echo esc_html($member['name']); ?></span>
                                            <?php if ($member['birth_date']) : ?>
                                                <span class="place-member__date">b. <?php echo esc_html(date('Y', strtotime($member['birth_date']))); ?></span>
                                            <?php endif; ?>
                                        </div>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else : ?>
                <div class="places-empty">
                    <p>No locations found. Add birthplace information to family members to populate this page.</p>
                </div>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>
