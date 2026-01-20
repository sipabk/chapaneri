import { TreeDeciduous, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <TreeDeciduous className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Chapaneri
                </h3>
                <p className="text-xs text-muted-foreground">Family Heritage</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Preserving our family history for generations to come. 
              Every story matters, every connection counts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">
              Explore
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/tree" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Family Tree
              </Link>
              <Link to="/members" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                All Members
              </Link>
              <Link to="/timeline" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Timeline
              </Link>
              <Link to="/places" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Places
              </Link>
            </nav>
          </div>

          {/* Family Info */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">
              About This Archive
            </h4>
            <p className="text-sm text-muted-foreground">
              This genealogy archive documents the Chapaneri family heritage, 
              tracing our roots through generations across India and beyond.
            </p>
            <p className="text-sm text-muted-foreground">
              Report created: 8 April 2010
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Chapaneri Family Archive
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary" /> for family
          </p>
        </div>
      </div>
    </footer>
  );
};
