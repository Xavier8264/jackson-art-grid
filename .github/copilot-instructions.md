# AI Copilot Instructions for Jackson Art Grid

## Project Overview

**Jackson Art Grid** is a civic digital infrastructure platform for discovering local artists, artworks, venues, and cultural events in Jackson, Tennessee. It's a Vite + React + TypeScript SPA with shadcn-ui components, Tailwind CSS styling, and Supabase as the backend.

## Architecture & Data Flow

### Tech Stack
- **Frontend**: Vite (build), React 18, TypeScript, React Router
- **UI**: shadcn-ui (Radix UI + Tailwind), Lucide icons
- **Data**: TanStack React Query (caching), Supabase (auth/data)
- **Styling**: Tailwind CSS with custom HSL color system
- **Testing**: Vitest

### Core Data Model

The app revolves around these Supabase entities:
- **artists**: Profiles with bio, contact info, art_forms array, commission status
- **artworks**: Items with artist_id reference, image_url, medium, price, for_sale flag
- **venues**: Physical locations with addresses and hours
- **events**: Calendar items with event_date, cost_type, art_type filters

Key pattern: Events filter by date ranges (today/thisWeek/thisWeekend/thisMonth) and categories (art_type, cost_type).

### Routing & Pages

Defined in [App.tsx](src/App.tsx#L1-L45):
- `/` – Home with featured content and quick action cards
- `/calendar` – Event browsing with date/category filters
- `/map` – Mapbox-based venue exploration
- `/gallery` – Artwork grid
- `/artists` & `/artists/:id` – Artist profiles
- `/venues` & `/venues/:id` – Venue details
- `/live` – Livestream container
- `*` – 404 fallback (must be last route)

## Development Workflow

### Essential Commands
```bash
npm run dev          # Vite dev server (port 8080, HMR enabled)
npm run build        # Production build → dist/
npm run build:dev    # Development build
npm run lint         # ESLint validation (react-hooks, react-refresh rules)
npm test             # Vitest (single run)
npm run test:watch   # Vitest watch mode
```

### Import Path Alias
Use `@/` for src-relative imports:
- `import { Button } from "@/components/ui/button"`
- `import { supabase } from "@/integrations/supabase/client"`
- Configured in vite.config.ts and tsconfig.json

### Supabase Integration
- Client initialized in [integrations/supabase/client.ts](src/integrations/supabase/client.ts)
- Types auto-generated in [integrations/supabase/types.ts](src/integrations/supabase/types.ts) — **do not edit manually**
- Uses localStorage for session persistence, auto-refresh enabled
- Access: `import { supabase } from "@/integrations/supabase/client"`

## Component Architecture

### Layout Structure
[Layout.tsx](src/components/layout/Layout.tsx) wraps all pages with:
- Sticky header (Header.tsx with navigation)
- Flex layout (min-h-screen) ensuring footer sticks to bottom
- Toaster (shadcn toast) + Sonner (sonner.dev toast) providers

### shadcn-ui Pattern
- Components in [components/ui/](src/components/ui/) are pre-built exports from shadcn-ui CLI
- **Do not hand-edit ui/ components** — regenerate via `npx shadcn-ui@latest add <component>`
- Use provided props for styling (className, variants)
- Example: Button with variants - `<Button variant="outline">Click</Button>`

### Data Fetching with React Query
Standard pattern across pages:
```tsx
const { data: items, isLoading } = useQuery({
  queryKey: ["artists"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("artists")
      .select("*");
    if (error) throw error;
    return data;
  }
});
```

### Custom Hooks
- [useEventFilters](src/hooks/useEventFilters.ts): Filters events by date ranges (today/thisWeek/thisWeekend/thisMonth) and categories using date-fns
- [use-toast](src/hooks/use-toast.ts): shadcn toast hook
- [use-mobile](src/hooks/use-mobile.tsx): Media query helper for responsive design

## Code Style & Conventions

### TypeScript
- Strict mode enabled (tsconfig.json)
- Unused vars rule disabled in ESLint for experimentation; clean manually or use IDE
- React component props typed explicitly: `interface ComponentProps { children: React.ReactNode; }`

### Tailwind CSS
- Custom color system uses HSL CSS variables (--primary, --secondary, etc.)
- Container max-width: 1400px, 2rem padding
- Dark mode via class strategy: `darkMode: ["class"]`
- No custom utility classes; prefer composing existing utilities

### React Patterns
- Functional components with hooks
- Event handlers use arrow functions for proper `this` binding
- Router params accessed via `useParams()` from react-router-dom
- State management: local component state + React Query for server state

## Common Tasks

### Adding a New Page
1. Create in [pages/](src/pages/) as `MyPage.tsx`
2. Add route in [App.tsx](src/App.tsx) before the catch-all `*` route
3. Use Layout wrapper (handled automatically via `<Layout>` in App)
4. Fetch data with useQuery from Supabase

### Adding a UI Component
```bash
npx shadcn-ui@latest add button  # Downloads component to ui/
```
Then import: `import { Button } from "@/components/ui/button"`

### Filtering Events
Use `useEventFilters` hook from [useEventFilters.ts](src/hooks/useEventFilters.ts):
```tsx
const filtered = useEventFilters(events, { dateRange: "thisWeek", artType: "painting" });
```

### Deploying
Build with `npm run build`, deploy `dist/` folder to Vercel, Netlify, or Node.js host.

## Important Notes

- **Supabase types**: Auto-generated; changes made in Supabase dashboard sync via migration or type regeneration
- **Date handling**: Use `date-fns` (not moment.js or Day.js)
- **Icons**: Lucide React (`lucide-react` package)
- **Environment variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` must be set
- **Responsive design**: Mobile-first Tailwind approach; check `md:` and `lg:` breakpoints for desktop layouts

