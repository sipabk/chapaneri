import { Users, TreeDeciduous, MapPin, Heart, Calendar } from "lucide-react";
import { getFamilyStats, familyMembers } from "@/data/familyData";
import { motion } from "framer-motion";

export const FamilyStatsWidget = () => {
  const stats = getFamilyStats();
  const livingMembers = familyMembers.filter(m => !m.deathDate).length;
  const earliestYear = familyMembers
    .filter(m => m.birthDate)
    .map(m => parseInt(m.birthDate!.split(' ').pop() || '9999'))
    .sort((a, b) => a - b)[0];

  const items = [
    { icon: Users, value: stats.totalMembers, label: "Members", color: "text-primary" },
    { icon: TreeDeciduous, value: stats.generations, label: "Generations", color: "text-primary" },
    { icon: MapPin, value: stats.places, label: "Locations", color: "text-primary" },
    { icon: Heart, value: Math.round(stats.marriages), label: "Marriages", color: "text-accent" },
    { icon: Calendar, value: earliestYear || 'N/A', label: "Since", color: "text-accent" },
    { icon: Users, value: livingMembers, label: "Living", color: "text-primary" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Family at a Glance
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-center p-3 rounded-lg bg-muted/50"
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
              <p className="text-lg font-display font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
