import { useState, useMemo } from "react";
import { Image, Search, DollarSign, Palette, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [forSaleFilter, setForSaleFilter] = useState<string>("all");

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

  const filteredArtworks = useMemo(() => {
    if (!artworks) return [];

    return artworks.filter((artwork) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.medium?.toLowerCase().includes(searchQuery.toLowerCase());

      // For sale filter
      const matchesForSale =
        forSaleFilter === "all" ||
        (forSaleFilter === "for-sale" && artwork.for_sale) ||
        (forSaleFilter === "not-for-sale" && !artwork.for_sale);

      // Price filter
      let matchesPrice = true;
      if (priceFilter !== "all" && artwork.price) {
        const price = artwork.price;
        switch (priceFilter) {
          case "under-100":
            matchesPrice = price < 100;
            break;
          case "100-500":
            matchesPrice = price >= 100 && price <= 500;
            break;
          case "500-1000":
            matchesPrice = price > 500 && price <= 1000;
            break;
          case "over-1000":
            matchesPrice = price > 1000;
            break;
        }
      } else if (priceFilter !== "all" && !artwork.price) {
        matchesPrice = false;
      }

      return matchesSearch && matchesForSale && matchesPrice;
    });
  }, [artworks, searchQuery, forSaleFilter, priceFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceFilter("all");
    setForSaleFilter("all");
  };

  const hasActiveFilters = searchQuery || priceFilter !== "all" || forSaleFilter !== "all";

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
                {hasActiveFilters && artworks && (
                  <span className="ml-2 text-primary">
                    ({filteredArtworks.length} of {artworks.length})
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search artworks..."
                  className="w-48 pl-9 border-primary/20 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={forSaleFilter} onValueChange={setForSaleFilter}>
                <SelectTrigger className="w-32 border-primary/20">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="for-sale">For Sale</SelectItem>
                  <SelectItem value="not-for-sale">Not for Sale</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-32 border-primary/20">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="under-100">Under $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="over-1000">Over $1,000</SelectItem>
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
        ) : filteredArtworks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredArtworks.map((artwork) => (
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
        ) : hasActiveFilters ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Image className="mb-4 h-16 w-16 text-primary/30" />
              <h2 className="mb-2 text-xl font-semibold">No Matching Artworks</h2>
              <p className="max-w-md text-muted-foreground">
                No artworks match your search criteria. Try adjusting your filters.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
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
