# Chapaneri Family Heritage - WordPress Theme v2.0

A heritage-inspired WordPress theme for family genealogy and archive websites. Version 2.0 features **6 switchable color themes** (Heritage, Ocean, Forest, Royal, Sunset, Midnight), advanced search, photo galleries, import/export, and Gutenberg blocks.

## Features

- **6 Color Themes**: Heritage (burgundy/gold), Ocean (blue/cyan), Forest (green), Royal (purple), Sunset (orange), Midnight (dark blue) — switchable from the header
- **Custom Post Type: Family Member** - Full-featured family member management with relationships
- **Taxonomies**: Generation and Relationship classification
- **Custom Meta Fields**: Birth/death dates, locations, contact info, family connections
- **Customizer Settings**: Hero section content, background images, statistics display
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
├── template-parts/
│   └── member-gallery.php      # Photo gallery template part
├── inc/
│   ├── class-widget-family-stats.php    # Family statistics widget
│   ├── class-widget-featured-members.php # Featured members widget
│   ├── class-widget-related-members.php  # Related members widget
│   ├── class-import-export.php           # Import/export functionality
│   ├── class-admin-dashboard-widget.php  # Admin dashboard widget
│   ├── shortcodes.php                    # Theme shortcodes
│   └── blocks/
│       └── family-member-block.php       # Gutenberg blocks
├── assets/
│   ├── css/
│   │   ├── admin-import-export.css       # Import/export admin styles
│   │   └── blocks-editor.css             # Gutenberg block editor styles
│   └── js/
│       ├── navigation.js         # Mobile menu & navigation
│       ├── theme-switcher.js     # Multi-theme color switcher (6 themes)
│       ├── ajax-search.js        # AJAX-powered instant search
│       └── blocks.js             # Gutenberg blocks JavaScript
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
| `_member_gallery` | array | Photo gallery image IDs |

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

The theme includes custom widgets for displaying family information in sidebars and widget areas:

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

### Related Family Members Widget
Displays family connections for the current member on single member pages:
- Parents
- Siblings
- Spouse
- Children
- Only visible on single family member pages

To add widgets: Go to Appearance → Widgets and drag the widgets to your preferred sidebar.

## Admin Dashboard Widget

The theme adds a "Family Heritage Overview" widget to the WordPress admin dashboard featuring:
- Quick statistics grid (total members, generations, locations, living members)
- List of 5 most recently added family members with thumbnails
- Quick links to add new members or view all members

The dashboard widget appears automatically after theme activation.

## Shortcodes

Embed family search and statistics anywhere in posts and pages using shortcodes:

### [family_search]
Embeds the AJAX-powered family member search box.

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `placeholder` | "Search family members..." | Input placeholder text |
| `min_chars` | 2 | Minimum characters before search triggers |
| `show_filters` | false | Show generation/gender/location dropdowns |

**Examples:**
```
[family_search]
[family_search placeholder="Find a relative..." min_chars="3"]
[family_search show_filters="true"]
```

### [family_stats]
Displays family statistics.

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `layout` | horizontal | Display layout: horizontal, vertical, or grid |
| `show_total` | true | Show total members count |
| `show_generations` | true | Show generations count |
| `show_locations` | true | Show locations count |
| `show_living` | true | Show living members count |

**Examples:**
```
[family_stats]
[family_stats layout="grid"]
[family_stats layout="vertical" show_living="false"]
```

### [family_member]
Displays a single family member card.

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `id` | (required) | The family member post ID |
| `show_photo` | true | Show member photo |
| `show_dates` | true | Show birth/death dates |
| `show_location` | true | Show birthplace |

**Examples:**
```
[family_member id="123"]
[family_member id="123" show_dates="false"]
```

### [family_members_list]
Displays a list of family members.

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `count` | 6 | Number of members to display |
| `generation` | (all) | Filter by generation slug |
| `gender` | (all) | Filter by gender: male/female |
| `orderby` | name | Order by: name, date, rand |
| `order` | ASC | Order direction: ASC, DESC |
| `layout` | grid | Display layout: grid, list |
| `columns` | 3 | Number of columns for grid layout (1-6) |

**Examples:**
```
[family_members_list]
[family_members_list count="12" generation="first-generation"]
[family_members_list orderby="rand" count="4" layout="list"]
[family_members_list columns="4" gender="female"]
```

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
The AJAX search is automatically available on the Search page template. Use the `[family_search]` shortcode to add it anywhere, or manually add the HTML:

```php
<div class="ajax-search-container" data-ajax-search data-min-chars="2">
    <div class="ajax-search__input-wrapper">
        <input type="text" data-ajax-search-input class="ajax-search__input" placeholder="Search...">
        <div class="ajax-search__loader" data-ajax-search-loader><!-- loader --></div>
    </div>
    <div class="ajax-search__results" data-ajax-search-results></div>
</div>
```

## Import/Export

The theme includes a powerful import/export system for backing up and migrating family member data.

### Accessing Import/Export

Navigate to **Family Members → Import/Export** in the WordPress admin menu.

### Export Options

| Format | Description |
|--------|-------------|
| **JSON** | Complete data including relationships, taxonomies, and all meta fields. Best for full backups and site migrations. |
| **CSV** | Spreadsheet-compatible format with basic member data. Good for editing in Excel or Google Sheets. |

**Export Filters:**
- Include/exclude deceased members
- Include/exclude photo URLs

### Import Options

| Option | Description |
|--------|-------------|
| **Update Existing** | Match members by name and update their data |
| **Create Relationships** | Automatically link family relationships based on names |
| **Download Photos** | Download and import photos from URLs in the data |

**Supported Formats:** JSON and CSV files exported from this theme or matching the expected format.

## Gutenberg Blocks

The theme provides visual editor blocks for the Block Editor (Gutenberg):

### Available Blocks

| Block | Description |
|-------|-------------|
| **Family Search** | AJAX-powered search box with optional filters |
| **Family Statistics** | Display family stats in grid, horizontal, or vertical layout |
| **Family Member** | Show a single family member card |
| **Family Members List** | Display a filterable grid or list of members |

### Using Blocks

1. Open the page/post in the Block Editor
2. Click the "+" button to add a block
3. Search for "Family" or "Chapaneri"
4. Configure the block options in the sidebar panel

All blocks have live preview in the editor and render dynamically on the frontend.

## Photo Gallery

Each family member can have a photo gallery in addition to their featured image.

### Adding Photos

1. Edit a family member
2. Scroll to the "Photo Gallery" meta box
3. Click "Add Images" to select photos from the Media Library
4. Drag to reorder or click × to remove photos
5. Save the member

### Gallery Features

- **Main Image Display** - Large main image with navigation
- **Thumbnail Strip** - Clickable thumbnails for quick navigation
- **Lightbox** - Full-screen viewing with keyboard navigation
- **Captions** - Displays image captions when available
- **Responsive** - Adapts to all screen sizes

The featured image automatically appears as the first gallery photo.

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
