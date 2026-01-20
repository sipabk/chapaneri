import { Users, TreeDeciduous, MapPin, Heart } from "lucide-react";
import { getFamilyStats } from "@/data/familyData";

export const StatsSection = () => {
  const stats = getFamilyStats();

  const statItems = [
    {
      icon: Users,
      value: stats.totalMembers,
      label: "Family Members",
      description: "Documented in our archive",
    },
    {
      icon: TreeDeciduous,
      value: stats.generations,
      label: "Generations",
      description: "Spanning over a century",
    },
    {
      icon: MapPin,
      value: stats.places,
      label: "Locations",
      description: "Across countries",
    },
    {
      icon: Heart,
      value: Math.round(stats.marriages),
      label: "Marriages",
      description: "Family unions",
    },
  ];

  return (
    <section className="py-20 bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Icon className="w-8 h-8" />
                </div>
                <p className="font-display text-4xl sm:text-5xl font-bold mb-2">
                  {item.value}+
                </p>
                <p className="text-lg font-medium mb-1">{item.label}</p>
                <p className="text-sm text-primary-foreground/70">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
