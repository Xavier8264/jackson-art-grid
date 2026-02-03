import { MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MapPage() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Map</h1>
              <p className="text-muted-foreground">
                Explore cultural venues across Jackson
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-4 w-4" />
                Near Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Container */}
      <section className="container py-8">
        <Card className="overflow-hidden">
          <CardContent className="flex h-[500px] flex-col items-center justify-center bg-muted/20 p-0">
            <MapPin className="mb-4 h-16 w-16 text-primary/30" />
            <h2 className="mb-2 text-xl font-semibold">Interactive Map</h2>
            <p className="max-w-md text-center text-muted-foreground">
              The Mapbox integration will display venue locations once configured.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
