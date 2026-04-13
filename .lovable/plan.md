

# WordPress Theme Sync Plan — v3.0

## Gap Analysis

The React app has evolved significantly beyond the current WordPress theme (v2.0). Here's what's **missing** from the WordPress theme:

| React Feature | WordPress Equivalent | Status |
|---|---|---|
| Statistics Dashboard (8 tabs with charts) | `page-statistics.php` | **Missing** |
| Printable Tree | `page-printable-tree.php` | **Missing** |
| Family Relationships system | Relationship manager UI | **Missing** |
| Member Photos gallery (DB-backed) | Gallery exists but WP-native only | **Partial** |
| Admin Panel (user roles, activity log) | `page-admin.php` | **Missing** |
| Advanced Search with filters | Basic AJAX search only | **Partial** |
| Authentication / Protected routes | WordPress native auth | **Different approach** |
| Sibling auto-detection | N/A in WP | **Missing** |
| Tree search with auto-expand | N/A in WP | **Missing** |
| PDF/Print export for statistics | N/A in WP | **Missing** |
| Member detail with relationship sidebar | `single-family_member.php` | **Partial** |

## Plan

### Step 1: Backup existing theme
- Rename `public/wordpress-theme-export/` to `public/wordpress-theme-export-old/`
- Rename `wordpress-theme-export/` to `wordpress-theme-export-old/`

### Step 2: Create new theme folder `public/wordpress-theme-export/` (v3.0)
Copy all existing files from old, then add/update the following:

**New PHP template files:**
1. **`page-statistics.php`** — Statistics dashboard with 8 tabs (Overview, Relationships, Places, Ages, Births, Marriages, Children, Divorces). Uses Chart.js for pie/bar charts. All stats computed server-side via `WP_Query` on the `family_member` CPT.
2. **`page-printable-tree.php`** — Print-optimized family tree layout with CSS `@media print` rules.
3. **`page-admin.php`** — Admin-only dashboard for managing user roles and viewing activity logs (restricted to `manage_options` capability).

**New include files:**
4. **`inc/class-family-relationships.php`** — Custom DB table `wp_family_relationships` for storing member-to-member relationships with types (father, mother, spouse, sibling, etc.). Includes inverse auto-creation logic matching the React `useRelationships` hook.
5. **`inc/class-statistics-calculator.php`** — Server-side statistics engine: gender distribution, age groups, birth months, zodiac signs, marriage/divorce/children stats. Mirrors `useFamilyStatistics.ts`.
6. **`inc/class-activity-logger.php`** — Logs member CRUD operations with user, timestamp, and changes JSON.

**Updated files:**
7. **`functions.php`** — v3.0: Register new page templates, enqueue Chart.js, add relationships DB table creation on activation, register REST API endpoints for statistics data, add nav menu item for Statistics.
8. **`single-family_member.php`** — Add relationships sidebar showing parents, spouse, children, siblings pulled from the relationships table.
9. **`page-family-tree.php`** — Add search box with JS-based highlight and auto-expand, photo thumbnails on tree nodes.
10. **`page-search.php`** — Enhanced with advanced filter fields (gender, generation, birth place, living/deceased).
11. **`header.php`** — Add "Statistics" nav link.
12. **`style.css`** — v3.0: Add statistics dashboard styles, relationship badges, print tree styles, chart container styles.

**New JS files:**
13. **`assets/js/statistics-charts.js`** — Chart.js initialization for all 8 statistics tabs (pie charts for gender/living, bar charts for ages/births/zodiac).
14. **`assets/js/tree-search.js`** — Tree node search, highlight, and auto-expand logic.

**New SQL connectivity folder:**
15. **`sql/schema.sql`** — Complete database schema including:
    - `wp_family_relationships` table (member_id, related_member_id, relationship_type)
    - `wp_family_activity_logs` table (action_type, entity_type, entity_id, entity_name, performed_by, changes JSON)
    - `wp_member_photos` table (member_id, photo_url, caption, is_primary)
    - Indexes for performance
16. **`sql/seed-relationships.sql`** — Pre-built relationship INSERT statements matching the seeded data from `familyData.ts`.

**Also copy to root-level `wordpress-theme-export/` folder** (mirror of public version).

### Step 3: Update `DownloadTheme.tsx`
- Update THEME_FILES array to include all new files
- Update version label to v3.0
- Include SQL folder in the ZIP download

### Step 4: Update `README.md`
- Document v3.0 features, new page templates, SQL setup instructions, and Chart.js dependency

## Technical Details

- **Chart.js** will be loaded via CDN (`https://cdn.jsdelivr.net/npm/chart.js`) — no npm needed in WP
- Statistics are computed server-side in PHP using `WP_Query` and custom SQL queries on the relationships table
- The relationships table uses WordPress `$wpdb` with proper `$wpdb->prefix` for multisite compatibility
- Table creation uses `dbDelta()` on theme activation hook
- All new templates use `Template Name:` header comments for WordPress page template selection
- Admin page is restricted with `current_user_can('manage_options')` checks

