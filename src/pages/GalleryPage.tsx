import { Image, Search, Filter, DollarSign, Palette, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function GalleryPage() {
  const { data: artworks, isLoading } = useQuery({
    queryKey: ["artworks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select(`
          *,
          artist:artists(name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-r from-sky-light/50 to-primary/5 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
              <p className="text-muted-foreground">
                Discover local artworks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search artworks..." className="w-64 pl-9 border-primary/20 focus:border-primary" />
              </div>
              <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : artworks && artworks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artworks.map((artwork) => (
              <Card 
                key={artwork.id} 
                className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                {/* Image placeholder */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sky-light/50 to-primary/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Palette className="h-16 w-16 text-primary/20" />
                  </div>
                  {artwork.for_sale && (
                    <Badge className="absolute right-2 top-2 bg-green-500 text-white">
                      For Sale
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold transition-colors group-hover:text-primary line-clamp-1">
                    {artwork.title}
                  </h3>
                  
                  {artwork.artist && (
                    <p className="mt-1 flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-3 w-3" />
                      {artwork.artist.name}
                    </p>
                  )}
                  
                  {artwork.medium && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                      {artwork.medium}
                    </p>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between">
                    {artwork.price ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <DollarSign className="mr-1 h-3 w-3" />
                        {artwork.price.toLocaleString()}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Contact for price</span>
                    )}
                    
                    {artwork.year_created && (
                      <span className="text-xs text-muted-foreground">
                        {artwork.year_created}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Image className="mb-4 h-16 w-16 text-primary/30" />
              <h2 className="mb-2 text-xl font-semibold">No Artworks Yet</h2>
              <p className="max-w-md text-muted-foreground">
                The gallery will display artworks once they are added.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
