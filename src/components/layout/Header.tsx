import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, TreeDeciduous, Users, Clock, MapPin, Search, Download, UserPlus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const navItems = user
    ? [
        { path: "/", label: "Home", icon: TreeDeciduous },
        { path: "/tree", label: "Family Tree", icon: TreeDeciduous },
        { path: "/family-members", label: "Members", icon: Users },
        { path: "/timeline", label: "Timeline", icon: Clock },
        { path: "/places", label: "Places", icon: MapPin },
        { path: "/statistics", label: "Statistics", icon: BarChart3 },
      ]
    : [
        { path: "/", label: "Home", icon: TreeDeciduous },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-heritage group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
              <TreeDeciduous className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-semibold text-foreground leading-tight">
                Chapaneri
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Family Heritage</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            {user && (
              <Link to="/search">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Link to="/download-theme">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Download className="w-5 h-5" />
                </Button>
              </Link>
            )}
            {!user && (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" /> Sign In
                </Button>
              </Link>
            )}
            <UserMenu />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
