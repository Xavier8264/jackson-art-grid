// Placeholder images for the platform
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import heroArtsFestival from "@/assets/hero-arts-festival.jpg";
import portraitImage1 from "@/assets/1.png";
import portraitImage2 from "@/assets/2.png";
import portraitImage3 from "@/assets/3.png";
import portraitImage4 from "@/assets/4.png";
import portraitImage5 from "@/assets/5.png";
import portraitImage6 from "@/assets/6.png";
import portraitImage7 from "@/assets/7.png";
import portraitImage8 from "@/assets/8.png";
import portraitImage9 from "@/assets/9.png";
import portraitImage10 from "@/assets/10.png";

export const artistImages = [artist1, artist2, artist3];
export const artworkImages = [artwork1, artwork2, artwork3];
export const portraitImages = [portraitImage1, portraitImage2, portraitImage3, portraitImage4, portraitImage5, portraitImage6, portraitImage7, portraitImage8, portraitImage9, portraitImage10];
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

// Get portrait image by index (for artists page)
export function getPortraitImage(index: number): string {
  return portraitImages[index % portraitImages.length];
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
