import { Switch, Route, Redirect, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import EventDetail from "@/pages/event-detail";
import CreateEvent from "@/pages/create-event";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import EventsList from "@/pages/events";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={EventsList} />
      <Route path="/events/:id/:slug" component={LegacyEventRouteRedirect} />
      <Route path="/events/:slug" component={EventDetail} />
      <Route path="/create" component={CreateEvent} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function LegacyEventRouteRedirect() {
  const [, params] = useRoute("/events/:id/:slug");
  const slug = (params as any)?.slug || "";
  return <Redirect to={`/events/${slug}`} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
