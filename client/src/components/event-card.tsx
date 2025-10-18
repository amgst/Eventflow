import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  rsvpCount?: number;
}

export function EventCard({ event, rsvpCount = 0 }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="group relative overflow-hidden rounded-xl bg-card border border-card-border hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer" data-testid={`card-event-${event.id}`}>
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <Badge className="absolute top-4 right-4 backdrop-blur-sm bg-primary/90 text-primary-foreground" data-testid={`badge-category-${event.id}`}>
            {event.category}
          </Badge>
          
          <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-lg" data-testid={`text-date-${event.id}`}>
            <div className="text-xs font-medium text-muted-foreground">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
            <div className="text-xl font-display font-bold text-foreground">{new Date(event.date).getDate()}</div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-display font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${event.id}`}>
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${event.id}`}>
              {event.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-datetime-${event.id}`}>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1" data-testid={`text-location-${event.id}`}>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span data-testid={`text-rsvp-count-${event.id}`}>{rsvpCount} / {event.capacity} attending</span>
            </div>
          </div>

          <Button className="w-full" size="default" data-testid={`button-rsvp-${event.id}`}>
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
}
