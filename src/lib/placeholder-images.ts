// Placeholder images for the platform
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import heroArtsFestival from "@/assets/hero-arts-festival.jpg";

export const artistImages = [artist1, artist2, artist3];
export const artworkImages = [artwork1, artwork2, artwork3];
export const heroImage = heroArtsFestival;

// Get a consistent placeholder image based on an ID
export function getArtistPlaceholder(id: string): string {
  const index = Math.abs(hashCode(id)) % artistImages.length;
  return artistImages[index];
}

export function getArtworkPlaceholder(id: string): string {
  const index = Math.abs(hashCode(id)) % artworkImages.length;
  return artworkImages[index];
}

// Simple hash function for consistent image assignment
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
