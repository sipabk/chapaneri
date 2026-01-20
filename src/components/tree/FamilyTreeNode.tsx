import { Link } from "react-router-dom";
import { User, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FamilyMember, getChildren, getSpouse } from "@/data/familyData";
import { cn } from "@/lib/utils";

interface FamilyTreeNodeProps {
  member: FamilyMember;
  showSpouse?: boolean;
  showChildren?: boolean;
  level?: number;
}

export const FamilyTreeNode = ({ 
  member, 
  showSpouse = true, 
  showChildren = true,
  level = 0 
}: FamilyTreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const spouse = showSpouse ? getSpouse(member.id) : null;
  const children = showChildren ? getChildren(member.id) : [];

  return (
    <div className="relative">
      {/* Main Node */}
      <div className="flex flex-col items-center">
        {/* Couple Container */}
        <div className="flex items-center gap-2">
          {/* Member Card */}
          <Link
            to={`/member/${member.id}`}
            className={cn(
              "group flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-heritage",
              member.gender === 'male'
                ? "bg-card border-primary/30 hover:border-primary"
                : "bg-card border-accent/30 hover:border-accent"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-2",
              member.gender === 'male'
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground"
            )}>
              <User className="w-6 h-6" />
            </div>
            <p className="font-display text-sm font-semibold text-foreground text-center max-w-[120px] line-clamp-2 group-hover:text-primary transition-colors">
              {member.name}
            </p>
            {member.birthDate && (
              <p className="text-xs text-muted-foreground mt-1">
                b. {member.birthDate.split(' ').pop()}
              </p>
            )}
          </Link>

          {/* Spouse Card */}
          {spouse && (
            <>
              <div className="w-8 h-0.5 bg-accent/50" />
              <Link
                to={`/member/${spouse.id}`}
                className={cn(
                  "group flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-heritage",
                  spouse.gender === 'male'
                    ? "bg-card border-primary/30 hover:border-primary"
                    : "bg-card border-accent/30 hover:border-accent"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  spouse.gender === 'male'
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                )}>
                  <User className="w-6 h-6" />
                </div>
                <p className="font-display text-sm font-semibold text-foreground text-center max-w-[120px] line-clamp-2 group-hover:text-primary transition-colors">
                  {spouse.name}
                </p>
                {spouse.birthDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    b. {spouse.birthDate.split(' ').pop()}
                  </p>
                )}
              </Link>
            </>
          )}
        </div>

        {/* Expand/Collapse Button for Children */}
        {children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            {children.length} {children.length === 1 ? 'child' : 'children'}
          </button>
        )}

        {/* Children */}
        {isExpanded && children.length > 0 && (
          <div className="mt-6 relative">
            {/* Vertical Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border" />
            
            {/* Horizontal Line */}
            {children.length > 1 && (
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
            )}

            {/* Children Nodes */}
            <div className="flex gap-6 pt-6">
              {children.map((child) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  {/* Vertical connector */}
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border" />
                  
                  <FamilyTreeNode
                    member={child}
                    showSpouse={true}
                    showChildren={true}
                    level={level + 1}
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
