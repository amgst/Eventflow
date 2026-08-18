import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, CheckCircle, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCard } from "@/components/event-card";
import { CategoryCard } from "@/components/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Event, Category, Rsvp } from "@shared/schema";
import { categories } from "@shared/schema";
import heroImage from "@assets/generated_images/Festival_hero_background_image_582a25c6.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: rsvps } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
  });

  const getRsvpCount = (eventId: string) => {
    return rsvps?.filter(r => r.eventId === eventId).length || 0;
  };

  const getCategoryCount = (category: Category) => {
    return events?.filter(e => e.category === category).length || 0;
  };

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const featuredEvents = filteredEvents.slice(0, 6);

  return (
    <div className="min-h-screen">
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Event celebration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight" data-testid="text-hero-title">
            Discover Events That
            <span className="block text-primary">Inspire You</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Connect with your community through unforgettable experiences
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
                data-testid="input-hero-search"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px] h-12" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href={selectedCategory === "all" ? "/events" : `/events?category=${encodeURIComponent(selectedCategory)}`}>
              <Button size="lg" className="h-12 px-8 gap-2" data-testid="button-browse-events">
                Browse Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
              Featured Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked experiences happening near you
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} rsvpCount={getRsvpCount(event.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No events found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-muted-foreground">
              Find events that match your interests
            </p>
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4 min-w-max md:grid md:grid-cols-4 lg:grid-cols-8">
              {categories.map(category => (
                <CategoryCard
                  key={category}
                  category={category}
                  eventCount={getCategoryCount(category)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Getting started is simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold">1. Find Events</h3>
              <p className="text-muted-foreground">
                Browse through hundreds of events or search for something specific
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-display font-semibold">2. RSVP</h3>
              <p className="text-muted-foreground">
                Reserve your spot with a simple click and get instant confirmation
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold">3. Attend</h3>
              <p className="text-muted-foreground">
                Show up and enjoy amazing experiences with your community
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8">
          <Sparkles className="h-12 w-12 mx-auto text-primary" />
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
            Ready to Create Your Own Event?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether it's a workshop, concert, or community gathering, EventHub makes it easy to bring people together.
          </p>
          <Link href="/create">
            <Button size="lg" className="gap-2" data-testid="button-cta-create">
              Start Creating Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
