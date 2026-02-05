import { Link } from "react-router-dom";
import { Calendar, MapPin, Image, Users, Building2, ArrowRight, Clock, DollarSign, Navigation, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MapPreview } from "@/components/map/MapPreview";
import { FeaturedArtwork } from "@/components/home/FeaturedArtwork";
import { FeaturedArtist } from "@/components/home/FeaturedArtist";
import { heroImage } from "@/lib/placeholder-images";

const quickActions = [
  { label: "Today", description: "What's happening now", path: "/calendar?range=today" },
  { label: "This Weekend", description: "Plan your weekend", path: "/calendar?range=thisWeekend" },
  { label: "Free Events", description: "No cost activities", path: "/calendar?free=true" },
  { label: "Near Me", description: "Events nearby", path: "/map", icon: Navigation },
  { label: "Live", description: "8K livestreams now", path: "/live", icon: Radio },
];

const sections = [
  {
    title: "Calendar",
    description: "Browse upcoming events by date",
    icon: Calendar,
    path: "/calendar",
  },
  {
    title: "Map",
    description: "Explore venues across Jackson",
    icon: MapPin,
    path: "/map",
  },
  {
    title: "Gallery",
    description: "Discover local artworks",
    icon: Image,
    path: "/gallery",
  },
  {
    title: "Artists",
    description: "Meet Jackson's creative community",
    icon: Users,
    path: "/artists",
  },
  {
    title: "Venues",
    description: "Find cultural spaces",
    icon: Building2,
    path: "/venues",
  },
  {
    title: "Live",
    description: "8K livestreamed performances",
    icon: Radio,
    path: "/live",
  },
];

export default function Index() {
  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          venue:venues(name)
        `)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b py-16 md:py-24">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Arts festival in Jackson" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        </div>
        <div className="container relative text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Hub for the Arts
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-foreground md:text-xl font-medium">
            A centralized digital platform that connects artists, venues, and the public to make arts discovery and access simple, inclusive, and accessible citywide.
          </p>
          <p className="mb-8 text-sm font-medium text-primary">Jackson, TN</p>
        </div>

        {/* Quick Actions */}
        <div className="w-full flex justify-center mb-12 px-4">
          <div className="flex flex-wrap justify-center items-center gap-3 max-w-fit">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col gap-0.5 border-primary/20 px-6 py-3 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link to={action.path}>
                  <span className="font-medium flex items-center gap-1">
                      {action.label === "Live" && (
                        <span
                          className="inline-block animate-pulse text-[1.25em]"
                          style={{ color: "hsl(var(--sky))" }}
                          aria-hidden="true"
                        >
                          &middot;
                        </span>
                      )}
                      {action.label}
                  </span>
                  <span className="text-xs opacity-70">{action.description}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="container py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {sections.map((section, index) => (
            <Link key={section.path} to={section.path}>
              <Card className="group h-full border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div 
                    className="mb-4 rounded-full bg-gradient-to-br from-primary/10 to-sky-light p-4 text-primary transition-transform group-hover:scale-110"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <section.icon className="h-6 w-6" />
                  </div>
                    <h2 className="mb-1 font-semibold flex items-center gap-1.5">
                      {section.title === "Live" && (
                        <span
                          className="inline-block animate-pulse text-[1.25em]"
                          style={{ color: "hsl(var(--sky))" }}
                          aria-hidden="true"
                        >
                          &middot;
                        </span>
                      )}
                      {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                  <ArrowRight className="mt-4 h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Map Preview & Featured Content */}
      <section className="container pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map Preview - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <MapPreview />
          </div>
          
          {/* Featured Artwork */}
          <div className="space-y-6">
            <FeaturedArtwork />
          </div>
        </div>
      </section>

      {/* Featured Artist Row */}
      <section className="container pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeaturedArtist />
          
          {/* Stats or quick info cards */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-sky-light/30">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 text-4xl font-bold text-primary">14</div>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
              <Button asChild variant="link" className="mt-2 text-primary">
                <Link to="/calendar">View Calendar</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-gradient-to-br from-sky-light/30 to-primary/5">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 text-4xl font-bold text-primary">8</div>
              <p className="text-sm text-muted-foreground">Cultural Venues</p>
              <Button asChild variant="link" className="mt-2 text-primary">
                <Link to="/venues">Explore Venues</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="border-t bg-gradient-to-b from-sky-light/30 to-background py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
            <Button asChild variant="ghost" className="text-primary hover:text-primary">
              <Link to="/calendar">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Date badge */}
                      <div className="flex min-w-[80px] flex-col items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
                        <span className="text-2xl font-bold">
                          {format(new Date(event.event_date), "d")}
                        </span>
                        <span className="text-xs uppercase">
                          {format(new Date(event.event_date), "MMM")}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-4">
                        <h3 className="mb-1 font-semibold transition-colors group-hover:text-primary">
                          {event.title}
                        </h3>
                        {event.venue && (
                          <p className="mb-2 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.venue.name}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {event.start_time && (
                            <Badge variant="secondary" className="bg-sky-light/50 text-sky-dark">
                              <Clock className="mr-1 h-3 w-3" />
                              {format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                            </Badge>
                          )}
                          {event.cost_type === "free" && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <DollarSign className="mr-1 h-3 w-3" />
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="mb-4 h-12 w-12 text-primary/30" />
                <p className="text-muted-foreground">
                  No upcoming events found
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link to="/calendar">Browse Calendar</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
