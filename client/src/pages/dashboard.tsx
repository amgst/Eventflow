import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, Eye, TrendingUp, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Event, Rsvp } from "@shared/schema";

export default function Dashboard() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: rsvps } = useQuery<Rsvp[]>({
    queryKey: ["/api/rsvps"],
  });

  const getRsvpCount = (eventId: string) => {
    return rsvps?.filter(r => r.eventId === eventId).length || 0;
  };

  const totalEvents = events?.length || 0;
  const totalRsvps = rsvps?.length || 0;
  const totalCapacity = events?.reduce((sum, e) => sum + e.capacity, 0) || 0;
  const fillRate = totalCapacity > 0 ? Math.round((totalRsvps / totalCapacity) * 100) : 0;

  const stats = [
    { label: "Total Events", value: totalEvents, icon: Calendar, color: "text-primary" },
    { label: "Total RSVPs", value: totalRsvps, icon: Users, color: "text-accent" },
    { label: "Avg. Fill Rate", value: `${fillRate}%`, icon: TrendingUp, color: "text-green-600 dark:text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
              Organizer Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your events and track attendance
            </p>
          </div>
          <Link href="/create">
            <Button className="gap-2" size="lg" data-testid="button-create-new">
              <Plus className="h-4 w-4" />
              Create New Event
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display font-bold" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>RSVPs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => {
                      const rsvpCount = getRsvpCount(event.id);
                      const spotsLeft = event.capacity - rsvpCount;
                      const fillPercentage = Math.round((rsvpCount / event.capacity) * 100);

                      return (
                        <TableRow key={event.id} data-testid={`row-event-${event.id}`}>
                          <TableCell className="font-medium">
                            <Link href={`/events/${event.id}`}>
                              <span className="hover:text-primary cursor-pointer" data-testid={`text-event-title-${event.id}`}>
                                {event.title}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{event.category}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px] truncate">
                            {event.location}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium" data-testid={`text-rsvp-count-${event.id}`}>
                                {rsvpCount} / {event.capacity}
                              </span>
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                  className="bg-primary h-1.5 rounded-full transition-all"
                                  style={{ width: `${fillPercentage}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {spotsLeft === 0 ? (
                              <Badge variant="destructive">Full</Badge>
                            ) : spotsLeft < 10 ? (
                              <Badge className="bg-amber-500 text-white">
                                {spotsLeft} left
                              </Badge>
                            ) : (
                              <Badge className="bg-green-500 text-white">
                                Available
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" data-testid={`button-actions-${event.id}`}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/events/${event.id}`}>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </Link>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first event to get started
                  </p>
                  <Link href="/create">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Event
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
