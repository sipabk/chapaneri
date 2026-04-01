import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import FamilyMembersPage from "./pages/FamilyMembersPage";
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
import Statistics from "./pages/Statistics";
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
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pending" element={<PendingApproval />} />

              {/* Protected routes - require authenticated + approved user */}
              <Route path="/family-members" element={
                <ProtectedRoute>
                  <FamilyMembersPage />
                </ProtectedRoute>
              } />
              <Route path="/members" element={
                <ProtectedRoute>
                  <Members />
                </ProtectedRoute>
              } />
              <Route path="/member/:id" element={
                <ProtectedRoute>
                  <MemberDetail />
                </ProtectedRoute>
              } />
              <Route path="/tree" element={
                <ProtectedRoute>
                  <FamilyTree />
                </ProtectedRoute>
              } />
              <Route path="/tree/print" element={
                <ProtectedRoute>
                  <PrintableTree />
                </ProtectedRoute>
              } />
              <Route path="/timeline" element={
                <ProtectedRoute>
                  <Timeline />
                </ProtectedRoute>
              } />
              <Route path="/places" element={
                <ProtectedRoute>
                  <Places />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              } />
              <Route path="/download-theme" element={
                <ProtectedRoute requiredRole="admin">
                  <DownloadTheme />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
