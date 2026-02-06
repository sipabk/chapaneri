import { Link } from "react-router-dom";
import { Calendar, Heart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTimelineEvents } from "@/data/familyData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const TimelinePreview = () => {
  const events = getTimelineEvents().slice(0, 6);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birth': return <Star className="w-4 h-4" />;
      case 'death': return <Heart className="w-4 h-4" />;
      case 'marriage': return <Heart className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'birth': return "bg-success text-success-foreground";
      case 'death': return "bg-muted text-muted-foreground";
      case 'marriage': return "bg-accent text-accent-foreground";
      default: return "bg-primary text-primary-foreground";
    }
  };

  return (
    <section className="py-24 bg-gradient-parchment">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Family Timeline
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Key moments in our family history, from births to celebrations
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

            <div className="space-y-8">
              {events.map((event, index) => (
                <motion.div
                  key={`${event.memberId}-${event.type}-${index}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative flex items-start gap-6 md:gap-8",
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
                  )}
                >
                  <div className={cn(
                    "absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10",
                    getEventColor(event.type)
                  )}>
                    {getEventIcon(event.type)}
                  </div>

                  <div className={cn(
                    "flex-1 ml-16 md:ml-0",
                    index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                  )}>
                    <div className="heritage-card inline-block hover:shadow-heritage transition-shadow">
                      <p className="text-sm font-medium text-accent mb-1">{event.date}</p>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>

                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/timeline">
            <Button variant="outline" size="lg" className="gap-2 group hover:scale-105 transition-all duration-300">
              View Full Timeline
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
