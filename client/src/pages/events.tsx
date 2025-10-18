import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import type { Event, Rsvp, Category } from "@shared/schema";
import { categories as allCategories } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

function parseParamsFromLocationString(locationString?: string) {
  let search = "";
  if (locationString && locationString.includes("?")) {
    search = locationString.slice(locationString.indexOf("?"));
  } else if (typeof window !== "undefined") {
    search = window.location.search;
  }
  const params = new URLSearchParams(search || "");
  const categoryParam = params.get("category") || "all";
  const pageParam = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  return { category: categoryParam, page: pageParam };
}

function buildHref(category: string, page: number) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/events?${qs}` : "/events";
}

export default function EventsList() {
  const [location] = useLocation();
  const { category: categoryParam, page: currentPage } = useMemo(() => parseParamsFromLocationString(location), [location]);

  const categories: ("all" | Category)[] = ["all", ...allCategories];
  const normalized = (categoryParam || "all").toLowerCase();
  const selectedCategory: "all" | Category = (categories.find((c) => c.toLowerCase() === normalized) as any) || "all";

  const { data: events, isLoading: loadingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: rsvps } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
  });

  const rsvpCountByEvent = useMemo(() => {
    const map: Record<string, number> = {};
    (rsvps || []).forEach((r) => {
      map[r.eventId] = (map[r.eventId] || 0) + 1;
    });
    return map;
  }, [rsvps]);

  const filteredEvents = useMemo(() => {
    const list = events || [];
    if (selectedCategory === "all") return list;
    const selectedLower = (selectedCategory as string).toLowerCase();
    return list.filter((e) => e.category.toLowerCase() === selectedLower);
  }, [events, selectedCategory]);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil((filteredEvents?.length || 0) / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const pageEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground">All Events</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const active = cat === selectedCategory;
          return (
            <Link key={cat} href={buildHref(cat, 1)}>
              <Button variant={active ? "default" : "outline"} size="sm">
                {cat === "all" ? "All" : cat}
              </Button>
            </Link>
          );
        })}
      </div>

      {loadingEvents ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4">
              <Skeleton className="aspect-[4/3] w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageEvents.map((event) => (
              <EventCard key={event.id} event={event} rsvpCount={rsvpCountByEvent[event.id] || 0} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={buildHref(selectedCategory, Math.max(1, safePage - 1))} />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={buildHref(selectedCategory, page)}
                        isActive={page === safePage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext href={buildHref(selectedCategory, Math.min(totalPages, safePage + 1))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}