import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Calendar, MapPin, Users, Share2, Mail, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/event-card";
import { Link } from "wouter";
import type { Event, InsertRsvp, Rsvp } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function EventDetail() {
  const [, params] = useRoute("/events/:id");
  const eventId = params?.id;
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    attendeeName: "",
    attendeeEmail: "",
  });

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["/api/events", eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch event");
      return response.json();
    },
    enabled: !!eventId,
  });

  const { data: allEvents } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: rsvps } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
  });

  const rsvpCount = rsvps?.filter(r => r.eventId === eventId).length || 0;
  const similarEvents = allEvents?.filter(e => e.id !== eventId && e.category === event?.category).slice(0, 3) || [];

  const rsvpMutation = useMutation({
    mutationFn: async (data: InsertRsvp) => {
      return await apiRequest("POST", "/api/rsvps", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rsvps"] });
      toast({
        title: "RSVP Confirmed!",
        description: "You've successfully registered for this event.",
      });
      setIsDialogOpen(false);
      setFormData({ attendeeName: "", attendeeEmail: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventId && formData.attendeeName && formData.attendeeEmail) {
      rsvpMutation.mutate({
        eventId,
        attendeeName: formData.attendeeName,
        attendeeEmail: formData.attendeeEmail,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-[60vh] bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-semibold">Event not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const spotsLeft = event.capacity - rsvpCount;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/">
              <Button variant="ghost" className="mb-4 gap-2 text-white hover:text-white" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
            </Link>
            <Badge className="mb-4" data-testid={`badge-category`}>{event.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2" data-testid="text-event-title">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-display font-semibold mb-4">About This Event</h2>
              <p className="text-muted-foreground text-lg leading-relaxed" data-testid="text-event-description">
                {event.description}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {event.organizerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg" data-testid="text-organizer-name">{event.organizerName}</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-organizer-email">{event.organizerEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {similarEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-semibold mb-6">Similar Events</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarEvents.map(e => (
                    <EventCard key={e.id} event={e} rsvpCount={rsvps?.filter(r => r.eventId === e.id).length || 0} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-detail-datetime">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-detail-location">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-detail-capacity">
                        {rsvpCount} / {event.capacity} attending
                      </p>
                      {spotsLeft > 0 ? (
                        <Badge variant="secondary" className="mt-1">
                          {spotsLeft} spots left
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="mt-1">
                          Event Full
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={spotsLeft === 0 || rsvpMutation.isPending}
                      data-testid="button-register"
                    >
                      {rsvpMutation.isPending ? "Registering..." : spotsLeft === 0 ? "Event Full" : "Register Now"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register for Event</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.attendeeName}
                            onChange={(e) => setFormData({ ...formData, attendeeName: e.target.value })}
                            className="pl-10"
                            required
                            data-testid="input-attendee-name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.attendeeEmail}
                            onChange={(e) => setFormData({ ...formData, attendeeEmail: e.target.value })}
                            className="pl-10"
                            required
                            data-testid="input-attendee-email"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={rsvpMutation.isPending} data-testid="button-submit-rsvp">
                        {rsvpMutation.isPending ? "Submitting..." : "Confirm Registration"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full gap-2" data-testid="button-share">
                  <Share2 className="h-4 w-4" />
                  Share Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
