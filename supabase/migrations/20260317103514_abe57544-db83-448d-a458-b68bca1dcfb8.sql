
-- Insert sibling relationships for members who share a parent
-- Detect via existing parent-child relationships (type = son/daughter)
WITH parent_child AS (
  SELECT member_id AS parent_id, related_member_id AS child_id
  FROM family_relationships
  WHERE relationship_type IN ('son', 'daughter')
),
sibling_pairs AS (
  SELECT DISTINCT
    pc1.child_id AS member_a,
    pc2.child_id AS member_b,
    fm_a.gender AS gender_a,
    fm_b.gender AS gender_b
  FROM parent_child pc1
  JOIN parent_child pc2 ON pc1.parent_id = pc2.parent_id AND pc1.child_id <> pc2.child_id
  JOIN family_members fm_a ON fm_a.id = pc1.child_id
  JOIN family_members fm_b ON fm_b.id = pc2.child_id
)
INSERT INTO family_relationships (member_id, related_member_id, relationship_type)
SELECT
  member_a,
  member_b,
  CASE WHEN gender_b = 'female' THEN 'sister' ELSE 'brother' END
FROM sibling_pairs
ON CONFLICT DO NOTHING;
