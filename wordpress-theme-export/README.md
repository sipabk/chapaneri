# Chapaneri Family Heritage - WordPress Theme

A heritage-inspired WordPress theme for family genealogy and archive websites. Features a warm burgundy and gold color palette with elegant typography.

## Features

- **Custom Post Type: Family Member** - Full-featured family member management with relationships
- **Taxonomies**: Generation and Relationship classification
- **Custom Meta Fields**: Birth/death dates, locations, contact info, family connections
- **Customizer Settings**: Hero section content, background images, statistics display
- **Dark Mode**: Built-in dark mode toggle with localStorage persistence
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: WCAG-compliant with proper ARIA labels and keyboard navigation

## Installation

1. Download or clone this folder
2. Upload to `wp-content/themes/chapaneri-heritage/`
3. Activate through WordPress Admin → Appearance → Themes
4. Configure in Customizer (Appearance → Customize)

## Theme Structure

```
chapaneri-heritage/
├── style.css                    # Main stylesheet with CSS variables
├── functions.php                # Theme functions, CPTs, taxonomies, Customizer
├── header.php                   # Header template
├── footer.php                   # Footer template
├── index.php                    # Default template
├── front-page.php              # Homepage template
├── page-family-tree.php        # Family tree page template
├── page-timeline.php           # Timeline page template
├── page-places.php             # Places/locations page template
├── page-search.php             # Advanced search page template
├── single-family_member.php    # Single family member template
├── archive-family_member.php   # Family members archive template
├── inc/
│   ├── class-widget-family-stats.php    # Family statistics widget
│   └── class-widget-featured-members.php # Featured members widget
├── assets/
│   └── js/
│       ├── navigation.js       # Mobile menu & navigation
│       ├── dark-mode.js        # Dark mode toggle
│       └── ajax-search.js      # AJAX-powered instant search
└── README.md                   # This file
```

## Page Templates

| Template | Description | Usage |
|----------|-------------|-------|
| Family Tree | Interactive expandable tree visualization | Create page → Select "Family Tree" template |
| Family Timeline | Chronological birth/death/marriage events | Create page → Select "Family Timeline" template |
| Family Places | Geographic grouping by birthplace | Create page → Select "Family Places" template |
| Family Search | Advanced search with filters and AJAX lookup | Create page → Select "Family Search" template |

## Design System

### Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-primary` | Burgundy `hsl(350, 45%, 35%)` | Gold `hsl(42, 75%, 55%)` | Primary actions, links |
| `--color-secondary` | Cream `hsl(38, 35%, 92%)` | Dark `hsl(25, 20%, 18%)` | Secondary elements |
| `--color-accent` | Gold `hsl(42, 85%, 55%)` | Burgundy `hsl(350, 40%, 45%)` | Highlights, CTAs |
| `--color-success` | Green `hsl(145, 35%, 38%)` | Same | Birth events, positive states |
| `--color-background` | Warm white `hsl(40, 20%, 98%)` | Dark `hsl(25, 25%, 8%)` | Page background |
| `--color-foreground` | Dark brown `hsl(25, 30%, 12%)` | Light `hsl(40, 15%, 92%)` | Text |

### Typography

- **Display Font**: Cormorant Garamond (headings, titles)
- **Body Font**: Inter (paragraphs, UI elements)

### Spacing Scale

Uses CSS custom properties from 0.25rem to 8rem in consistent increments.

## Custom Post Type: Family Member

### Meta Fields

| Field | Type | Description |
|-------|------|-------------|
| `_gender` | select | Male/Female |
| `_birth_date` | date | Birth date |
| `_death_date` | date | Death date (if applicable) |
| `_birth_place` | text | Place of birth |
| `_email` | email | Contact email |
| `_phone` | tel | Contact phone |
| `_address` | textarea | Current/last known address |
| `_spouse_id` | post ID | Connected spouse |
| `_parent_ids` | array | Parent connections |
| `_children_ids` | array | Children connections |

### Helper Functions

```php
// Get single member
$member = chapaneri_get_family_member($post_id);

// Get all members
$members = chapaneri_get_all_family_members();

// Get by generation
$gen3 = chapaneri_get_members_by_generation('third-generation');

// Get family connections
$spouse = chapaneri_get_spouse($member_id);
$parents = chapaneri_get_parents($member_id);
$children = chapaneri_get_children($member_id);

// Get statistics
$stats = chapaneri_get_family_stats();
```

## Customizer Options

Navigate to Appearance → Customize:

### Hero Section
- Hero Title
- Hero Subtitle
- Hero Description
- Background Image

### Family Statistics
- Toggle statistics display on homepage

### Family Tree Settings
- **Root Family Member** - Select which member appears at the top of the tree
- **Default Expansion Level** - How many generations to expand by default (1-5)
- **Show Spouses** - Display spouse cards next to family members
- **Show Birth Years** - Display birth years on tree node cards
- **Enable Zoom Controls** - Show zoom in/out controls on the tree page

### Timeline Settings
- **Show Birth Events** - Include births in the timeline
- **Show Passing Events** - Include deaths in the timeline
- **Show Marriage Events** - Include marriages in the timeline
- **Group Events By** - Decade, Year, or No Grouping

### Places Settings
- **Sort Locations By** - Member Count or Location Name
- **Show Unknown Locations** - Display members without recorded birthplace

## Widgets

The theme includes two custom widgets for displaying family information in sidebars and widget areas:

### Family Statistics Widget
Displays key family statistics with customizable options:
- Total Members count
- Generations count
- Locations count
- Living Members count
- Layout options: Vertical, Horizontal, or Grid

### Featured Family Members Widget
Displays family members based on various criteria:
- **Display Modes**: Random, Recently Added, Featured Only, Newest by Birth, Oldest by Birth
- **Number of members**: 1-10
- **Layout options**: List, Grid, or Compact
- **Show/hide birth year and location**

To add widgets: Go to Appearance → Widgets and drag the widgets to your preferred sidebar.

## AJAX Instant Search

The theme includes an AJAX-powered search feature for instant member lookup:

### Features
- Real-time search results as you type
- Keyboard navigation (arrow keys, Enter, Escape)
- Highlighted matching text
- Member photos, birth year, and location in results
- Debounced requests for performance
- Accessible with proper ARIA attributes

### Usage
The AJAX search is automatically available on the Search page template. To add it to other templates, use:

```php
<div class="ajax-search-container" data-ajax-search data-min-chars="2">
    <div class="ajax-search__input-wrapper">
        <input type="text" data-ajax-search-input class="ajax-search__input" placeholder="Search...">
        <div class="ajax-search__loader" data-ajax-search-loader><!-- loader --></div>
    </div>
    <div class="ajax-search__results" data-ajax-search-results></div>
</div>
```

## Required Plugins (Recommended)

- **Advanced Custom Fields** - For additional custom fields
- **Yoast SEO** - For SEO optimization
- **WP Smush** - For image optimization

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

GNU General Public License v2 or later

## Credits

- Fonts: Google Fonts (Cormorant Garamond, Inter)
- Icons: Inline SVGs based on Lucide icons
- Design: Based on Chapaneri Family Heritage React application
