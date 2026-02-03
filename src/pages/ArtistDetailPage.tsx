import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Palette, Mail, Globe, Instagram, Facebook, Calendar, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getArtistPlaceholder, getArtworkPlaceholder } from "@/lib/placeholder-images";

const artTypeLabels: Record<string, string> = {
  visual_arts: "Visual Arts",
  music: "Music",
  theater: "Theater",
  dance: "Dance",
  literary: "Literary",
  film: "Film",
  crafts: "Crafts",
  mixed_media: "Mixed Media",
};

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: artist, isLoading: artistLoading } = useQuery({
    queryKey: ["artist", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: artworks } = useQuery({
    queryKey: ["artist-artworks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("artist_id", id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ["artist-events", id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("event_artists")
        .select(`
          role,
          event:events(
            *,
            venue:venues(name, address)
          )
        `)
        .eq("artist_id", id);
      
      if (error) throw error;
      
      // Filter for upcoming events and sort
      return data
        ?.filter((ea) => ea.event && ea.event.event_date >= today)
        .sort((a, b) => 
          new Date(a.event!.event_date).getTime() - new Date(b.event!.event_date).getTime()
        ) || [];
    },
    enabled: !!id,
  });

  const formatArtForm = (artForm: string) => {
    return artTypeLabels[artForm] || artForm.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (artistLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-40 rounded-lg bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container py-16 text-center">
        <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
        <h1 className="mb-2 text-2xl font-bold">Artist Not Found</h1>
        <p className="mb-6 text-muted-foreground">The artist you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/artists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Artists
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b bg-gradient-to-r from-sky-light/50 to-primary/5 py-8">
        <div className="container">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to="/artists">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Artists
            </Link>
          </Button>

          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full">
              <img 
                src={artist.image_url || getArtistPlaceholder(artist.id)} 
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{artist.name}</h1>
              
              {artist.art_forms && artist.art_forms.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {artist.art_forms.map((form: string) => (
                    <Badge key={form} variant="secondary" className="bg-sky-light/50 text-sky-dark">
                      <Palette className="mr-1 h-3 w-3" />
                      {formatArtForm(form)}
                    </Badge>
                  ))}
                </div>
              )}

              {artist.available_for_commission && (
                <Badge className="mt-3 bg-green-100 text-green-700">
                  Available for commissions
                </Badge>
              )}

              {artist.bio && (
                <p className="mt-4 max-w-2xl text-muted-foreground">{artist.bio}</p>
              )}

              {/* Links */}
              <div className="mt-4 flex flex-wrap gap-2">
                {artist.website && (
                  <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary" asChild>
                    <a href={artist.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
                {artist.instagram && (
                  <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary" asChild>
                    <a href={`https://instagram.com/${artist.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </a>
                  </Button>
                )}
                {artist.facebook && (
                  <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary" asChild>
                    <a href={artist.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </a>
                  </Button>
                )}
                {artist.email && (
                  <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary" asChild>
                    <a href={`mailto:${artist.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <div>
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming Events
              </h2>
              
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((ea) => (
                    <Card key={ea.event!.id} className="border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex min-w-[60px] flex-col items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 p-2 text-primary-foreground">
                          <span className="text-lg font-bold">
                            {format(new Date(ea.event!.event_date), "d")}
                          </span>
                          <span className="text-xs uppercase">
                            {format(new Date(ea.event!.event_date), "MMM")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{ea.event!.title}</h3>
                          {ea.event!.venue && (
                            <p className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {ea.event!.venue.name}
                            </p>
                          )}
                          {ea.role && ea.role !== "performer" && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {ea.role}
                            </Badge>
                          )}
                        </div>
                        {ea.event!.start_time && (
                          <Badge variant="secondary" className="bg-sky-light/50 text-sky-dark">
                            <Clock className="mr-1 h-3 w-3" />
                            {format(new Date(`2000-01-01T${ea.event!.start_time}`), "h:mm a")}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No upcoming events</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Artworks */}
            {artworks && artworks.length > 0 && (
              <div>
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <Palette className="mr-2 h-5 w-5 text-primary" />
                  Artworks
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {artworks.map((artwork) => (
                    <Card key={artwork.id} className="border-border/50 hover:border-primary/30 transition-colors overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={artwork.image_url || getArtworkPlaceholder(artwork.id)} 
                          alt={artwork.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{artwork.title}</h3>
                        {artwork.medium && (
                          <p className="text-sm text-muted-foreground">{artwork.medium}</p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          {artwork.price ? (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              <DollarSign className="mr-1 h-3 w-3" />
                              {artwork.price.toLocaleString()}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Contact for price</span>
                          )}
                          {artwork.for_sale && (
                            <Badge className="bg-green-100 text-green-700">For Sale</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Art Forms</span>
                    <span className="font-medium">{artist.art_forms?.length || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Artworks</span>
                    <span className="font-medium">{artworks?.length || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upcoming Events</span>
                    <span className="font-medium">{upcomingEvents?.length || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commissions</span>
                    <span className="font-medium">
                      {artist.available_for_commission ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
