-- Enable PostGIS for geospatial search
create extension if not exists postgis;

-- Add derived geography column for radius queries
alter table mooring_sites
  add column if not exists geo geography(Point, 4326)
    generated always as (
      case
        when latitude is not null and longitude is not null then st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
        else null
      end
    ) stored;

create index if not exists mooring_sites_geo_gix
  on mooring_sites
  using gist (geo);

-- Search mooring sites within a radius (meters)
create or replace function search_mooring_sites_with_distance(
  lat double precision,
  lng double precision,
  radius_m double precision
)
returns table (
  id uuid,
  name text,
  description text,
  address text,
  status text,
  account_id uuid,
  slug text,
  latitude double precision,
  longitude double precision,
  distance_m double precision
)
language sql
security definer
set search_path = public, auth
as $$
  select
    ms.id,
    ms.name,
    ms.description,
    ms.address,
    ms.status,
    ms.account_id,
    ms.slug,
    ms.latitude,
    ms.longitude,
    st_distance(
      ms.geo,
      st_setsrid(st_makepoint(lng, lat), 4326)::geography
    ) as distance_m
  from mooring_sites ms
  where ms.geo is not null
    and st_dwithin(
          ms.geo,
          st_setsrid(st_makepoint(lng, lat), 4326)::geography,
          radius_m
        )
  order by distance_m;
$$;
