import { useState, useMemo } from "react";
import { User, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DbFamilyMember } from "@/hooks/useFamilyMembers";
import { FamilyRelationship } from "@/hooks/useRelationships";
import { MemberPhoto } from "@/hooks/useFamilyMembers";

interface DbFamilyTreeNodeProps {
  member: DbFamilyMember;
  allMembers: DbFamilyMember[];
  allRelationships: FamilyRelationship[];
  level?: number;
  visitedIds?: Set<string>;
  onSelectMember?: (member: DbFamilyMember) => void;
  photosMap?: Map<string, MemberPhoto>;
  highlightedIds?: Set<string>;
  forceExpandIds?: Set<string>;
}

const getChildren = (
  memberId: string,
  allRels: FamilyRelationship[],
  allMembers: DbFamilyMember[]
): DbFamilyMember[] => {
  const childIds = allRels
    .filter(r => r.member_id === memberId && (r.relationship_type === "son" || r.relationship_type === "daughter"))
    .map(r => r.related_member_id);
  return allMembers.filter(m => childIds.includes(m.id));
};

const getSpouse = (
  memberId: string,
  allRels: FamilyRelationship[],
  allMembers: DbFamilyMember[]
): DbFamilyMember | null => {
  const spouseRel = allRels.find(r => r.member_id === memberId && r.relationship_type === "spouse");
  if (!spouseRel) return null;
  return allMembers.find(m => m.id === spouseRel.related_member_id) || null;
};

export const DbFamilyTreeNode = ({
  member,
  allMembers,
  allRelationships,
  level = 0,
  visitedIds = new Set(),
  onSelectMember,
  photosMap = new Map(),
  highlightedIds = new Set(),
  forceExpandIds = new Set(),
}: DbFamilyTreeNodeProps) => {
  const shouldForceExpand = forceExpandIds.has(member.id);
  const [isExpanded, setIsExpanded] = useState(level < 2 || shouldForceExpand);

  // Update expansion when force expand changes
  useMemo(() => {
    if (shouldForceExpand) setIsExpanded(true);
  }, [shouldForceExpand]);

  if (visitedIds.has(member.id)) return null;
  const newVisited = new Set(visitedIds);
  newVisited.add(member.id);

  const spouse = getSpouse(member.id, allRelationships, allMembers);
  if (spouse) newVisited.add(spouse.id);

  const children = getChildren(member.id, allRelationships, allMembers);

  const isHighlighted = highlightedIds.has(member.id);
  const isSpouseHighlighted = spouse ? highlightedIds.has(spouse.id) : false;

  const MemberNode = ({ m, highlighted }: { m: DbFamilyMember; highlighted?: boolean }) => {
    const photo = photosMap.get(m.id);
    return (
      <button
        onClick={() => onSelectMember?.(m)}
        className={cn(
          "group flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg cursor-pointer",
          highlighted && "ring-2 ring-offset-2 ring-yellow-400 scale-105",
          m.gender === "male"
            ? "bg-card border-primary/30 hover:border-primary"
            : "bg-card border-accent/30 hover:border-accent"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-2 overflow-hidden",
          !photo && (m.gender === "male" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground")
        )}>
          {photo ? (
            <img src={photo.photo_url} alt={m.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <p className="font-display text-sm font-semibold text-foreground text-center max-w-[120px] line-clamp-2 group-hover:text-primary transition-colors">
          {m.name}
        </p>
        {m.date_of_birth && (
          <p className="text-xs text-muted-foreground mt-1">
            b. {m.date_of_birth.split(" ").pop()}
          </p>
        )}
      </button>
    );
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <MemberNode m={member} highlighted={isHighlighted} />
          {spouse && (
            <>
              <div className="w-8 h-0.5 bg-accent/50" />
              <MemberNode m={spouse} highlighted={isSpouseHighlighted} />
            </>
          )}
        </div>

        {children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {children.length} {children.length === 1 ? "child" : "children"}
          </button>
        )}

        {isExpanded && children.length > 0 && (
          <div className="mt-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border" />
            {children.length > 1 && (
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
            )}
            <div className="flex gap-6 pt-6">
              {children.map((child) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border" />
                  <DbFamilyTreeNode
                    member={child}
                    allMembers={allMembers}
                    allRelationships={allRelationships}
                    level={level + 1}
                    visitedIds={newVisited}
                    onSelectMember={onSelectMember}
                    photosMap={photosMap}
                    highlightedIds={highlightedIds}
                    forceExpandIds={forceExpandIds}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
