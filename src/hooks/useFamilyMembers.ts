import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DbFamilyMember {
  id: string;
  name: string;
  date_of_birth: string | null;
  birth_place: string | null;
  date_of_death: string | null;
  death_place: string | null;
  relationship: string;
  gender: string;
  bio: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  generation: number;
  spouse_id: string | null;
  parent_ids: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberPhoto {
  id: string;
  member_id: string;
  photo_url: string;
  caption: string | null;
  is_primary: boolean;
}

export interface MemberFormData {
  name: string;
  date_of_birth: string;
  birth_place: string;
  date_of_death: string;
  death_place: string;
  relationship: string;
  gender: string;
  bio: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  generation: number;
}

export const useFamilyMembers = () => {
  const [members, setMembers] = useState<DbFamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .order("generation", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      toast({ title: "Failed to load members", description: error.message, variant: "destructive" });
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = async (form: MemberFormData, userId: string) => {
    const { data, error } = await supabase.from("family_members").insert({
      name: form.name,
      date_of_birth: form.date_of_birth || null,
      birth_place: form.birth_place || null,
      date_of_death: form.date_of_death || null,
      death_place: form.death_place || null,
      relationship: form.relationship,
      gender: form.gender,
      bio: form.bio || null,
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
      notes: form.notes || null,
      generation: form.generation,
      created_by: userId,
    }).select().single();

    if (error) {
      toast({ title: "Failed to add member", description: error.message, variant: "destructive" });
      return null;
    }
    toast({ title: "Member added successfully!" });
    await fetchMembers();
    return data;
  };

  const updateMember = async (id: string, form: MemberFormData) => {
    const { error } = await supabase.from("family_members").update({
      name: form.name,
      date_of_birth: form.date_of_birth || null,
      birth_place: form.birth_place || null,
      date_of_death: form.date_of_death || null,
      death_place: form.death_place || null,
      relationship: form.relationship,
      gender: form.gender,
      bio: form.bio || null,
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
      notes: form.notes || null,
      generation: form.generation,
    }).eq("id", id);

    if (error) {
      toast({ title: "Failed to update member", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Member updated successfully!" });
    await fetchMembers();
    return true;
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from("family_members").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete member", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Member deleted" });
    await fetchMembers();
    return true;
  };

  const uploadPhoto = async (memberId: string, file: File, userId: string) => {
    const ext = file.name.split(".").pop();
    const path = `${memberId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("member-photos")
      .upload(path, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      return null;
    }

    const { data: urlData } = supabase.storage.from("member-photos").getPublicUrl(path);

    const { error: dbError } = await supabase.from("member_photos").insert({
      member_id: memberId,
      photo_url: urlData.publicUrl,
      uploaded_by: userId,
    });

    if (dbError) {
      toast({ title: "Failed to save photo record", description: dbError.message, variant: "destructive" });
      return null;
    }

    return urlData.publicUrl;
  };

  const getMemberPhotos = async (memberId: string): Promise<MemberPhoto[]> => {
    const { data } = await supabase
      .from("member_photos")
      .select("*")
      .eq("member_id", memberId);
    return (data || []) as MemberPhoto[];
  };

  const deletePhoto = async (photoId: string) => {
    const { error } = await supabase.from("member_photos").delete().eq("id", photoId);
    if (error) {
      toast({ title: "Failed to delete photo", description: error.message, variant: "destructive" });
      return false;
    }
    return true;
  };

  return {
    members,
    loading,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    uploadPhoto,
    getMemberPhotos,
    deletePhoto,
  };
};
