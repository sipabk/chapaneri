# Chapaneri Family Heritage — WordPress Theme v3.0

A heritage-inspired WordPress theme for family genealogy, built to mirror the React application at [chapaneri.lovable.app](https://chapaneri.lovable.app).

## What's New in v3.0

- **Statistics Dashboard** (`page-statistics.php`) — 8-tab analytics with Chart.js: Overview, Relationships, Places, Ages, Births, Marriages, Children, Divorces
- **Family Relationships DB** (`inc/class-family-relationships.php`) — Custom `wp_family_relationships` table with bi-directional auto-inverse and sibling auto-detection
- **Activity Logger** (`inc/class-activity-logger.php`) — Tracks all member CRUD operations with user, timestamp, and changes
- **Statistics Calculator** (`inc/class-statistics-calculator.php`) — Server-side statistics engine (gender, age groups, zodiac, decades, etc.)
- **Printable Tree** (`page-printable-tree.php`) — Print-optimized family tree layout with CSS `@media print` rules
- **Admin Dashboard** (`page-admin.php`) — Admin-only dashboard for activity logs, stats overview, and quick actions
- **Tree Search** (`assets/js/tree-search.js`) — Search, highlight, and auto-expand tree nodes
- **Advanced Search** — Living/deceased filter added to search page
- **REST API Endpoints** — `/wp-json/chapaneri/v1/statistics`, `/wp-json/chapaneri/v1/relationships`
- **SQL Schema** (`sql/schema.sql`) — Full database schema for relationships, activity logs, and member photos

## Requirements

- WordPress 5.9+
- PHP 7.4+
- No additional plugins required

## Installation

1. Upload the theme folder to `wp-content/themes/chapaneri-heritage/`
2. Activate through **WordPress Admin → Appearance → Themes**
3. The theme will automatically create custom database tables on first load
4. Optionally, run `sql/schema.sql` manually for pre-provisioning

## Page Templates

Create WordPress pages and assign these templates:

| Template | Purpose |
|---|---|
| Family Tree | Interactive recursive tree with zoom and search |
| Timeline | Chronological events grouped by decade |
| Family Search | Advanced search with filters |
| Family Statistics | 8-tab analytics dashboard with charts |
| Printable Family Tree | Print-optimized tree layout |
| Admin Dashboard | Admin-only management panel |
| Places | Geographic directory |

## Chart.js

The statistics page loads Chart.js v4 via CDN (`https://cdn.jsdelivr.net/npm/chart.js@4`). No npm/build step required.

## REST API

- `GET /wp-json/chapaneri/v1/statistics` — All statistics data
- `GET /wp-json/chapaneri/v1/relationships` — All relationships
- `GET /wp-json/chapaneri/v1/relationships/{member_id}` — Member relationships
- `GET /wp-json/chapaneri/v1/activity-logs` — Activity logs (admin only)

## Theme Customizer

Configure via **Appearance → Customize**:
- Hero Section settings
- Family Tree settings (root member, expand level, zoom)
- Timeline settings
- Places settings
- Statistics display settings

## Color Themes

Six built-in color schemes: Heritage, Ocean, Forest, Royal, Sunset, Midnight.

## File Structure

```
chapaneri-heritage/
├── style.css                          # Theme styles (v3.0)
├── functions.php                      # Theme functions (v3.0)
├── header.php / footer.php            # Layout templates
├── front-page.php / index.php         # Homepage
├── single-family_member.php           # Member detail (+ relationships sidebar)
├── archive-family_member.php          # Members archive
├── page-family-tree.php               # Interactive tree (+ search)
├── page-timeline.php                  # Timeline
├── page-places.php                    # Places directory
├── page-search.php                    # Advanced search (+ living/deceased filter)
├── page-statistics.php                # Statistics dashboard (NEW)
├── page-printable-tree.php            # Printable tree (NEW)
├── page-admin.php                     # Admin dashboard (NEW)
├── template-parts/
│   └── member-gallery.php
├── inc/
│   ├── class-family-relationships.php # Relationships DB (NEW)
│   ├── class-statistics-calculator.php# Stats engine (NEW)
│   ├── class-activity-logger.php      # Activity logging (NEW)
│   ├── class-widget-family-stats.php
│   ├── class-widget-featured-members.php
│   ├── class-widget-related-members.php
│   ├── class-import-export.php
│   ├── class-admin-dashboard-widget.php
│   ├── shortcodes.php
│   └── blocks/family-member-block.php
├── assets/
│   ├── js/
│   │   ├── navigation.js
│   │   ├── theme-switcher.js
│   │   ├── ajax-search.js
│   │   ├── blocks.js
│   │   ├── statistics-charts.js       # Chart.js init (NEW)
│   │   └── tree-search.js             # Tree search (NEW)
│   └── css/
│       ├── admin-import-export.css
│       └── blocks-editor.css
├── sql/
│   ├── schema.sql                     # Database schema (NEW)
│   └── seed-relationships.sql         # Seed data (NEW)
└── README.md
```

## License

GNU General Public License v2 or later.
