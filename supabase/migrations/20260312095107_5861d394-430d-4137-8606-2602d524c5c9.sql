
-- Create family_members table
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date_of_birth TEXT,
  birth_place TEXT,
  date_of_death TEXT,
  death_place TEXT,
  relationship TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')),
  bio TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  generation INTEGER NOT NULL DEFAULT 3,
  spouse_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  parent_ids UUID[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member_photos table
CREATE TABLE public.member_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  is_primary BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_photos ENABLE ROW LEVEL SECURITY;

-- Family members policies
CREATE POLICY "Authenticated users can view family members"
  ON public.family_members FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Editors and admins can insert family members"
  ON public.family_members FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );

CREATE POLICY "Editors and admins can update family members"
  ON public.family_members FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );

CREATE POLICY "Admins can delete family members"
  ON public.family_members FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Member photos policies
CREATE POLICY "Authenticated users can view member photos"
  ON public.member_photos FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Editors and admins can insert member photos"
  ON public.member_photos FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );

CREATE POLICY "Editors and admins can delete member photos"
  ON public.member_photos FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Updated_at trigger for family_members
CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for member photos
INSERT INTO storage.buckets (id, name, public) VALUES ('member-photos', 'member-photos', true);

-- Storage policies
CREATE POLICY "Anyone can view member photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'member-photos');

CREATE POLICY "Authenticated users can upload member photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'member-photos');

CREATE POLICY "Authenticated users can delete member photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'member-photos');
