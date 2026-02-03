import { Calendar, Filter, List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
              <p className="text-muted-foreground">
                Browse upcoming events in Jackson's arts scene
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex rounded-md border">
                <Button variant="ghost" size="sm" className="rounded-r-none">
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <Calendar className="mb-4 h-16 w-16 text-primary/30" />
            <h2 className="mb-2 text-xl font-semibold">No Events Yet</h2>
            <p className="max-w-md text-muted-foreground">
              The calendar will display events once the database is populated with demo data.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
