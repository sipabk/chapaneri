import { TreeDeciduous, Heart, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme, themes, ThemeName } from "@/contexts/ThemeContext";

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Search
              </Link>
            </nav>
          </div>

          {/* Active Theme */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Current Theme
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {themes[theme].preview.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border border-border/50"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{themes[theme].label}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Switch themes using the palette icon in the navigation bar.
            </p>
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
            © {new Date().getFullYear()} Chapaneri Family Archive — v2.0
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary" /> for family
          </p>
        </div>
      </div>
    </footer>
  );
};
