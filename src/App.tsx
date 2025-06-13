import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { DummyDataProvider } from "@/contexts/DummyDataContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import Repos from "./pages/Repos";
import RepoDashboard from "./pages/RepoDashboard";
import Components from "./pages/Components";
import ComponentDetail from "./pages/ComponentDetail";
import Features from "./pages/Features";
import FeatureDetail from "./pages/FeatureDetail";
import Changes from "./pages/Changes";
import Integrations from "./pages/Integrations";
import GitHubIntegration from "./pages/GitHubIntegration";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { user } = useAuth();
  
  console.log('=== APP ROUTING DEBUG ===');
  console.log('Current pathname:', window.location.pathname);
  console.log('User authenticated:', !!user);
  console.log('User loading state from AuthProvider');
  
  if (user) {
    console.log('User is authenticated, rendering main app routes');
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={
                  (() => {
                    console.log('Rendering Integrations page (root)');
                    return <Integrations />;
                  })()
                } />
                <Route path="/components" element={<Components />} />
                <Route path="/components/:id" element={<ComponentDetail />} />
                <Route path="/features" element={<Features />} />
                <Route path="/features/:id" element={<FeatureDetail />} />
                <Route path="/changes" element={<Changes />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/integrations/repos" element={<Repos />} />
                <Route path="/integrations/repos/:id" element={<RepoDashboard />} />
                <Route path="/integrations/github" element={
                  (() => {
                    console.log('Rendering GitHubIntegration page');
                    return <GitHubIntegration />;
                  })()
                } />
                <Route path="/auth" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DummyDataProvider>
            <AppContent />
          </DummyDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
