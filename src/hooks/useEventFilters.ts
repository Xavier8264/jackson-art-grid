import { useMemo } from "react";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSaturday, isSunday, nextSaturday, addDays } from "date-fns";
import { EventFilterState } from "@/components/filters/EventFilters";

interface Event {
  id: string;
  event_date: string;
  art_type?: string | null;
  cost_type?: string | null;
  [key: string]: unknown;
}

export function useEventFilters<T extends Event>(
  events: T[] | undefined,
  filters: EventFilterState
): T[] {
  return useMemo(() => {
    if (!events) return [];

    let filtered = [...events];

    // Filter by date range
    if (filters.dateRange !== "all") {
      const today = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (filters.dateRange) {
        case "today":
          startDate = startOfDay(today);
          endDate = endOfDay(today);
          break;
        case "thisWeek":
          startDate = startOfDay(today);
          endDate = endOfWeek(today, { weekStartsOn: 0 });
          break;
        case "thisWeekend":
          // Weekend = Saturday and Sunday
          if (isSaturday(today)) {
            startDate = startOfDay(today);
          } else if (isSunday(today)) {
            startDate = startOfDay(today);
          } else {
            startDate = startOfDay(nextSaturday(today));
          }
          endDate = endOfDay(addDays(startDate, isSunday(today) ? 0 : 1));
          break;
        case "thisMonth":
          startDate = startOfDay(today);
          endDate = endOfMonth(today);
          break;
        default:
          startDate = new Date(0);
          endDate = new Date(9999, 11, 31);
      }

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.event_date);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }

    // Filter by art types
    if (filters.artTypes.length > 0) {
      filtered = filtered.filter(
        (event) => event.art_type && filters.artTypes.includes(event.art_type)
      );
    }

    // Filter by cost types
    if (filters.costTypes.length > 0) {
      filtered = filtered.filter(
        (event) => event.cost_type && filters.costTypes.includes(event.cost_type)
      );
    }

    // Filter free only
    if (filters.freeOnly) {
      filtered = filtered.filter((event) => event.cost_type === "free");
    }

    return filtered;
  }, [events, filters]);
}
