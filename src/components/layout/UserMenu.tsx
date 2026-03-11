import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogIn, LogOut, Shield } from "lucide-react";

export const UserMenu = () => {
  const { user, profile, role, isAdmin, loading, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <LogIn className="w-5 h-5" />
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <User className="w-5 h-5" />
          <Badge
            variant={role === "pending" ? "destructive" : "default"}
            className="absolute -top-1 -right-1 text-[9px] px-1 py-0 h-4 min-w-4"
          >
            {role.charAt(0).toUpperCase()}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
          <p className="text-xs text-muted-foreground">{profile?.email}</p>
          <Badge variant="outline" className="mt-1 text-xs capitalize">{role}</Badge>
        </div>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="gap-2">
              <Shield className="w-4 h-4" /> Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive">
          <LogOut className="w-4 h-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
