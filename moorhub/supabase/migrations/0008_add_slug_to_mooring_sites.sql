-- Add slug for SEO-friendly URLs
alter table mooring_sites add column if not exists slug text;
create unique index if not exists mooring_sites_slug_key on mooring_sites (slug);

-- Backfill slugs from names (simple slugify)
update mooring_sites
set slug = lower(regexp_replace(name, '[^a-z0-9]+', '-', 'g'))
where slug is null;

-- Ensure no empty slugs
update mooring_sites
set slug = concat('mooring-', id)
where slug = '' or slug is null;
