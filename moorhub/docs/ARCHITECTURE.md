# Architecture overview

This document captures how the MoorHub codebase is structured, how it talks to Supabase, and where to find the major UI flows.

## App router structure
- **Global layout:** `src/app/layout.tsx` injects the font stack, global styles, and persistent `Header`/`Footer` chrome around every page.
- **Landing:** `src/app/page.tsx` renders the public marketing experience with featured moorings and CTA cards.
- **Auth:** `src/app/login` and `src/app/register` include server actions for Supabase email/password auth and client forms for data collection.
- **Public mooring search:** `src/app/search/page.tsx` queries published `mooring_sites` rows from Supabase, supports a `q` search param, and lets authenticated users toggle favourites inline.
- **Mooring detail:** `src/app/moorings/[id]/page.tsx` fetches a single mooring site by slug or id for unauthenticated viewing.
- **Dashboard shell:** `src/app/dashboard/layout.tsx` enforces a Supabase session and provides navigation to profile, favourites, bookings, and mooring-site management.
- **Dashboard sections:**
  - `src/app/dashboard/page.tsx` – profile overview plus editable fields via `ProfileForm`.
  - `src/app/dashboard/favourites` – lists saved mooring sites through the `favorites` table.
  - `src/app/dashboard/bookings` – placeholder booking timeline.
  - `src/app/dashboard/mooring-sites` – list/create/update mooring site rows owned by the signed-in user.
  - `src/app/dashboard/settings` – account-level preferences and sign-out helper.

## Data & auth integration
- **Supabase clients:** `src/lib/supabase/client.ts` exposes a browser client for client components, while `src/lib/supabase/server.ts` wires cookie-aware server clients for server components and actions.
- **Session helpers:** `src/lib/auth/session.ts` fetches the Supabase session and redirects anonymous users to `/login` when guards are applied.
- **Sign-out:** `src/lib/auth/actions.ts` provides server actions for logging out and redirecting safely from forms or client-triggered submissions.
- **Favourite toggles:** `src/app/components/FavoriteToggle.tsx` calls a server action to insert/delete rows in `favorites` and refreshes the router for optimistic UI.
- **Search rendering:** `src/app/search/page.tsx` combines public mooring queries with a per-user favourites lookup to determine toggle state.

## Database expectations
Supabase migrations live in `supabase/migrations` and establish the tables and RLS policies used throughout the UI:
- `0002_accounts_contacts_consumers_moorings.sql` defines accounts, memberships, contacts, consumer profiles, and `mooring_sites` with policies allowing public reads of published sites and member-only management.
- `0011_create_favorites.sql` introduces a `favorites` table tying users to mooring sites with owner-scoped RLS policies.
- Seed data in `supabase/seed_dummy_data.sql` populates accounts, mooring sites, and related entities for local development.

## Styling conventions
- `src/app/globals.css` configures Tailwind base styles and a set of custom CSS variables used across components.
- Components favour utility classes for layout, with rounded cards, shadow presets, and colour tokens defined in CSS variables.

## Adding new features
- Use server components and server actions for Supabase mutations where possible to keep secrets off the client.
- Generate updated Supabase types into `src/types/supabase.ts` after schema changes to keep database interactions type-safe.
- When adding new dashboard pages, mount them under `src/app/dashboard` so navigation and auth guards apply automatically.
