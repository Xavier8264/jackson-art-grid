import { Calendar, Filter, List, Grid3X3, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function CalendarPage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          venue:venues(name, address)
        `)
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

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

  const formatArtType = (artType: string) => {
    return artType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-r from-sky-light/50 to-primary/5 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
              <p className="text-muted-foreground">
                Browse upcoming events in Jackson's arts scene
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex rounded-md border border-primary/20">
                <Button variant="ghost" size="sm" className="rounded-r-none text-primary">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-l-none">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="mt-3 h-4 w-1/3 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const cost = formatCostType(event.cost_type || "free", event.ticket_price);
              return (
                <Card 
                  key={event.id} 
                  className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Date badge */}
                      <div className="flex min-w-[100px] flex-row items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground sm:flex-col sm:gap-0">
                        <span className="text-3xl font-bold">
                          {format(new Date(event.event_date), "d")}
                        </span>
                        <span className="text-sm uppercase">
                          {format(new Date(event.event_date), "MMM yyyy")}
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
                          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {event.start_time && (
                            <span className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-primary/60" />
                              {format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                              {event.end_time && ` – ${format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}`}
                            </span>
                          )}
                          {event.is_recurring && (
                            <Badge variant="secondary" className="bg-sky-light/50 text-sky-dark">
                              Recurring
                            </Badge>
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
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Calendar className="mb-4 h-16 w-16 text-primary/30" />
              <h2 className="mb-2 text-xl font-semibold">No Events Yet</h2>
              <p className="max-w-md text-muted-foreground">
                The calendar will display events once they are added.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
