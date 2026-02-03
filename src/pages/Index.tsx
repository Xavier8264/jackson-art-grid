import { Link } from "react-router-dom";
import { Calendar, MapPin, Image, Users, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const quickActions = [
  { label: "Today", description: "What's happening now" },
  { label: "This Weekend", description: "Plan your weekend" },
  { label: "Free Events", description: "No cost activities" },
  { label: "Near Me", description: "Events nearby" },
];

const sections = [
  {
    title: "Calendar",
    description: "Browse upcoming events by date",
    icon: Calendar,
    path: "/calendar",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Map",
    description: "Explore venues across Jackson",
    icon: MapPin,
    path: "/map",
    color: "bg-sky-light text-sky-dark",
  },
  {
    title: "Gallery",
    description: "Discover local artworks",
    icon: Image,
    path: "/gallery",
    color: "bg-accent text-accent-foreground",
  },
  {
    title: "Artists",
    description: "Meet Jackson's creative community",
    icon: Users,
    path: "/artists",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Venues",
    description: "Find cultural spaces",
    icon: Building2,
    path: "/venues",
    color: "bg-muted text-muted-foreground",
  },
];

export default function Index() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="container py-16 text-center md:py-24">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Hub for the Arts
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Discover what's happening in Jackson's arts scene
        </p>

        {/* Quick Actions */}
        <div className="mx-auto mb-12 flex max-w-2xl flex-wrap justify-center gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex-col gap-0.5 px-6 py-3 hover:bg-primary hover:text-primary-foreground"
            >
              <span className="font-medium">{action.label}</span>
              <span className="text-xs opacity-70">{action.description}</span>
            </Button>
          ))}
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="container pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {sections.map((section) => (
            <Link key={section.path} to={section.path}>
              <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className={`mb-4 rounded-full p-4 ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 className="mb-1 font-semibold">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                  <ArrowRight className="mt-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section Placeholder */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            Upcoming Events
          </h2>
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Events will appear here once the database is set up
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link to="/calendar">Browse Calendar</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
