import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <AppHeader />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Repos />} />
                  <Route path="/repos" element={<Repos />} />
                  <Route path="/repos/:id" element={<RepoDashboard />} />
                  <Route path="/components" element={<Components />} />
                  <Route path="/components/:id" element={<ComponentDetail />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/features/:id" element={<FeatureDetail />} />
                  <Route path="/changes" element={<Changes />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
