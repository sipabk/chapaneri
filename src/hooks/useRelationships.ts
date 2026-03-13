import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FamilyRelationship {
  id: string;
  member_id: string;
  related_member_id: string;
  relationship_type: string;
  created_at: string;
}

const INVERSE_MAP: Record<string, string> = {
  father: "son",
  mother: "daughter",
  son: "father",
  daughter: "mother",
  grandfather: "grandson",
  grandmother: "granddaughter",
  grandson: "grandfather",
  granddaughter: "grandmother",
  brother: "brother",
  sister: "sister",
  spouse: "spouse",
  uncle: "nephew",
  aunt: "niece",
  nephew: "uncle",
  niece: "aunt",
};

// Gender-aware inverse: if "son" inverse should be "mother" for female parent
const getInverse = (type: string, relatedGender?: string): string | null => {
  // Handle gender-specific inversions
  if (type === "son" || type === "daughter") {
    return relatedGender === "female" ? "mother" : "father";
  }
  if (type === "father" || type === "mother") {
    return relatedGender === "female" ? "daughter" : "son";
  }
  if (type === "grandson" || type === "granddaughter") {
    return relatedGender === "female" ? "grandmother" : "grandfather";
  }
  if (type === "grandfather" || type === "grandmother") {
    return relatedGender === "female" ? "granddaughter" : "grandson";
  }
  if (type === "brother" || type === "sister") {
    return relatedGender === "female" ? "sister" : "brother";
  }
  if (type === "uncle" || type === "aunt") {
    return relatedGender === "female" ? "niece" : "nephew";
  }
  if (type === "nephew" || type === "niece") {
    return relatedGender === "female" ? "aunt" : "uncle";
  }
  return INVERSE_MAP[type] || null;
};

export const RELATIONSHIP_TYPES = [
  "Father", "Mother", "Son", "Daughter",
  "Brother", "Sister", "Spouse",
  "Grandfather", "Grandmother", "Grandson", "Granddaughter",
  "Uncle", "Aunt", "Nephew", "Niece",
];

export const useRelationships = () => {
  const { toast } = useToast();

  const getRelationships = useCallback(async (memberId: string): Promise<FamilyRelationship[]> => {
    const { data } = await supabase
      .from("family_relationships")
      .select("*")
      .or(`member_id.eq.${memberId},related_member_id.eq.${memberId}`);
    return (data || []) as FamilyRelationship[];
  }, []);

  const addRelationship = async (
    memberId: string,
    relatedMemberId: string,
    relationshipType: string,
    memberGender?: string
  ) => {
    // Insert the primary relationship
    const { error } = await supabase.from("family_relationships").insert({
      member_id: memberId,
      related_member_id: relatedMemberId,
      relationship_type: relationshipType.toLowerCase(),
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "This relationship already exists", variant: "destructive" });
      } else {
        toast({ title: "Failed to add relationship", description: error.message, variant: "destructive" });
      }
      return false;
    }

    // Auto-create inverse relationship
    const inverse = getInverse(relationshipType.toLowerCase(), memberGender);
    if (inverse) {
      await supabase.from("family_relationships").insert({
        member_id: relatedMemberId,
        related_member_id: memberId,
        relationship_type: inverse,
      }).then(({ error: invErr }) => {
        // Ignore duplicate errors for inverse
        if (invErr && invErr.code !== "23505") {
          console.warn("Failed to create inverse relationship:", invErr.message);
        }
      });
    }

    toast({ title: "Relationship added" });
    return true;
  };

  const deleteRelationship = async (id: string) => {
    const { error } = await supabase.from("family_relationships").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to remove relationship", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Relationship removed" });
    return true;
  };

  return { getRelationships, addRelationship, deleteRelationship };
};
