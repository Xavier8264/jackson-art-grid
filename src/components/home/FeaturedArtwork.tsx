import { Link } from "react-router-dom";
import { Palette, ArrowRight, User, DollarSign, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function FeaturedArtwork() {
  const { data: artwork, isLoading } = useQuery({
    queryKey: ["featured-artwork"],
    queryFn: async () => {
      // Get a random artwork that's for sale
      const { data, error } = await supabase
        .from("artworks")
        .select(`
          *,
          artist:artists(name, available_for_commission)
        `)
        .eq("for_sale", true)
        .limit(10);
      
      if (error) throw error;
      if (!data || data.length === 0) return null;
      
      // Return a random one from the results
      return data[Math.floor(Math.random() * data.length)];
    },
    staleTime: 1000 * 60 * 5, // Rotate every 5 minutes
  });

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Featured Artwork
        </CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
          <Link to="/gallery">
            Gallery <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="aspect-[4/3] rounded-lg bg-muted" />
            <div className="mt-3 h-5 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
          </div>
        ) : artwork ? (
          <div className="group">
            {/* Artwork image placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-sky-light/50 to-primary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <Palette className="h-16 w-16 text-primary/20" />
              </div>
              <Badge className="absolute right-2 top-2 bg-green-500 text-white">
                For Sale
              </Badge>
            </div>
            
            <div className="mt-3">
              <h3 className="font-semibold transition-colors group-hover:text-primary">
                {artwork.title}
              </h3>
              
              {artwork.artist && (
                <p className="mt-1 flex items-center text-sm text-muted-foreground">
                  <User className="mr-1 h-3 w-3" />
                  {artwork.artist.name}
                </p>
              )}
              
              {artwork.medium && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {artwork.medium}
                </p>
              )}
              
              <div className="mt-2 flex items-center gap-2">
                {artwork.price && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <DollarSign className="mr-1 h-3 w-3" />
                    {artwork.price.toLocaleString()}
                  </Badge>
                )}
                {artwork.artist?.available_for_commission && (
                  <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                    Commissions open
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Palette className="mb-3 h-12 w-12 text-primary/30" />
            <p className="text-sm text-muted-foreground">No featured artworks yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
