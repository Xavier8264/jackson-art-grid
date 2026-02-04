

# Hub for the Arts
**Digital civic infrastructure for Jackson's arts scene**

---

## Overview

A clean, modern platform that answers one question: *"What is happening right now in Jackson's arts scene?"*

Built with fully public browsing, the platform presents events, artists, venues, and artworks through five interconnected views—each offering a different lens on the same cultural ecosystem.

---

## Phase 1: Foundation & Design System

### Global Layout & Navigation
- Clean header with "Hub for the Arts" branding and secondary tagline
- Primary navigation: Calendar, Map, Gallery, Artists, Venues
- Global search bar with predictive results across all content types
- Responsive design with smooth transitions between mobile, tablet, and desktop

### Visual System
- **Primary palette**: White/off-white backgrounds with soft sky blue accents
- **Typography**: Clean, highly readable sans-serif hierarchy
- **Spacing**: Generous whitespace creating a calm, infrastructure-grade feel
- **Icons**: Minimal, informative icons for cost, format, and accessibility
- **Cards**: Consistent event/artist/venue card patterns used throughout

---

## Phase 2: Homepage

### What visitors will see:
- Minimal hero with site name + "Jackson, TN"
- Quick action buttons: Today, This Weekend, Free Events, Near Me
- Event preview feed showing upcoming cultural activities
- Small map preview showing venue clusters
- Featured artist/artwork spotlight (rotating)
- Clear paths into Calendar, Map, Gallery, Artists, Venues

---

## Phase 3: Core Views

### Calendar View
- Default agenda/list view with optional full calendar
- Day/week/month toggles
- Sky-blue visual coding for events
- Filter panel: art type, cost, date range, venue type
- Click-to-expand event details (no page reload)

### Map View (Mapbox)
- Interactive map of Jackson with venue pins
- Color-coded by art types supported
- Click venue → reveal upcoming events at that location
- Shared filtering with calendar view
- "Events near me" geolocation option

### Gallery View
- Clean, uniform grid of artworks
- Each card: artwork image, artist name, medium, price/contact info
- Commission availability indicators
- Filters: medium, price range, artist

### Artists Directory
- Grid/list of artist profiles
- Each profile: name, bio, art forms, upcoming events, external links
- Links to works in Gallery
- Simple contact option

### Venues Directory
- All cultural venues in Jackson
- Each profile: location, art types supported, accessibility info
- Upcoming events at this venue
- Recurring schedule information

---

## Phase 4: Event System & Interconnections

### Event Data Model
Each event connects to:
- One venue
- One or more artists
- Art type classification
- Cost type (free/pay at door/ticketed)
- Date, time, description, accessibility notes

### Automatic Appearances
Events entered once will automatically appear:
- On the homepage (if upcoming)
- In calendar view
- On the map (via venue)
- On artist profiles
- On venue profiles

---

## Phase 5: Search & Filtering

### Global Search
- Single search bar in header
- Searches across events, artists, venues, and artworks
- Shows categorized results with quick navigation

### Smart Filtering
- Filters persist as users navigate between views
- Clear visual indication of active filters
- Easy reset option
- Consistent filter UI across Calendar, Map, and Gallery

---

## Database Structure (Supabase)

We'll set up a backend to store:
- **Events**: title, date, time, description, cost, art type, accessibility
- **Artists**: name, bio, art forms, contact, external links
- **Venues**: name, address, coordinates, art types, accessibility
- **Artworks**: image, medium, price, commission availability
- **Relationships**: event↔artist, event↔venue, artwork↔artist

Demo data will include realistic Jackson, TN venues, local art types, and sample events.

---

## What You'll Get

✓ A beautiful, functional public-facing arts hub  
✓ Five interconnected views of Jackson's cultural scene  
✓ Interactive Mapbox integration  
✓ Responsive design for all devices  
✓ Demo data showcasing the full experience  
✓ Database ready for real content  
✓ Foundation for future admin/submission features

---

## Future Phases (Not Included Now)

- Event submission forms for artists/venues
- User accounts and moderation workflows
- Saved favorites and personalization
- Email notifications for upcoming events
- Analytics dashboard

