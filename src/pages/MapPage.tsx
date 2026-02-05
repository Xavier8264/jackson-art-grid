import { MapPin, Filter, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapboxMap } from "@/components/map/MapboxMap";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface Venue {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  latitude: number | null;
  longitude: number | null;
  art_types?: string[] | null;
  description?: string | null;
  accessibility_info?: string | null;
}

export default function MapPage() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const { data: venues, isLoading: venuesLoading } = useQuery({
    queryKey: ["venues-map"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null);
      
      if (error) throw error;
      return data as Venue[];
    },
  });

  const { data: venueEvents } = useQuery({
    queryKey: ["venue-events", selectedVenue?.id],
    queryFn: async () => {
      if (!selectedVenue) return [];
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("venue_id", selectedVenue.id)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedVenue,
  });

  const formatArtType = (artType: string) => {
    return artType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const hasToken = !!import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-r from-sky-light/50 to-primary/5 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Map</h1>
              <p className="text-muted-foreground">
                Explore cultural venues across Jackson
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground">
                <Navigation className="mr-2 h-4 w-4" />
                Near Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Container */}
      <section className="relative">
        <div className="h-[calc(100vh-200px)] min-h-[500px]">
          {!hasToken ? (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-sky-light/30 to-primary/5">
              <MapPin className="mb-4 h-16 w-16 text-primary/30" />
              <h2 className="mb-2 text-xl font-semibold">Interactive Map</h2>
              <p className="max-w-md text-center text-muted-foreground">
                Configure the Mapbox token to enable the interactive venue map.
              </p>
            </div>
          ) : venuesLoading ? (
            <div className="flex h-full items-center justify-center bg-muted/20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <MapboxMap 
              venues={venues || []} 
              height="100%"
              interactive={true}
              showControls={true}
              onVenueClick={setSelectedVenue}
            />
          )}
        </div>

        {/* Venue Detail Panel */}
        {selectedVenue && (
          <div className="absolute bottom-4 left-4 right-4 z-10 md:left-auto md:right-4 md:w-96">
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/venues/${selectedVenue.id}`} className="hover:underline">
                      <h3 className="text-lg font-semibold text-primary cursor-pointer hover:underline">{selectedVenue.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {selectedVenue.address}, {selectedVenue.city}, {selectedVenue.state}
                    </p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 ml-2"
                    onClick={() => setSelectedVenue(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {selectedVenue.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {selectedVenue.description}
                  </p>
                )}

                {selectedVenue.art_types && selectedVenue.art_types.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {selectedVenue.art_types.map((type) => (
                      <Badge 
                        key={type} 
                        variant="outline" 
                        className="border-primary/30 text-primary text-xs"
                      >
                        {formatArtType(type)}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Upcoming events at this venue */}
                {venueEvents && venueEvents.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="mb-2 text-sm font-medium">Upcoming Events</h4>
                    <div className="space-y-2">
                      {venueEvents.slice(0, 3).map((event) => (
                        <div 
                          key={event.id} 
                          className="flex items-center gap-3 rounded-md bg-sky-light/30 p-2"
                        >
                          <div className="flex flex-col items-center rounded bg-primary px-2 py-1 text-primary-foreground">
                            <span className="text-xs font-bold">
                              {format(new Date(event.event_date), "d")}
                            </span>
                            <span className="text-[10px] uppercase">
                              {format(new Date(event.event_date), "MMM")}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            {event.start_time && (
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
