-- ============================================================================
-- Chapaneri Heritage WordPress Theme v3.0 — Database Schema
-- ============================================================================
-- Run this SQL after activating the theme, or use the built-in installer
-- via Appearance → Theme Settings. Tables use {prefix} placeholder;
-- replace with your WordPress table prefix (default: wp_).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Family Relationships Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS {prefix}family_relationships (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id BIGINT(20) UNSIGNED NOT NULL,
    related_member_id BIGINT(20) UNSIGNED NOT NULL,
    relationship_type VARCHAR(50) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_member_id (member_id),
    KEY idx_related_member_id (related_member_id),
    KEY idx_relationship_type (relationship_type),
    UNIQUE KEY idx_unique_relationship (member_id, related_member_id, relationship_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 2. Activity Logs Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS {prefix}family_activity_logs (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    action_type VARCHAR(50) NOT NULL DEFAULT '',
    entity_type VARCHAR(50) NOT NULL DEFAULT 'family_member',
    entity_id BIGINT(20) UNSIGNED NOT NULL DEFAULT 0,
    entity_name VARCHAR(255) NOT NULL DEFAULT '',
    performed_by BIGINT(20) UNSIGNED DEFAULT NULL,
    performed_by_email VARCHAR(255) NOT NULL DEFAULT '',
    changes LONGTEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_entity_type (entity_type),
    KEY idx_entity_id (entity_id),
    KEY idx_performed_by (performed_by),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 3. Member Photos Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS {prefix}member_photos (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id BIGINT(20) UNSIGNED NOT NULL,
    photo_url VARCHAR(512) NOT NULL DEFAULT '',
    caption VARCHAR(500) DEFAULT NULL,
    is_primary TINYINT(1) NOT NULL DEFAULT 0,
    uploaded_by BIGINT(20) UNSIGNED DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_member_id (member_id),
    KEY idx_is_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
