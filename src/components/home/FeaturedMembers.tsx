import { Link } from "react-router-dom";
import { User, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { familyMembers } from "@/data/familyData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const FeaturedMembers = () => {
  const featuredIds = [12, 46, 47, 1, 2];
  const featured = featuredIds.map(id => familyMembers.find(m => m.id === id)).filter(Boolean);

  return (
    <section className="py-24 bg-gradient-parchment">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Family Members
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the key members of our family tree, spanning multiple generations
          </p>
        </motion.div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {featured.map((member, index) => (
            <motion.div
              key={member!.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Link
                to={`/member/${member!.id}`}
                className="group block heritage-card hover:shadow-heritage transition-all duration-300 h-full"
              >
                {/* Avatar */}
                <div className={cn(
                  "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-card transition-transform duration-300 group-hover:scale-110",
                  member!.gender === 'male'
                    ? "bg-gradient-to-br from-primary to-primary/80"
                    : "bg-gradient-to-br from-accent to-accent/80"
                )}>
                  <User className={cn(
                    "w-10 h-10",
                    member!.gender === 'male' ? "text-primary-foreground" : "text-accent-foreground"
                  )} />
                </div>

                {/* Info */}
                <div className="text-center space-y-2">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {member!.name}
                  </h3>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {member!.relationship}
                  </span>

                  {member!.birthDate && (
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {member!.birthDate}
                    </p>
                  )}

                  {member!.birthPlace && (
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {member!.birthPlace.split(',')[0]}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/members">
            <Button variant="outline" size="lg" className="gap-2 group hover:scale-105 transition-all duration-300">
              View All Family Members
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
