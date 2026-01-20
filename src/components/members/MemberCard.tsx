import { Link } from "react-router-dom";
import { User, Calendar, MapPin, Users } from "lucide-react";
import { FamilyMember, getChildren, getSpouse } from "@/data/familyData";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  member: FamilyMember;
  variant?: 'default' | 'compact' | 'featured';
}

export const MemberCard = ({ member, variant = 'default' }: MemberCardProps) => {
  const spouse = getSpouse(member.id);
  const children = getChildren(member.id);

  if (variant === 'compact') {
    return (
      <Link
        to={`/member/${member.id}`}
        className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:shadow-card hover:border-primary/20 transition-all duration-200"
      >
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          member.gender === 'male' 
            ? "bg-primary/10 text-primary" 
            : "bg-accent/10 text-accent"
        )}>
          <User className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-foreground truncate">{member.name}</h4>
          <p className="text-sm text-muted-foreground">{member.relationship}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/member/${member.id}`}
      className="group block heritage-card hover:shadow-heritage transition-all duration-300 hover:-translate-y-1"
    >
      {/* Avatar */}
      <div className={cn(
        "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-card",
        member.gender === 'male' 
          ? "bg-gradient-to-br from-primary to-primary/80" 
          : "bg-gradient-to-br from-accent to-accent/80"
      )}>
        <User className={cn(
          "w-8 h-8",
          member.gender === 'male' ? "text-primary-foreground" : "text-accent-foreground"
        )} />
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {member.name}
        </h3>
        
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {member.relationship}
        </span>

        <div className="space-y-1 pt-2">
          {member.birthDate && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{member.birthDate}</span>
            </p>
          )}

          {member.birthPlace && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{member.birthPlace.split(',')[0]}</span>
            </p>
          )}

          {(spouse || children.length > 0) && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 pt-1">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {spouse && `Married`}
                {spouse && children.length > 0 && ' • '}
                {children.length > 0 && `${children.length} ${children.length === 1 ? 'child' : 'children'}`}
              </span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
