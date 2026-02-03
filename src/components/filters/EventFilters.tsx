import { useState } from "react";
import { Filter, X, Calendar, DollarSign, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Constants } from "@/integrations/supabase/types";

export interface EventFilterState {
  artTypes: string[];
  costTypes: string[];
  dateRange: "all" | "today" | "thisWeek" | "thisWeekend" | "thisMonth";
  freeOnly: boolean;
}

interface EventFiltersProps {
  filters: EventFilterState;
  onFiltersChange: (filters: EventFilterState) => void;
}

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

const costTypeLabels: Record<string, string> = {
  free: "Free",
  donation: "Donation",
  ticketed: "Ticketed",
  pay_at_door: "Pay at Door",
};

const dateRangeLabels: Record<string, string> = {
  all: "All Dates",
  today: "Today",
  thisWeek: "This Week",
  thisWeekend: "This Weekend",
  thisMonth: "This Month",
};

export function EventFilters({ filters, onFiltersChange }: EventFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeFilterCount =
    filters.artTypes.length +
    filters.costTypes.length +
    (filters.dateRange !== "all" ? 1 : 0) +
    (filters.freeOnly ? 1 : 0);

  const toggleArtType = (artType: string) => {
    const newArtTypes = filters.artTypes.includes(artType)
      ? filters.artTypes.filter((t) => t !== artType)
      : [...filters.artTypes, artType];
    onFiltersChange({ ...filters, artTypes: newArtTypes });
  };

  const toggleCostType = (costType: string) => {
    const newCostTypes = filters.costTypes.includes(costType)
      ? filters.costTypes.filter((t) => t !== costType)
      : [...filters.costTypes, costType];
    onFiltersChange({ ...filters, costTypes: newCostTypes });
  };

  const setDateRange = (dateRange: EventFilterState["dateRange"]) => {
    onFiltersChange({ ...filters, dateRange });
  };

  const clearFilters = () => {
    onFiltersChange({
      artTypes: [],
      costTypes: [],
      dateRange: "all",
      freeOnly: false,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs" variant="default">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Filters
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  Clear all
                </Button>
              )}
            </SheetTitle>
            <SheetDescription>
              Narrow down events by type, cost, and date
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Date Range */}
            <div>
              <Label className="mb-3 flex items-center text-sm font-medium">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                Date Range
              </Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dateRangeLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={filters.dateRange === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange(key as EventFilterState["dateRange"])}
                    className={
                      filters.dateRange === key
                        ? ""
                        : "border-primary/20 hover:border-primary"
                    }
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Art Types */}
            <div>
              <Label className="mb-3 flex items-center text-sm font-medium">
                <Palette className="mr-2 h-4 w-4 text-primary" />
                Art Type
              </Label>
              <div className="space-y-2">
                {Constants.public.Enums.art_type.map((artType) => (
                  <div key={artType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`art-${artType}`}
                      checked={filters.artTypes.includes(artType)}
                      onCheckedChange={() => toggleArtType(artType)}
                    />
                    <Label
                      htmlFor={`art-${artType}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {artTypeLabels[artType] || artType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Cost Types */}
            <div>
              <Label className="mb-3 flex items-center text-sm font-medium">
                <DollarSign className="mr-2 h-4 w-4 text-primary" />
                Cost
              </Label>
              <div className="space-y-2">
                {Constants.public.Enums.cost_type.map((costType) => (
                  <div key={costType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cost-${costType}`}
                      checked={filters.costTypes.includes(costType)}
                      onCheckedChange={() => toggleCostType(costType)}
                    />
                    <Label
                      htmlFor={`cost-${costType}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {costTypeLabels[costType] || costType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.dateRange !== "all" && (
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
              {dateRangeLabels[filters.dateRange]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setDateRange("all")}
              />
            </Badge>
          )}
          {filters.artTypes.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1 bg-primary/10 text-primary">
              {artTypeLabels[type] || type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArtType(type)}
              />
            </Badge>
          ))}
          {filters.costTypes.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1 bg-primary/10 text-primary">
              {costTypeLabels[type] || type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleCostType(type)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export const defaultEventFilters: EventFilterState = {
  artTypes: [],
  costTypes: [],
  dateRange: "all",
  freeOnly: false,
};
