import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, LogOut } from "lucide-react";

const PendingApproval = () => {
  const { user, isPending, loading, signOut } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isPending) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="mt-16 text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="font-display text-2xl">Account Pending Approval</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your account has been created successfully. An administrator needs to approve your account before you can access family records.
              </p>
              <p className="text-sm text-muted-foreground">
                You will be notified once your account has been approved.
              </p>
              <Button variant="outline" onClick={signOut} className="gap-2 mt-4">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PendingApproval;
