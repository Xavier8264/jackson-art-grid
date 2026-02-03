import { Building2, Filter, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function VenuesPage() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Venues</h1>
              <p className="text-muted-foreground">
                Discover cultural spaces in Jackson
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search venues..."
                  className="w-64 pl-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-4 w-4" />
                View Map
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <Building2 className="mb-4 h-16 w-16 text-primary/30" />
            <h2 className="mb-2 text-xl font-semibold">Venue Directory</h2>
            <p className="max-w-md text-muted-foreground">
              Venue listings will appear here once the database is populated with demo data.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
