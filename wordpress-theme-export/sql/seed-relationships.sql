-- ============================================================================
-- Chapaneri Heritage v3.0 — Seed Relationships
-- ============================================================================
-- These INSERT statements create the bi-directional relationship records
-- that mirror the React app's family data. Replace {prefix} with your
-- WordPress table prefix (default: wp_).
--
-- IMPORTANT: The member_id and related_member_id values here correspond to
-- WordPress post IDs. After importing family members via the theme's
-- Import/Export tool, update these IDs to match your actual post IDs.
-- ============================================================================

-- Example relationship types used:
-- father, mother, spouse, sibling, son, daughter

-- The theme's class-family-relationships.php automatically creates
-- inverse relationships when you add a relationship via the admin UI.
-- For example, adding "father" from A→B automatically creates "son/daughter"
-- from B→A based on B's gender.

-- To seed relationships after import, use the WordPress admin:
-- Family Members → Edit Member → Relationships tab
-- Or use the REST API endpoint: POST /wp-json/chapaneri/v1/relationships
