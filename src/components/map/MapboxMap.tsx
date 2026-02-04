import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  art_types?: string[] | null;
  description?: string | null;
}

interface MapboxMapProps {
  venues?: Venue[];
  height?: string;
  interactive?: boolean;
  showControls?: boolean;
  onVenueClick?: (venue: Venue) => void;
}

const JACKSON_CENTER = { lng: -88.8139, lat: 35.6145 };

export function MapboxMap({ 
  venues, 
  height = "400px", 
  interactive = true,
  showControls = true,
  onVenueClick 
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (!token) {
      console.warn("Mapbox token not configured");
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [JACKSON_CENTER.lng, JACKSON_CENTER.lat],
      zoom: 13,
      interactive,
    });

    if (showControls && interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [interactive, showControls]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !venues) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add venue markers
    venues.forEach((venue) => {
      if (!venue.latitude || !venue.longitude) return;

      // Create custom marker element with inner container for transforms
      const el = document.createElement("div");
      el.style.cssText = `
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const innerMarker = document.createElement("div");
      innerMarker.className = "venue-marker";
      innerMarker.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, hsl(200, 80%, 55%), hsl(200, 80%, 45%));
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        transform-origin: center;
      `;
      innerMarker.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

      el.appendChild(innerMarker);

      el.addEventListener("mouseenter", () => {
        innerMarker.style.transform = "scale(1.15)";
      });
      el.addEventListener("mouseleave", () => {
        innerMarker.style.transform = "scale(1)";
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([venue.longitude, venue.latitude])
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        className: "venue-popup"
      }).setHTML(`
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 4px; font-weight: 600; color: hsl(220, 25%, 10%);">${venue.name}</h3>
          <p style="margin: 0; font-size: 12px; color: hsl(220, 10%, 45%);">${venue.address}</p>
        </div>
      `);

      marker.setPopup(popup);

      el.addEventListener("click", () => {
        if (onVenueClick) {
          onVenueClick(venue);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have venues
    if (venues.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      venues.forEach((venue) => {
        if (venue.latitude && venue.longitude) {
          bounds.extend([venue.longitude, venue.latitude]);
        }
      });
      
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, { 
          padding: 50,
          maxZoom: 14 
        });
      }
    }
  }, [venues, mapLoaded, onVenueClick]);

  return (
    <div 
      ref={mapContainer} 
      style={{ height, width: "100%" }}
      className="rounded-lg overflow-hidden"
    />
  );
}
