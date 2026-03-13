import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Link2 } from "lucide-react";
import { useRelationships, FamilyRelationship, RELATIONSHIP_TYPES } from "@/hooks/useRelationships";
import { DbFamilyMember } from "@/hooks/useFamilyMembers";

interface RelationshipManagerProps {
  memberId: string;
  memberGender: string;
  allMembers: DbFamilyMember[];
  canEdit: boolean;
}

interface ResolvedRelationship {
  id: string;
  relatedMember: DbFamilyMember;
  type: string;
  direction: "outgoing" | "incoming";
}

export const RelationshipManager = ({ memberId, memberGender, allMembers, canEdit }: RelationshipManagerProps) => {
  const { getRelationships, addRelationship, deleteRelationship } = useRelationships();
  const [relationships, setRelationships] = useState<FamilyRelationship[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [relType, setRelType] = useState("");
  const [relMemberId, setRelMemberId] = useState("");

  const loadRels = async () => {
    const rels = await getRelationships(memberId);
    setRelationships(rels);
  };

  useEffect(() => {
    if (memberId) loadRels();
  }, [memberId]);

  const resolved: ResolvedRelationship[] = relationships
    .map(r => {
      const isOutgoing = r.member_id === memberId;
      const relatedId = isOutgoing ? r.related_member_id : r.member_id;
      const member = allMembers.find(m => m.id === relatedId);
      if (!member) return null;
      return {
        id: r.id,
        relatedMember: member,
        type: isOutgoing ? r.relationship_type : r.relationship_type,
        direction: isOutgoing ? "outgoing" as const : "incoming" as const,
      };
    })
    .filter((r): r is ResolvedRelationship => r !== null);

  // Deduplicate (since we store both directions)
  const seen = new Set<string>();
  const unique = resolved.filter(r => {
    const key = [r.relatedMember.id, r.type].sort().join("-");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Group by type
  const grouped: Record<string, ResolvedRelationship[]> = {};
  unique.forEach(r => {
    const label = r.direction === "outgoing" ? r.type : r.type;
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(r);
  });

  const otherMembers = allMembers.filter(m => m.id !== memberId);

  const handleAdd = async () => {
    if (!relType || !relMemberId) return;
    const success = await addRelationship(memberId, relMemberId, relType, memberGender);
    if (success) {
      setRelType("");
      setRelMemberId("");
      setShowAdd(false);
      loadRels();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Link2 className="w-4 h-4" /> Family Relationships
        </h3>
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)} className="gap-1">
            <Plus className="w-3 h-3" /> Add
          </Button>
        )}
      </div>

      {showAdd && (
        <div className="p-3 rounded-lg border border-border bg-secondary/50 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Relationship Type</Label>
              <Select value={relType} onValueChange={setRelType}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_TYPES.map(t => (
                    <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Related To</Label>
              <Select value={relMemberId} onValueChange={setRelMemberId}>
                <SelectTrigger><SelectValue placeholder="Select member..." /></SelectTrigger>
                <SelectContent>
                  {otherMembers.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!relType || !relMemberId}>Add Relationship</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-muted-foreground">No relationships recorded</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(grouped).map(([type, rels]) => (
            <div key={type}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 capitalize">{type}</p>
              <div className="flex flex-wrap gap-2">
                {rels.map(r => (
                  <Badge key={r.id} variant="secondary" className="gap-1 py-1 px-2">
                    {r.relatedMember.name}
                    {canEdit && (
                      <button onClick={() => deleteRelationship(r.id).then(() => loadRels())} className="ml-1 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
