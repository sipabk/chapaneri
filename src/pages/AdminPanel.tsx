import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserCheck, UserX, Trash2, Loader2 } from "lucide-react";

interface UserWithRole {
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
  role: AppRole;
  role_id: string;
}

const roleBadgeVariant = (role: AppRole) => {
  switch (role) {
    case "admin": return "default";
    case "editor": return "secondary";
    case "viewer": return "outline";
    case "pending": return "destructive";
    default: return "outline";
  }
};

const AdminPanel = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchUsers = async () => {
    setFetching(true);
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");

    if (profiles && roles) {
      const merged: UserWithRole[] = profiles.map((p) => {
        const userRole = roles.find((r) => r.user_id === p.user_id);
        return {
          user_id: p.user_id,
          full_name: p.full_name,
          email: p.email,
          created_at: p.created_at,
          role: (userRole?.role as AppRole) || "pending",
          role_id: userRole?.id || "",
        };
      });
      setUsers(merged.sort((a, b) => {
        const order: Record<AppRole, number> = { pending: 0, viewer: 1, editor: 2, admin: 3 };
        return order[a.role] - order[b.role];
      }));
    }
    setFetching(false);
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleRoleChange = async (targetUserId: string, newRole: AppRole, oldRoleId: string) => {
    if (targetUserId === user.id && newRole !== "admin") {
      toast({ title: "Cannot remove your own admin role", variant: "destructive" });
      return;
    }

    // Delete old role and insert new one
    if (oldRoleId) {
      await supabase.from("user_roles").delete().eq("id", oldRoleId);
    }
    const { error } = await supabase.from("user_roles").insert({
      user_id: targetUserId,
      role: newRole,
    });

    if (error) {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Role updated to ${newRole}` });
      fetchUsers();
    }
  };

  const handleDeleteUser = async (targetUserId: string) => {
    if (targetUserId === user.id) {
      toast({ title: "Cannot delete yourself", variant: "destructive" });
      return;
    }
    // Delete role (profile will cascade from auth.users deletion - but we can only delete roles)
    const { error } = await supabase.from("user_roles").delete().eq("user_id", targetUserId);
    if (error) {
      toast({ title: "Failed to remove user role", description: error.message, variant: "destructive" });
    } else {
      // Also delete profile
      await supabase.from("profiles").delete().eq("user_id", targetUserId);
      toast({ title: "User role and profile removed" });
      fetchUsers();
    }
  };

  const pendingCount = users.filter((u) => u.role === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Manage users and their permissions</p>
            </div>
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-auto text-sm">
                {pendingCount} pending
              </Badge>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Registered Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fetching ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.user_id}>
                        <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={u.role}
                            onValueChange={(val) => handleRoleChange(u.user_id, val as AppRole, u.role_id)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                <Badge variant="destructive" className="text-xs">Pending</Badge>
                              </SelectItem>
                              <SelectItem value="viewer">
                                <Badge variant="outline" className="text-xs">Viewer</Badge>
                              </SelectItem>
                              <SelectItem value="editor">
                                <Badge variant="secondary" className="text-xs">Editor</Badge>
                              </SelectItem>
                              <SelectItem value="admin">
                                <Badge variant="default" className="text-xs">Admin</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {u.user_id !== user.id && (
                            <div className="flex gap-2">
                              {u.role === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => handleRoleChange(u.user_id, "viewer", u.role_id)}
                                >
                                  <UserCheck className="w-3 h-3" /> Approve
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" className="gap-1">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove User?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will remove {u.full_name || u.email}'s role and profile. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(u.user_id)}>
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
