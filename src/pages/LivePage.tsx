import { useState } from "react";
import { Radio, MapPin, Clock, Zap, Wifi, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function LivePage() {
  const { data: liveEvents, isLoading } = useQuery({
    queryKey: ["live-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          venue:venues(name, address)
        `)
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-r from-sky-light/50 to-primary/5 py-8">
        <div className="container">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                <div className="relative">
                  <Radio className="h-8 w-8 text-primary animate-pulse" fill="currentColor" />
                  <div className="absolute inset-0 animate-ping opacity-75">
                    <Radio className="h-8 w-8 text-primary" fill="currentColor" />
                  </div>
                </div>
                Live Events
              </h1>
              <p className="mt-2 text-muted-foreground">
                Stream upcoming live performances from Jackson's finest venues
              </p>
            </div>

            {/* Technology Badge Section */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-sky-dark text-white gap-1.5">
                  <Zap className="h-3 w-3" />
                  8K Ultra HD
                </Badge>
                <Badge variant="outline" className="border-primary/30 gap-1.5">
                  <Wifi className="h-3 w-3" />
                  E+ Broadband Fiber Optic
                </Badge>
              </div>
            </div>

            {/* Technology Info Box */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="flex items-start gap-2 text-sm text-foreground">
                <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  <strong>Premium Streaming Experience:</strong> All livestreams are broadcast in stunning 8K resolution, optimized for E+ Broadband Fiber Optic Cables to ensure the highest quality, lag-free viewing experience.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="mt-3 h-4 w-1/3 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : liveEvents && liveEvents.length > 0 ? (
          <div className="space-y-4">
            {liveEvents.map((event) => (
              <Card 
                key={event.id} 
                className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Live Indicator */}
                    <div className="flex min-w-[100px] flex-row items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground sm:flex-col sm:gap-0">
                      <div className="relative">
                        <Radio className="h-6 w-6 animate-pulse" fill="currentColor" />
                        <div className="absolute inset-0 animate-ping opacity-75">
                          <Radio className="h-6 w-6" fill="currentColor" />
                        </div>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        LIVE
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                            {event.title}
                          </h3>
                          {event.venue && (
                            <p className="mt-1 flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {event.venue.name}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-sky-dark text-white gap-1">
                            <Zap className="h-3 w-3" />
                            8K
                          </Badge>
                          <Badge variant="outline" className="border-primary/30">
                            Fiber Optic
                          </Badge>
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {event.event_date && (
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-primary/60" />
                            {format(new Date(event.event_date), "MMM d, yyyy")}
                          </span>
                        )}
                        {event.start_time && (
                          <span className="flex items-center">
                            <Clock className="mr-1 h-4 w-4 text-primary/60" />
                            {format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                            {event.end_time && ` – ${format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}`}
                          </span>
                        )}
                      </div>

                      {/* Watch Button */}
                      <Button 
                        className="mt-4 gap-2 bg-primary hover:bg-primary/90"
                      >
                        <Radio className="h-4 w-4" fill="white" />
                        Watch Live Stream (8K)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-4">
                <Radio className="h-16 w-16 text-primary/30" />
                <div className="absolute inset-0 animate-pulse opacity-50">
                  <Radio className="h-16 w-16 text-primary/30" />
                </div>
              </div>
              <h2 className="mb-2 text-xl font-semibold">No Live Streams Currently</h2>
              <p className="max-w-md text-muted-foreground">
                Check back soon for upcoming 8K livestreamed events from Jackson's arts venues, delivered via E+ Broadband Fiber Optic Cables.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                asChild
              >
                <a href="/calendar">View Upcoming Events</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Information Section */}
      <section className="border-t bg-muted/30 py-12">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 rounded-full bg-sky-light p-3 w-fit">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">8K Ultra HD Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Experience livestreams in stunning 8K resolution for the ultimate in detail and clarity. Perfect for large screens and immersive viewing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 rounded-full bg-sky-light p-3 w-fit">
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">E+ Fiber Optic Network</h3>
                <p className="text-sm text-muted-foreground">
                  All streams are optimized for E+ Broadband Fiber Optic Cables, ensuring zero lag, consistent streaming, and exceptional performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 rounded-full bg-sky-light p-3 w-fit">
                  <Radio className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Live & On-Demand</h3>
                <p className="text-sm text-muted-foreground">
                  Watch performances as they happen or catch replays at your convenience. Full access to all livestreamed events from our venues.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
