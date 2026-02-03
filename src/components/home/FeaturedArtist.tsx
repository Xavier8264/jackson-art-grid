import { Link } from "react-router-dom";
import { Users, ArrowRight, Palette, Globe, Instagram } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getArtistPlaceholder } from "@/lib/placeholder-images";

export function FeaturedArtist() {
  const { data: artist, isLoading } = useQuery({
    queryKey: ["featured-artist"],
    queryFn: async () => {
      // Get artists available for commission
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("available_for_commission", true)
        .limit(10);
      
      if (error) throw error;
      if (!data || data.length === 0) {
        // Fallback to any artist
        const { data: anyArtist } = await supabase
          .from("artists")
          .select("*")
          .limit(5);
        if (!anyArtist || anyArtist.length === 0) return null;
        return anyArtist[Math.floor(Math.random() * anyArtist.length)];
      }
      
      return data[Math.floor(Math.random() * data.length)];
    },
    staleTime: 1000 * 60 * 5, // Rotate every 5 minutes
  });

  const formatArtForm = (artForm: string) => {
    return artForm.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Featured Artist
        </CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
          <Link to="/artists">
            All Artists <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-16 w-16 rounded-full bg-muted" />
            <div className="mt-3 h-5 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-full rounded bg-muted" />
          </div>
        ) : artist ? (
          <div className="group">
            {/* Avatar */}
            <div className="h-20 w-20 overflow-hidden rounded-full">
              <img 
                src={artist.image_url || getArtistPlaceholder(artist.id)} 
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <h3 className="mt-3 font-semibold transition-colors group-hover:text-primary">
              {artist.name}
            </h3>
            
            {artist.bio && (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {artist.bio}
              </p>
            )}
            
            {/* Art forms */}
            {artist.art_forms && artist.art_forms.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {artist.art_forms.slice(0, 3).map((form: string) => (
                  <Badge 
                    key={form} 
                    variant="secondary" 
                    className="bg-sky-light/50 text-sky-dark text-xs"
                  >
                    <Palette className="mr-1 h-2.5 w-2.5" />
                    {formatArtForm(form)}
                  </Badge>
                ))}
              </div>
            )}
            
            {artist.available_for_commission && (
              <Badge className="mt-2 bg-green-100 text-green-700 text-xs">
                Available for commissions
              </Badge>
            )}
            
            {/* Links */}
            <div className="mt-3 flex gap-2">
              {artist.website && (
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary" asChild>
                  <a href={artist.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {artist.instagram && (
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary" asChild>
                  <a href={`https://instagram.com/${artist.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="mb-3 h-12 w-12 text-primary/30" />
            <p className="text-sm text-muted-foreground">No featured artists yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
