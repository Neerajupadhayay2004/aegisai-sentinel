import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PredictiveAnalytics from "./pages/PredictiveAnalytics";
import Scanning from "./pages/Scanning";
import Endpoints from "./pages/Endpoints";
import Incidents from "./pages/Incidents";
import Compliance from "./pages/Compliance";
import ZeroTrust from "./pages/ZeroTrust";
import Assistant from "./pages/Assistant";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Index />} />
          <Route path="/predictive" element={<PredictiveAnalytics />} />
          <Route path="/scanning" element={<Scanning />} />
          <Route path="/endpoints" element={<Endpoints />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/zero-trust" element={<ZeroTrust />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
