<?php
/**
 * Template Name: Family Tree
 * Description: Interactive family tree visualization
 *
 * @package Chapaneri_Heritage
 */

get_header();

/**
 * Recursive function to render a family tree node
 */
function chapaneri_render_tree_node($member_id, $level = 0, $show_spouse = true, $show_children = true) {
    $member = get_post($member_id);
    if (!$member) return;

    $gender = get_post_meta($member_id, '_gender', true);
    $birth_date = get_post_meta($member_id, '_birth_date', true);
    $spouse_id = get_post_meta($member_id, '_spouse_id', true);
    $children_ids = get_post_meta($member_id, '_children_ids', true);
    
    $is_expanded = $level < 2 ? 'true' : 'false';
    $children_count = is_array($children_ids) ? count($children_ids) : 0;
    
    $member_class = $gender === 'male' ? 'tree-node--male' : 'tree-node--female';
    ?>
    
    <div class="tree-node" data-member-id="<?php echo esc_attr($member_id); ?>" data-level="<?php echo esc_attr($level); ?>">
        <div class="tree-node__content">
            <!-- Couple Container -->
            <div class="tree-node__couple">
                <!-- Member Card -->
                <a href="<?php echo get_permalink($member_id); ?>" class="tree-node__card <?php echo esc_attr($member_class); ?>">
                    <div class="tree-node__avatar <?php echo esc_attr($member_class); ?>">
                        <?php if (has_post_thumbnail($member_id)) : ?>
                            <?php echo get_the_post_thumbnail($member_id, 'thumbnail'); ?>
                        <?php else : ?>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        <?php endif; ?>
                    </div>
                    <p class="tree-node__name"><?php echo esc_html($member->post_title); ?></p>
                    <?php if ($birth_date) : ?>
                        <p class="tree-node__date">b. <?php echo esc_html(date('Y', strtotime($birth_date))); ?></p>
                    <?php endif; ?>
                </a>

                <?php if ($show_spouse && $spouse_id) : 
                    $spouse = get_post($spouse_id);
                    if ($spouse) :
                        $spouse_gender = get_post_meta($spouse_id, '_gender', true);
                        $spouse_birth = get_post_meta($spouse_id, '_birth_date', true);
                        $spouse_class = $spouse_gender === 'male' ? 'tree-node--male' : 'tree-node--female';
                ?>
                    <!-- Marriage Line -->
                    <div class="tree-node__marriage-line"></div>
                    
                    <!-- Spouse Card -->
                    <a href="<?php echo get_permalink($spouse_id); ?>" class="tree-node__card <?php echo esc_attr($spouse_class); ?>">
                        <div class="tree-node__avatar <?php echo esc_attr($spouse_class); ?>">
                            <?php if (has_post_thumbnail($spouse_id)) : ?>
                                <?php echo get_the_post_thumbnail($spouse_id, 'thumbnail'); ?>
                            <?php else : ?>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            <?php endif; ?>
                        </div>
                        <p class="tree-node__name"><?php echo esc_html($spouse->post_title); ?></p>
                        <?php if ($spouse_birth) : ?>
                            <p class="tree-node__date">b. <?php echo esc_html(date('Y', strtotime($spouse_birth))); ?></p>
                        <?php endif; ?>
                    </a>
                <?php endif; endif; ?>
            </div>

            <?php if ($show_children && $children_count > 0) : ?>
                <!-- Expand/Collapse Button -->
                <button class="tree-node__toggle" data-expanded="<?php echo $is_expanded; ?>" onclick="toggleTreeNode(this)">
                    <svg class="tree-node__toggle-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                    <?php echo esc_html($children_count); ?> <?php echo $children_count === 1 ? 'child' : 'children'; ?>
                </button>

                <!-- Children Container -->
                <div class="tree-node__children" style="display: <?php echo $is_expanded === 'true' ? 'block' : 'none'; ?>;">
                    <!-- Vertical Line -->
                    <div class="tree-node__vertical-line"></div>
                    
                    <?php if ($children_count > 1) : ?>
                        <!-- Horizontal Line -->
                        <div class="tree-node__horizontal-line"></div>
                    <?php endif; ?>

                    <!-- Children Nodes -->
                    <div class="tree-node__children-list">
                        <?php foreach ($children_ids as $child_id) : ?>
                            <div class="tree-node__child">
                                <div class="tree-node__connector"></div>
                                <?php chapaneri_render_tree_node($child_id, $level + 1, true, true); ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

// Get root member (configurable via customizer or first member without parents)
$root_member_id = get_theme_mod('family_tree_root_member', 0);

if (!$root_member_id) {
    // Find members without parents (potential roots)
    $all_members = get_posts(array(
        'post_type' => 'family_member',
        'posts_per_page' => -1,
        'post_status' => 'publish',
    ));
    
    foreach ($all_members as $member) {
        $parent_ids = get_post_meta($member->ID, '_parent_ids', true);
        if (empty($parent_ids)) {
            $root_member_id = $member->ID;
            break;
        }
    }
}

$root_member = $root_member_id ? get_post($root_member_id) : null;
?>

<main id="primary" class="site-main">
    <!-- Page Header -->
    <section class="page-header">
        <div class="container">
            <div class="page-header__content">
                <div class="page-header__badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 13V2l8 4-8 4"/>
                        <path d="M20.55 10.23A9 9 0 1 1 8 4.94"/>
                        <path d="M8 10a5 5 0 1 0 8.9 2.02"/>
                    </svg>
                    <span>Interactive Family Tree</span>
                </div>
                <h1 class="page-header__title">Family Tree</h1>
                <p class="page-header__description">
                    Explore the connections between generations. Click on any member to view their profile.
                </p>
            </div>
        </div>
    </section>

    <!-- Tree Search (v3.0) -->
    <div class="tree-search" style="margin-bottom: var(--spacing-4);">
        <div class="container">
            <div style="display: flex; gap: var(--spacing-3); align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="tree-search-input" class="form-input" placeholder="<?php esc_attr_e('Search family members in the tree...', 'chapaneri-heritage'); ?>" style="max-width: 400px;">
                <span id="tree-search-count" style="display: none; font-size: var(--font-size-sm); color: var(--color-muted-foreground);"></span>
            </div>
        </div>
    </div>

    <!-- Zoom Controls -->
    <div class="tree-controls">
        <div class="container">
            <div class="tree-controls__inner">
                <?php if ($root_member) : ?>
                    <p class="tree-controls__label">
                        Centered on: <span class="tree-controls__name"><?php echo esc_html($root_member->post_title); ?></span>
                    </p>
                <?php endif; ?>
                <div class="tree-controls__buttons">
                    <button class="tree-controls__btn" onclick="zoomTree(-0.1)" title="Zoom Out">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" x2="16.65" y1="21" y2="16.65"/>
                            <line x1="8" x2="14" y1="11" y2="11"/>
                        </svg>
                    </button>
                    <span class="tree-controls__zoom-level" id="zoomLevel">100%</span>
                    <button class="tree-controls__btn" onclick="zoomTree(0.1)" title="Zoom In">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" x2="16.65" y1="21" y2="16.65"/>
                            <line x1="11" x2="11" y1="8" y2="14"/>
                            <line x1="8" x2="14" y1="11" y2="11"/>
                        </svg>
                    </button>
                    <button class="tree-controls__btn" onclick="resetZoom()" title="Reset">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 3 21 3 21 9"/>
                            <polyline points="9 21 3 21 3 15"/>
                            <line x1="21" x2="14" y1="3" y2="10"/>
                            <line x1="3" x2="10" y1="21" y2="14"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Tree View -->
    <section class="family-tree-section">
        <div class="family-tree-container" id="familyTreeContainer">
            <?php if ($root_member) : ?>
                <?php chapaneri_render_tree_node($root_member_id, 0, true, true); ?>
            <?php else : ?>
                <div class="family-tree-empty">
                    <p>No family members found. Add family members to build your tree.</p>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Legend -->
    <section class="tree-legend">
        <div class="container">
            <h3 class="tree-legend__title">Legend</h3>
            <div class="tree-legend__items">
                <div class="tree-legend__item">
                    <div class="tree-legend__symbol tree-legend__symbol--male"></div>
                    <span>Male</span>
                </div>
                <div class="tree-legend__item">
                    <div class="tree-legend__symbol tree-legend__symbol--female"></div>
                    <span>Female</span>
                </div>
                <div class="tree-legend__item">
                    <div class="tree-legend__symbol tree-legend__symbol--marriage"></div>
                    <span>Marriage</span>
                </div>
                <div class="tree-legend__item">
                    <div class="tree-legend__symbol tree-legend__symbol--parent-child"></div>
                    <span>Parent-Child</span>
                </div>
            </div>
        </div>
    </section>
</main>

<script>
let currentZoom = 1;
const minZoom = 0.5;
const maxZoom = 1.5;

function toggleTreeNode(button) {
    const isExpanded = button.getAttribute('data-expanded') === 'true';
    const node = button.closest('.tree-node');
    const childrenContainer = node.querySelector('.tree-node__children');
    const icon = button.querySelector('.tree-node__toggle-icon');
    
    if (isExpanded) {
        childrenContainer.style.display = 'none';
        button.setAttribute('data-expanded', 'false');
        icon.style.transform = 'rotate(0deg)';
    } else {
        childrenContainer.style.display = 'block';
        button.setAttribute('data-expanded', 'true');
        icon.style.transform = 'rotate(90deg)';
    }
}

function zoomTree(delta) {
    currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
    updateZoom();
}

function resetZoom() {
    currentZoom = 1;
    updateZoom();
}

function updateZoom() {
    const container = document.getElementById('familyTreeContainer');
    container.style.transform = `scale(${currentZoom})`;
    document.getElementById('zoomLevel').textContent = Math.round(currentZoom * 100) + '%';
}

// Initialize expanded state icons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tree-node__toggle').forEach(function(button) {
        const isExpanded = button.getAttribute('data-expanded') === 'true';
        const icon = button.querySelector('.tree-node__toggle-icon');
        if (isExpanded) {
            icon.style.transform = 'rotate(90deg)';
        }
    });
});
</script>

<?php get_footer(); ?>
