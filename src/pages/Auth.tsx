import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, Loader2 } from "lucide-react";

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (regPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await signUp(regEmail, regPassword, regName);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account. After verification, your account will be pending admin approval.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="font-display text-2xl">Welcome</CardTitle>
              <CardDescription>Sign in or create an account to manage family records</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="gap-2">
                    <LogIn className="w-4 h-4" /> Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" className="gap-2">
                    <UserPlus className="w-4 h-4" /> Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" required minLength={6} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-confirm">Confirm Password</Label>
                      <Input id="reg-confirm" type="password" required value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
