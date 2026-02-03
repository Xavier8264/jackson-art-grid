import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Calendar, MapPin, Users, Building2, Palette, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SearchResult {
  id: string;
  type: "event" | "artist" | "venue" | "artwork";
  title: string;
  subtitle?: string;
  badge?: string;
}

interface GlobalSearchProps {
  className?: string;
  onResultClick?: () => void;
}

export function GlobalSearch({ className, onResultClick }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchTerm = `%${query}%`;

        // Search all tables in parallel
        const [eventsRes, artistsRes, venuesRes, artworksRes] = await Promise.all([
          supabase
            .from("events")
            .select("id, title, event_date, art_type")
            .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
            .limit(5),
          supabase
            .from("artists")
            .select("id, name, bio")
            .or(`name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
            .limit(5),
          supabase
            .from("venues")
            .select("id, name, address, city")
            .or(`name.ilike.${searchTerm},address.ilike.${searchTerm},description.ilike.${searchTerm}`)
            .limit(5),
          supabase
            .from("artworks")
            .select("id, title, medium, artist:artists(name)")
            .or(`title.ilike.${searchTerm},medium.ilike.${searchTerm}`)
            .limit(5),
        ]);

        const searchResults: SearchResult[] = [];

        // Map events
        eventsRes.data?.forEach((event) => {
          searchResults.push({
            id: event.id,
            type: "event",
            title: event.title,
            subtitle: format(new Date(event.event_date), "MMM d, yyyy"),
            badge: event.art_type?.replace(/_/g, " "),
          });
        });

        // Map artists
        artistsRes.data?.forEach((artist) => {
          searchResults.push({
            id: artist.id,
            type: "artist",
            title: artist.name,
            subtitle: artist.bio?.slice(0, 60) + (artist.bio && artist.bio.length > 60 ? "..." : ""),
          });
        });

        // Map venues
        venuesRes.data?.forEach((venue) => {
          searchResults.push({
            id: venue.id,
            type: "venue",
            title: venue.name,
            subtitle: `${venue.address}, ${venue.city}`,
          });
        });

        // Map artworks
        artworksRes.data?.forEach((artwork: any) => {
          searchResults.push({
            id: artwork.id,
            type: "artwork",
            title: artwork.title,
            subtitle: artwork.artist?.name,
            badge: artwork.medium,
          });
        });

        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    onResultClick?.();

    switch (result.type) {
      case "event":
        navigate("/calendar");
        break;
      case "artist":
        navigate(`/artists/${result.id}`);
        break;
      case "venue":
        navigate(`/venues/${result.id}`);
        break;
      case "artwork":
        navigate("/gallery");
        break;
    }
  };

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "event":
        return Calendar;
      case "artist":
        return Users;
      case "venue":
        return Building2;
      case "artwork":
        return Palette;
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "event":
        return "Event";
      case "artist":
        return "Artist";
      case "venue":
        return "Venue";
      case "artwork":
        return "Artwork";
    }
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<SearchResult["type"], SearchResult[]>);

  const typeOrder: SearchResult["type"][] = ["event", "venue", "artist", "artwork"];

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search events, artists, venues..."
          className="w-full pl-9 pr-9 border-primary/20 focus:border-primary"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[400px] overflow-auto rounded-lg border bg-background shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {typeOrder.map((type) => {
                const typeResults = groupedResults[type];
                if (!typeResults?.length) return null;

                return (
                  <div key={type}>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {getTypeLabel(type)}s
                    </div>
                    {typeResults.map((result, idx) => {
                      const Icon = getIcon(result.type);
                      const globalIndex = results.indexOf(result);
                      
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          className={cn(
                            "flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-muted/50 transition-colors",
                            globalIndex === selectedIndex && "bg-muted"
                          )}
                          onClick={() => handleResultClick(result)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{result.title}</p>
                            {result.subtitle && (
                              <p className="text-sm text-muted-foreground truncate">
                                {result.subtitle}
                              </p>
                            )}
                          </div>
                          {result.badge && (
                            <Badge variant="secondary" className="flex-shrink-0 text-xs capitalize">
                              {result.badge}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Search className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching for events, artists, venues, or artworks
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
