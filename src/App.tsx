import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import FamilyTree from "./pages/FamilyTree";
import PrintableTree from "./pages/PrintableTree";
import Timeline from "./pages/Timeline";
import Places from "./pages/Places";
import SearchPage from "./pages/SearchPage";
import DownloadTheme from "./pages/DownloadTheme";
import Auth from "./pages/Auth";
import PendingApproval from "./pages/PendingApproval";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pending" element={<PendingApproval />} />
              <Route path="/members" element={<Members />} />
              <Route path="/member/:id" element={<MemberDetail />} />
              <Route path="/tree" element={<FamilyTree />} />
              <Route path="/tree/print" element={<PrintableTree />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/places" element={<Places />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/download-theme" element={<DownloadTheme />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
