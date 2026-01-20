import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TreeDeciduous, Users, ArrowRight } from "lucide-react";
import heroCrest from "@/assets/hero-crest.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroCrest}
          alt="Family Heritage Crest"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border animate-fade-in">
            <TreeDeciduous className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Family Heritage Archive</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight animate-slide-up">
            The
            <span className="block text-gradient-gold">Chapaneri</span>
            Family
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
            Explore generations of family history, discover your roots, 
            and celebrate the bonds that connect us through time.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-4 animate-slide-up stagger-2">
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Family Members</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-primary">5</p>
              <p className="text-sm text-muted-foreground">Generations</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-primary">100+</p>
              <p className="text-sm text-muted-foreground">Years of History</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 animate-slide-up stagger-3">
            <Link to="/tree">
              <Button size="lg" className="w-full sm:w-auto gap-2 shadow-heritage hover:shadow-glow transition-shadow">
                <TreeDeciduous className="w-5 h-5" />
                Explore Family Tree
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/members">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Users className="w-5 h-5" />
                View All Members
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </div>
    </section>
  );
};
