import { Users, TreeDeciduous, MapPin, Heart } from "lucide-react";
import { getFamilyStats } from "@/data/familyData";
import { motion } from "framer-motion";

export const StatsSection = () => {
  const stats = getFamilyStats();

  const statItems = [
    { icon: Users, value: stats.totalMembers, label: "Family Members", description: "Documented in our archive" },
    { icon: TreeDeciduous, value: stats.generations, label: "Generations", description: "Spanning over a century" },
    { icon: MapPin, value: stats.places, label: "Locations", description: "Across countries" },
    { icon: Heart, value: Math.round(stats.marriages), label: "Marriages", description: "Family unions" },
  ];

  return (
    <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                <motion.p
                  className="font-display text-4xl sm:text-5xl font-bold mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {item.value}+
                </motion.p>
                <p className="text-lg font-medium mb-1">{item.label}</p>
                <p className="text-sm text-primary-foreground/70">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
