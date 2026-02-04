import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, Search, Palette, Mail, Globe, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Constants } from "@/integrations/supabase/types";
import { getArtistPlaceholder, getPortraitImage } from "@/lib/placeholder-images";

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

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [artFormFilter, setArtFormFilter] = useState<string>("all");
  const [commissionFilter, setCommissionFilter] = useState<string>("all");

  const { data: artists, isLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredArtists = useMemo(() => {
    if (!artists) return [];

    return artists.filter((artist) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      // Art form filter
      const matchesArtForm =
        artFormFilter === "all" ||
        (artist.art_forms && artist.art_forms.includes(artFormFilter as any));

      // Commission filter
      const matchesCommission =
        commissionFilter === "all" ||
        (commissionFilter === "available" && artist.available_for_commission) ||
        (commissionFilter === "not-available" && !artist.available_for_commission);

      return matchesSearch && matchesArtForm && matchesCommission;
    });
  }, [artists, searchQuery, artFormFilter, commissionFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setArtFormFilter("all");
    setCommissionFilter("all");
  };

  const hasActiveFilters = searchQuery || artFormFilter !== "all" || commissionFilter !== "all";

  const formatArtForm = (artForm: string) => {
    return artTypeLabels[artForm] || artForm.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-r from-sky-light/50 to-primary/5 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
              <p className="text-muted-foreground">
                Meet Jackson's creative community
                {hasActiveFilters && artists && (
                  <span className="ml-2 text-primary">
                    ({filteredArtists.length} of {artists.length})
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search artists..."
                  className="w-48 pl-9 border-primary/20 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={artFormFilter} onValueChange={setArtFormFilter}>
                <SelectTrigger className="w-36 border-primary/20">
                  <SelectValue placeholder="Art Form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Art Forms</SelectItem>
                  {Constants.public.Enums.art_type.map((type) => (
                    <SelectItem key={type} value={type}>
                      {artTypeLabels[type] || type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={commissionFilter} onValueChange={setCommissionFilter}>
                <SelectTrigger className="w-40 border-primary/20">
                  <SelectValue placeholder="Commission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Artists</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="not-available">Not Available</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="mb-4 h-16 w-16 rounded-full bg-muted" />
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="mt-2 h-4 w-full rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArtists.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArtists.map((artist, index) => (
              <Link key={artist.id} to={`/artists/${artist.id}`}>
                <Card 
                  className="group h-full overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    {/* Avatar */}
                    <div className="mb-4 h-20 w-20 overflow-hidden rounded-full">
                      <img 
                        src={getPortraitImage(index)} 
                        alt={artist.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                      {artist.name}
                    </h3>
                  
                  {artist.bio && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {artist.bio}
                    </p>
                  )}
                  
                  {/* Art forms */}
                  {artist.art_forms && artist.art_forms.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {artist.art_forms.map((form: string) => (
                        <Badge 
                          key={form} 
                          variant="secondary" 
                          className="bg-sky-light/50 text-sky-dark"
                        >
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
                  
                  {/* Links */}
                  <div className="mt-4 flex gap-2">
                    {artist.website && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                        <a href={artist.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {artist.instagram && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                        <a href={`https://instagram.com/${artist.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {artist.email && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                        <a href={`mailto:${artist.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        ) : hasActiveFilters ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Users className="mb-4 h-16 w-16 text-primary/30" />
              <h2 className="mb-2 text-xl font-semibold">No Matching Artists</h2>
              <p className="max-w-md text-muted-foreground">
                No artists match your search criteria. Try adjusting your filters.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Users className="mb-4 h-16 w-16 text-primary/30" />
              <h2 className="mb-2 text-xl font-semibold">No Artists Yet</h2>
              <p className="max-w-md text-muted-foreground">
                Artist profiles will appear here once they are added.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
