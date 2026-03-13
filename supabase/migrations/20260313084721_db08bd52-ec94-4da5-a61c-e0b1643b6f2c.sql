
-- Activity logs table
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL, -- 'create', 'update', 'delete'
  entity_type text NOT NULL DEFAULT 'family_member',
  entity_id uuid NOT NULL,
  entity_name text NOT NULL DEFAULT '',
  performed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_by_email text NOT NULL DEFAULT '',
  changes jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
  ON public.activity_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Editors and admins can insert logs (automatically via app)
CREATE POLICY "Editors and admins can insert activity logs"
  ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Family relationships table
CREATE TABLE public.family_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  related_member_id uuid NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  relationship_type text NOT NULL, -- 'father', 'mother', 'son', 'daughter', 'spouse', 'brother', 'sister', 'grandfather', 'grandmother', 'grandson', 'granddaughter'
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_relationship CHECK (member_id != related_member_id),
  UNIQUE (member_id, related_member_id, relationship_type)
);

ALTER TABLE public.family_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view relationships"
  ON public.family_relationships FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Editors and admins can insert relationships"
  ON public.family_relationships FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors and admins can update relationships"
  ON public.family_relationships FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors and admins can delete relationships"
  ON public.family_relationships FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
