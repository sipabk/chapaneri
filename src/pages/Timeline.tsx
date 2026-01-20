import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Heart, Calendar, Filter, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTimelineEvents, getMemberById } from "@/data/familyData";
import { cn } from "@/lib/utils";

type EventFilter = 'all' | 'birth' | 'death' | 'marriage';

const Timeline = () => {
  const [eventFilter, setEventFilter] = useState<EventFilter>('all');
  const allEvents = getTimelineEvents();

  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return allEvents;
    return allEvents.filter(event => event.type === eventFilter);
  }, [allEvents, eventFilter]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birth':
        return <Star className="w-5 h-5" />;
      case 'death':
        return <Heart className="w-5 h-5" />;
      case 'marriage':
        return <Heart className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'birth':
        return "bg-success text-success-foreground";
      case 'death':
        return "bg-muted-foreground text-background";
      case 'marriage':
        return "bg-accent text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getEventBorderColor = (type: string) => {
    switch (type) {
      case 'birth':
        return "border-success/30 hover:border-success";
      case 'death':
        return "border-muted-foreground/30 hover:border-muted-foreground";
      case 'marriage':
        return "border-accent/30 hover:border-accent";
      default:
        return "border-primary/30 hover:border-primary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="bg-gradient-parchment border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Family History</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Timeline
              </h1>
              <p className="text-muted-foreground text-lg">
                Key moments in our family history, chronologically ordered
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} events
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Event Type
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={eventFilter === 'all'}
                  onCheckedChange={() => setEventFilter('all')}
                >
                  All Events
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={eventFilter === 'birth'}
                  onCheckedChange={() => setEventFilter('birth')}
                >
                  Births
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={eventFilter === 'death'}
                  onCheckedChange={() => setEventFilter('death')}
                >
                  Deaths
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Timeline */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Center Line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

                {/* Events */}
                <div className="space-y-8">
                  {filteredEvents.map((event, index) => {
                    const member = getMemberById(event.memberId);
                    
                    return (
                      <div
                        key={`${event.memberId}-${event.type}-${index}`}
                        className={cn(
                          "relative flex items-start gap-6 md:gap-8",
                          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
                          "animate-slide-up"
                        )}
                        style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                      >
                        {/* Icon */}
                        <div className={cn(
                          "absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-card",
                          getEventColor(event.type)
                        )}>
                          {getEventIcon(event.type)}
                        </div>

                        {/* Content */}
                        <div className={cn(
                          "flex-1 ml-20 md:ml-0",
                          index % 2 === 0 ? "md:pr-20 md:text-right" : "md:pl-20 md:text-left"
                        )}>
                          <Link
                            to={`/member/${event.memberId}`}
                            className={cn(
                              "block heritage-card border-2 transition-all duration-200 hover:shadow-heritage",
                              getEventBorderColor(event.type)
                            )}
                          >
                            <p className="text-sm font-medium text-accent mb-1">
                              {event.date}
                            </p>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                              {event.title}
                            </h3>
                            <p className="text-muted-foreground mb-3">
                              {event.description}
                            </p>
                            {member && (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                {member.relationship}
                              </span>
                            )}
                          </Link>
                        </div>

                        {/* Spacer for desktop */}
                        <div className="hidden md:block flex-1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-16">
                  <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    No events found
                  </h3>
                  <p className="text-muted-foreground">
                    Try changing your filter selection
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Timeline;
