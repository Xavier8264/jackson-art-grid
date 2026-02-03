import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Phone, Globe, Accessibility, Calendar, Clock, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const artTypeLabels: Record<string, string> = {
  visual_arts: "Visual Arts",
  music: "Music",
  theater: "Theater",
  dance: "Dance",
  literary: "Literary",
  film: "Film",
  crafts: "Crafts",
  mixed_media: "Mixed Media",
};

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: venue, isLoading: venueLoading } = useQuery({
    queryKey: ["venue", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ["venue-events", id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_artists(
            artist:artists(id, name)
          )
        `)
        .eq("venue_id", id)
        .gte("event_date", today)
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const formatArtType = (artType: string) => {
    return artTypeLabels[artType] || artType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatCostType = (costType: string, price?: number) => {
    switch (costType) {
      case "free":
        return { label: "Free", className: "bg-green-100 text-green-700" };
      case "donation":
        return { label: "Donation", className: "bg-amber-100 text-amber-700" };
      case "ticketed":
        return { label: price ? `$${price}` : "Ticketed", className: "bg-primary/10 text-primary" };
      case "pay_at_door":
        return { label: "Pay at door", className: "bg-muted text-muted-foreground" };
      default:
        return { label: costType, className: "bg-muted text-muted-foreground" };
    }
  };

  if (venueLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-40 rounded-lg bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container py-16 text-center">
        <Building2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
        <h1 className="mb-2 text-2xl font-bold">Venue Not Found</h1>
        <p className="mb-6 text-muted-foreground">The venue you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/venues">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venues
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b bg-gradient-to-r from-sky-light/50 to-primary/5 py-8">
        <div className="container">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to="/venues">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Venues
            </Link>
          </Button>

          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Icon */}
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-sky-light text-primary">
              <Building2 className="h-12 w-12" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{venue.name}</h1>
              
              <p className="mt-2 flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {venue.address}, {venue.city}, {venue.state} {venue.zip}
              </p>

              {venue.art_types && venue.art_types.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {venue.art_types.map((type: string) => (
                    <Badge key={type} variant="outline" className="border-primary/30 text-primary">
                      {formatArtType(type)}
                    </Badge>
                  ))}
                </div>
              )}

              {venue.description && (
                <p className="mt-4 max-w-2xl text-muted-foreground">{venue.description}</p>
              )}

              {/* Contact buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {venue.website && (
                  <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground" asChild>
                    <a href={venue.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                )}
                {venue.phone && (
                  <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary" asChild>
                    <a href={`tel:${venue.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      {venue.phone}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <div>
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming Events at {venue.name}
              </h2>
              
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const cost = formatCostType(event.cost_type || "free", event.ticket_price);
                    return (
                      <Card key={event.id} className="border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="flex min-w-[80px] flex-row items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground sm:flex-col sm:gap-0">
                              <span className="text-2xl font-bold">
                                {format(new Date(event.event_date), "d")}
                              </span>
                              <span className="text-xs uppercase">
                                {format(new Date(event.event_date), "MMM")}
                              </span>
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold">{event.title}</h3>
                                  {event.event_artists && event.event_artists.length > 0 && (
                                    <p className="mt-1 flex items-center text-sm text-muted-foreground">
                                      <Users className="mr-1 h-3 w-3" />
                                      {event.event_artists
                                        .filter((ea: any) => ea.artist)
                                        .map((ea: any) => (
                                          <Link 
                                            key={ea.artist.id} 
                                            to={`/artists/${ea.artist.id}`}
                                            className="hover:text-primary hover:underline"
                                          >
                                            {ea.artist.name}
                                          </Link>
                                        ))
                                        .reduce((prev: any, curr: any, i: number) => 
                                          i === 0 ? [curr] : [...prev, ", ", curr], 
                                        [])}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {event.art_type && (
                                    <Badge variant="outline" className="border-primary/30 text-primary">
                                      {formatArtType(event.art_type)}
                                    </Badge>
                                  )}
                                  <Badge className={cost.className}>
                                    {cost.label}
                                  </Badge>
                                </div>
                              </div>
                              
                              {event.description && (
                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                  {event.description}
                                </p>
                              )}

                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                {event.start_time && (
                                  <Badge variant="secondary" className="bg-sky-light/50 text-sky-dark">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                                    {event.end_time && ` – ${format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}`}
                                  </Badge>
                                )}
                                {event.is_recurring && (
                                  <Badge variant="secondary">Recurring</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No upcoming events at this venue</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Venue Info Card */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Venue Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upcoming Events</span>
                    <span className="font-medium">{upcomingEvents?.length || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Art Types</span>
                    <span className="font-medium">{venue.art_types?.length || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{venue.city}, {venue.state}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Info */}
            {venue.accessibility_info && (
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-center font-semibold">
                    <Accessibility className="mr-2 h-4 w-4 text-primary" />
                    Accessibility
                  </h3>
                  <p className="text-sm text-muted-foreground">{venue.accessibility_info}</p>
                </CardContent>
              </Card>
            )}

            {/* Map placeholder */}
            <Card className="border-border/50 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-sky-light/50 to-primary/10 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-primary/30" />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  {venue.address}, {venue.city}, {venue.state} {venue.zip}
                </p>
                <Button asChild variant="link" className="mt-2 h-auto p-0 text-primary">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
