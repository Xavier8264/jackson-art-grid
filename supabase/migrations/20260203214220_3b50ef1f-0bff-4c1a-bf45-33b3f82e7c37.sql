-- Art types enum
CREATE TYPE public.art_type AS ENUM (
  'visual_arts',
  'music',
  'theater',
  'dance',
  'literary',
  'film',
  'crafts',
  'mixed_media'
);

-- Cost types enum
CREATE TYPE public.cost_type AS ENUM (
  'free',
  'pay_at_door',
  'ticketed',
  'donation'
);

-- Venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Jackson',
  state TEXT NOT NULL DEFAULT 'TN',
  zip TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  art_types art_type[] DEFAULT '{}',
  accessibility_info TEXT,
  website TEXT,
  phone TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Artists table
CREATE TABLE public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  art_forms art_type[] DEFAULT '{}',
  email TEXT,
  website TEXT,
  instagram TEXT,
  facebook TEXT,
  image_url TEXT,
  available_for_commission BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Artworks table
CREATE TABLE public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  medium TEXT,
  dimensions TEXT,
  year_created INTEGER,
  price DECIMAL(10, 2),
  for_sale BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  art_type art_type,
  cost_type cost_type DEFAULT 'free',
  ticket_price DECIMAL(10, 2),
  ticket_url TEXT,
  accessibility_notes TEXT,
  image_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event-Artists junction table
CREATE TABLE public.event_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'performer',
  UNIQUE(event_id, artist_id)
);

-- Enable RLS on all tables
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_artists ENABLE ROW LEVEL SECURITY;

-- Public read access policies (this is a public-facing platform)
CREATE POLICY "Venues are publicly readable"
ON public.venues FOR SELECT
USING (true);

CREATE POLICY "Artists are publicly readable"
ON public.artists FOR SELECT
USING (true);

CREATE POLICY "Artworks are publicly readable"
ON public.artworks FOR SELECT
USING (true);

CREATE POLICY "Events are publicly readable"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Event artists are publicly readable"
ON public.event_artists FOR SELECT
USING (true);

-- Create indexes for common queries
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_venue ON public.events(venue_id);
CREATE INDEX idx_events_art_type ON public.events(art_type);
CREATE INDEX idx_artworks_artist ON public.artworks(artist_id);
CREATE INDEX idx_event_artists_event ON public.event_artists(event_id);
CREATE INDEX idx_event_artists_artist ON public.event_artists(artist_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON public.artworks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();