import { Link } from "react-router-dom";
import { User, Calendar, MapPin, Users } from "lucide-react";
import { FamilyMember, getChildren, getSpouse, getParents, getSiblings } from "@/data/familyData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RelatedMembersSidebarProps {
  member: FamilyMember;
}

export const RelatedMembersSidebar = ({ member }: RelatedMembersSidebarProps) => {
  const spouse = getSpouse(member.id);
  const parents = getParents(member.id);
  const children = getChildren(member.id);
  const siblings = getSiblings(member.id);

  const sections = [
    { title: "Spouse", icon: "💑", members: spouse ? [spouse] : [] },
    { title: "Parents", icon: "👨‍👩‍👦", members: parents },
    { title: "Siblings", icon: "👫", members: siblings },
    { title: "Children", icon: "👶", members: children },
  ].filter(s => s.members.length > 0);

  if (sections.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gradient-hero p-4">
        <h3 className="font-display text-lg font-semibold text-primary-foreground flex items-center gap-2">
          <Users className="w-5 h-5" />
          Family Connections
        </h3>
      </div>
      <div className="p-4 space-y-5">
        {sections.map((section, sIdx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: sIdx * 0.1 }}
          >
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>{section.icon}</span>
              {section.title}
              <span className="ml-auto text-xs bg-muted rounded-full px-2 py-0.5">
                {section.members.length}
              </span>
            </h4>
            <div className="space-y-1.5">
              {section.members.map(m => (
                <Link
                  key={m.id}
                  to={`/member/${m.id}`}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    m.gender === 'male' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  )}>
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {m.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {m.birthDate && (
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-3 h-3" />
                          {m.birthDate.split(' ').pop()}
                        </span>
                      )}
                      {m.birthPlace && (
                        <span className="flex items-center gap-0.5 truncate">
                          <MapPin className="w-3 h-3" />
                          {m.birthPlace.split(',')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
