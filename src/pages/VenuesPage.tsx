import { useState, useMemo } from "react";
import { Building2, Search, MapPin, Phone, Globe, Accessibility } from "lucide-react";
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

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [artTypeFilter, setArtTypeFilter] = useState<string>("all");
  const [accessibilityFilter, setAccessibilityFilter] = useState<string>("all");

  const { data: venues, isLoading } = useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredVenues = useMemo(() => {
    if (!venues) return [];

    return venues.filter((venue) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Art type filter
      const matchesArtType =
        artTypeFilter === "all" ||
        (venue.art_types && venue.art_types.includes(artTypeFilter as any));

      // Accessibility filter
      const matchesAccessibility =
        accessibilityFilter === "all" ||
        (accessibilityFilter === "accessible" && venue.accessibility_info) ||
        (accessibilityFilter === "not-specified" && !venue.accessibility_info);

      return matchesSearch && matchesArtType && matchesAccessibility;
    });
  }, [venues, searchQuery, artTypeFilter, accessibilityFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setArtTypeFilter("all");
    setAccessibilityFilter("all");
  };

  const hasActiveFilters = searchQuery || artTypeFilter !== "all" || accessibilityFilter !== "all";

  const formatArtType = (artType: string) => {
    return artTypeLabels[artType] || artType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-r from-sky-light/50 to-primary/5 py-8">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Venues</h1>
              <p className="text-muted-foreground">
                Find cultural spaces across Jackson
                {hasActiveFilters && venues && (
                  <span className="ml-2 text-primary">
                    ({filteredVenues.length} of {venues.length})
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search venues..."
                  className="w-48 pl-9 border-primary/20 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={artTypeFilter} onValueChange={setArtTypeFilter}>
                <SelectTrigger className="w-36 border-primary/20">
                  <SelectValue placeholder="Art Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Constants.public.Enums.art_type.map((type) => (
                    <SelectItem key={type} value={type}>
                      {artTypeLabels[type] || type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={accessibilityFilter} onValueChange={setAccessibilityFilter}>
                <SelectTrigger className="w-40 border-primary/20">
                  <SelectValue placeholder="Accessibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Venues</SelectItem>
                  <SelectItem value="accessible">Has Info</SelectItem>
                  <SelectItem value="not-specified">Not Specified</SelectItem>
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
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
                  <div className="mt-4 h-20 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVenues.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredVenues.map((venue) => (
              <Card 
                key={venue.id} 
                className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-sky-light text-primary">
                      <Building2 className="h-7 w-7" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                        {venue.name}
                      </h3>
                      <p className="mt-1 flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {venue.address}, {venue.city}, {venue.state} {venue.zip}
                      </p>
                    </div>
                  </div>
                  
                  {venue.description && (
                    <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                      {venue.description}
                    </p>
                  )}
                  
                  {/* Art types */}
                  {venue.art_types && venue.art_types.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {venue.art_types.map((type: string) => (
                        <Badge 
                          key={type} 
                          variant="outline" 
                          className="border-primary/30 text-primary"
                        >
                          {formatArtType(type)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Accessibility */}
                  {venue.accessibility_info && (
                    <div className="mt-4 flex items-start gap-2 rounded-md bg-sky-light/30 p-3 text-sm">
                      <Accessibility className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{venue.accessibility_info}</span>
                    </div>
                  )}
                  
                  {/* Contact */}
                  <div className="mt-4 flex gap-2">
                    {venue.website && (
                      <Button size="sm" variant="outline" className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground" asChild>
                        <a href={venue.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Website
                        </a>
                      </Button>
                    )}
                    {venue.phone && (
                      <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
                        <a href={`tel:${venue.phone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          {venue.phone}
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hasActiveFilters ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Building2 className="mb-4 h-16 w-16 text-primary/30" />
              <h2 className="mb-2 text-xl font-semibold">No Matching Venues</h2>
              <p className="max-w-md text-muted-foreground">
                No venues match your search criteria. Try adjusting your filters.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Building2 className="mb-4 h-16 w-16 text-primary/30" />
              <h2 className="mb-2 text-xl font-semibold">No Venues Yet</h2>
              <p className="max-w-md text-muted-foreground">
                Venue listings will appear here once they are added.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
