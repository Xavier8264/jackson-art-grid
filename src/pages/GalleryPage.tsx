import { Image, Filter, Grid3X3, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GalleryPage() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
              <p className="text-muted-foreground">
                Discover artworks from Jackson's creative community
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex rounded-md border">
                <Button variant="ghost" size="sm" className="rounded-r-none">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-l-none">
                  <LayoutList className="h-4 w-4" />
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
            <Image className="mb-4 h-16 w-16 text-primary/30" />
            <h2 className="mb-2 text-xl font-semibold">Gallery Coming Soon</h2>
            <p className="max-w-md text-muted-foreground">
              Artworks will be displayed here once the database is populated with demo data.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
