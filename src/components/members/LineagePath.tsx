import { Link } from "react-router-dom";
import { ChevronRight, User, TreeDeciduous } from "lucide-react";
import { FamilyMember, getMemberById } from "@/data/familyData";
import { cn } from "@/lib/utils";

interface LineagePathProps {
  member: FamilyMember;
}

const generationLabels: Record<number, string> = {
  0: "Great-Grandparents",
  1: "Grandparents", 
  2: "Parents",
  3: "Current Generation",
  4: "Children",
  5: "Grandchildren",
};

// Build ancestry path from oldest ancestor to current member
const buildAncestryPath = (member: FamilyMember): FamilyMember[] => {
  const path: FamilyMember[] = [];
  
  const traceAncestors = (m: FamilyMember): FamilyMember[] => {
    if (!m.parentIds || m.parentIds.length === 0) {
      return [m];
    }
    
    // Get first parent (typically father in this data structure)
    const parent = getMemberById(m.parentIds[0]);
    if (!parent) {
      return [m];
    }
    
    return [...traceAncestors(parent), m];
  };
  
  return traceAncestors(member);
};

export const LineagePath = ({ member }: LineagePathProps) => {
  const ancestryPath = buildAncestryPath(member);
  
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <TreeDeciduous className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-semibold text-foreground">
          Lineage Path
        </h3>
        <span className="ml-auto px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
          Generation {member.generation} • {generationLabels[member.generation] || `Gen ${member.generation}`}
        </span>
      </div>

      {/* Visual Tree Path */}
      <div className="relative">
        {ancestryPath.map((ancestor, index) => {
          const isLast = index === ancestryPath.length - 1;
          const isCurrent = ancestor.id === member.id;
          
          return (
            <div key={ancestor.id} className="relative">
              {/* Connection Line */}
              {index > 0 && (
                <div className="absolute left-5 -top-4 w-0.5 h-4 bg-border" />
              )}
              
              <div className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-all",
                isCurrent 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-muted/50"
              )}>
                {/* Generation Indicator */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10",
                  isCurrent
                    ? ancestor.gender === 'male' 
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-accent text-accent-foreground shadow-lg"
                    : ancestor.gender === 'male'
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent"
                )}>
                  <span className="text-sm font-bold">{ancestor.generation}</span>
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  {isCurrent ? (
                    <div>
                      <p className="font-semibold text-foreground truncate">
                        {ancestor.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {generationLabels[ancestor.generation] || `Generation ${ancestor.generation}`} • You are here
                      </p>
                    </div>
                  ) : (
                    <Link 
                      to={`/member/${ancestor.id}`}
                      className="block group"
                    >
                      <p className="font-medium text-foreground group-hover:text-primary truncate transition-colors">
                        {ancestor.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {generationLabels[ancestor.generation] || `Generation ${ancestor.generation}`}
                      </p>
                    </Link>
                  )}
                </div>

                {/* Avatar Icon */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  ancestor.gender === 'male' 
                    ? "bg-primary/10 text-primary" 
                    : "bg-accent/10 text-accent"
                )}>
                  <User className="w-4 h-4" />
                </div>

                {/* Arrow for non-last items */}
                {!isLast && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 absolute right-3 -bottom-2 rotate-90" />
                )}
              </div>

              {/* Vertical connector to next */}
              {!isLast && (
                <div className="ml-5 w-0.5 h-4 bg-border" />
              )}
            </div>
          );
        })}
      </div>

      {/* Generation Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-display font-bold text-primary">
              {ancestryPath.length - 1}
            </p>
            <p className="text-sm text-muted-foreground">
              Generations Traced
            </p>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-accent">
              {ancestryPath[0]?.name?.split(' ')[0] || 'Unknown'}
            </p>
            <p className="text-sm text-muted-foreground">
              Oldest Ancestor
            </p>
          </div>
        </div>
      </div>

      {/* View in Tree Button */}
      <div className="mt-4">
        <Link 
          to={`/family-tree?highlight=${member.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <TreeDeciduous className="w-4 h-4" />
          View in Full Family Tree
        </Link>
      </div>
    </div>
  );
};
