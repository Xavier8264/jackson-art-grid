import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import CalendarPage from "./pages/CalendarPage";
import MapPage from "./pages/MapPage";
import GalleryPage from "./pages/GalleryPage";
import ArtistsPage from "./pages/ArtistsPage";
import VenuesPage from "./pages/VenuesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
