# MoorHub

MoorHub is a Next.js 14 application for discovering, favouriting, and managing long-stay boat moorings. It provides a marketing homepage, public mooring search, and a Supabase-backed dashboard for owners and marinas.

## Tech stack
- **Framework:** Next.js App Router with TypeScript and React 18
- **Styling:** Tailwind CSS with project-specific tokens in `globals.css`
- **Data layer:** Supabase for auth, Postgres, RLS policies, and migrations (stored in `supabase/migrations`)

## Getting started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Environment variables**
   Create a `.env.local` file with your Supabase project credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...   # Supabase project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # Supabase anon/public key
   ```
3. **Database**
   - Run Supabase locally with `supabase start` (requires the Supabase CLI) and apply migrations from `supabase/migrations`.
   - The schema includes accounts, consumer profiles, mooring sites, and favourites with row-level security. Seed data is available in `supabase/seed_dummy_data.sql`.
4. **Run the app**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to access the UI.

## Project structure
- `src/app/layout.tsx` – Global layout that wires fonts, header, and footer around all pages.
- `src/app/page.tsx` – Marketing/landing experience for mooring discovery.
- `src/app/search` – Public mooring search with Supabase-backed listings and favourite toggles.
- `src/app/moorings/[id]` – Individual mooring site details fetched from Supabase.
- `src/app/login` and `src/app/register` – Auth flows built with Supabase server actions.
- `src/app/dashboard` – Authenticated area (requires Supabase session) for profile editing, favourites, bookings, and mooring site management.
- `src/lib/supabase` – Thin wrappers for client/server Supabase clients that sync auth cookies.
- `src/lib/auth` – Session helpers and server actions for sign-out and guarded routes.
- `supabase/migrations` – Database DDL and policies; `supabase/seed_dummy_data.sql` provides starter content.

## Development notes
- Supabase types are stubbed in `src/types/supabase.ts`; generate real types with `supabase gen types typescript --project-id <id> --schema public > src/types/supabase.ts`.
- Client components rely on the Supabase browser client for live auth state (see `Header` and `FavoriteToggle`).
- Row-level security policies restrict access to published mooring sites for anonymous users and enforce per-user favourites.

## Further reading
See `docs/ARCHITECTURE.md` for a deeper walkthrough of routes, data flows, and auth boundaries.
