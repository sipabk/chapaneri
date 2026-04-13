<?php
/**
 * Template Name: Printable Family Tree
 * Description: Print-optimized family tree layout
 *
 * @package Chapaneri_Heritage
 * @since 3.0.0
 */

get_header();

$root_member_id = get_theme_mod('family_tree_root_member', 0);

if (!$root_member_id) {
    $all_members = get_posts(array(
        'post_type'      => 'family_member',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
    ));
    foreach ($all_members as $member) {
        $parent_ids = get_post_meta($member->ID, '_parent_ids', true);
        if (empty($parent_ids)) {
            $root_member_id = $member->ID;
            break;
        }
    }
}

/**
 * Render printable tree node
 */
function chapaneri_render_print_node($member_id, $level = 0) {
    $member = get_post($member_id);
    if (!$member) return;

    $gender = get_post_meta($member_id, '_gender', true);
    $birth_date = get_post_meta($member_id, '_birth_date', true);
    $death_date = get_post_meta($member_id, '_death_date', true);
    $spouse_id = get_post_meta($member_id, '_spouse_id', true);
    $children_ids = get_post_meta($member_id, '_children_ids', true);
    
    $gender_class = $gender === 'female' ? 'print-node--female' : 'print-node--male';
    $life_years = '';
    if ($birth_date) {
        $life_years = date('Y', strtotime($birth_date));
        if ($death_date) {
            $life_years .= ' – ' . date('Y', strtotime($death_date));
        }
    }
    ?>
    <div class="print-node <?php echo esc_attr($gender_class); ?>">
        <div class="print-node__card">
            <strong class="print-node__name"><?php echo esc_html($member->post_title); ?></strong>
            <?php if ($life_years) : ?>
                <span class="print-node__years"><?php echo esc_html($life_years); ?></span>
            <?php endif; ?>
        </div>

        <?php if ($spouse_id) :
            $spouse = get_post($spouse_id);
            if ($spouse) :
                $s_birth = get_post_meta($spouse_id, '_birth_date', true);
                $s_death = get_post_meta($spouse_id, '_death_date', true);
                $s_years = '';
                if ($s_birth) {
                    $s_years = date('Y', strtotime($s_birth));
                    if ($s_death) $s_years .= ' – ' . date('Y', strtotime($s_death));
                }
                $s_gender = get_post_meta($spouse_id, '_gender', true);
                $s_class = $s_gender === 'female' ? 'print-node--female' : 'print-node--male';
        ?>
            <span class="print-node__marriage">∞</span>
            <div class="print-node__card <?php echo esc_attr($s_class); ?>">
                <strong class="print-node__name"><?php echo esc_html($spouse->post_title); ?></strong>
                <?php if ($s_years) : ?>
                    <span class="print-node__years"><?php echo esc_html($s_years); ?></span>
                <?php endif; ?>
            </div>
        <?php endif; endif; ?>

        <?php if (!empty($children_ids) && is_array($children_ids)) : ?>
            <div class="print-node__children">
                <?php foreach ($children_ids as $child_id) : ?>
                    <?php chapaneri_render_print_node($child_id, $level + 1); ?>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    <?php
}
?>

<div class="container section printable-tree-page">
    <header class="print-header">
        <h1 class="font-display"><?php esc_html_e('Family Tree', 'chapaneri-heritage'); ?></h1>
        <p><?php echo esc_html(get_bloginfo('name')); ?> — <?php echo esc_html(date('F Y')); ?></p>
        <button type="button" onclick="window.print()" class="btn btn-primary no-print">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <?php esc_html_e('Print Tree', 'chapaneri-heritage'); ?>
        </button>
    </header>

    <div class="print-tree-container">
        <?php if ($root_member_id) : ?>
            <?php chapaneri_render_print_node($root_member_id); ?>
        <?php else : ?>
            <p><?php esc_html_e('No family members found.', 'chapaneri-heritage'); ?></p>
        <?php endif; ?>
    </div>
</div>

<?php get_footer(); ?>
