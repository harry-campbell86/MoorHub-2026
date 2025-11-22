-- Regenerate slugs with nicer casing (retain letters/numbers, trim hyphens)
update mooring_sites
set slug = case
  when regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g') ~ '^[\\-]+$' then concat('mooring-', id)
  else regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g')
end
where slug is null or slug = '' or slug like '-%' or slug like '%--%';

-- Ensure uniqueness by appending id if needed
update mooring_sites m
set slug = concat(m.slug, '-', substr(m.id::text, 1, 6))
from (
  select slug, array_agg(id) ids
  from mooring_sites
  group by slug
  having count(*) > 1
) d
where m.slug = d.slug;
