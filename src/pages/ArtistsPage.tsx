import { Users, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ArtistsPage() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
              <p className="text-muted-foreground">
                Meet Jackson's creative community
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search artists..."
                  className="w-64 pl-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="mb-4 h-16 w-16 text-primary/30" />
            <h2 className="mb-2 text-xl font-semibold">Artist Directory</h2>
            <p className="max-w-md text-muted-foreground">
              Artist profiles will appear here once the database is populated with demo data.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
