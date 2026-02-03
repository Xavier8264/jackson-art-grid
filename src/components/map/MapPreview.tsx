import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapboxMap } from "./MapboxMap";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MapPreview() {
  const { data: venues, isLoading } = useQuery({
    queryKey: ["venues-for-map"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("id, name, address, latitude, longitude, art_types, description")
        .not("latitude", "is", null)
        .not("longitude", "is", null);
      
      if (error) throw error;
      return data;
    },
  });

  const hasToken = !!import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Venue Map
        </CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
          <Link to="/map">
            Explore <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {!hasToken ? (
          <div className="flex h-[250px] flex-col items-center justify-center bg-gradient-to-br from-sky-light/50 to-primary/5 text-center">
            <MapPin className="mb-3 h-12 w-12 text-primary/30" />
            <p className="text-sm text-muted-foreground">Map preview</p>
            <p className="text-xs text-muted-foreground">Configure Mapbox to enable</p>
          </div>
        ) : isLoading ? (
          <div className="flex h-[250px] items-center justify-center bg-muted/20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <MapboxMap 
            venues={venues || []} 
            height="250px" 
            interactive={false}
            showControls={false}
          />
        )}
      </CardContent>
    </Card>
  );
}
