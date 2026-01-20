import { Link } from "react-router-dom";
import { User, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { familyMembers } from "@/data/familyData";
import { cn } from "@/lib/utils";

export const FeaturedMembers = () => {
  // Featured members: Jitendra (subject), his parents, and children
  const featuredIds = [12, 46, 47, 1, 2];
  const featured = featuredIds.map(id => familyMembers.find(m => m.id === id)).filter(Boolean);

  return (
    <section className="py-24 bg-gradient-parchment">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Family Members
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the key members of our family tree, spanning multiple generations
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {featured.map((member, index) => (
            <Link
              key={member!.id}
              to={`/member/${member!.id}`}
              className={cn(
                "group heritage-card hover:shadow-heritage transition-all duration-300 hover:-translate-y-1",
                "animate-slide-up",
                index === 0 && "sm:col-span-2 lg:col-span-1 xl:col-span-1"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Avatar */}
              <div className={cn(
                "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-card",
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
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/members">
            <Button variant="outline" size="lg" className="gap-2 group">
              View All Family Members
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
