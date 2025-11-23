-- Roll back geospatial search artifacts (keep existing lat/long columns)

-- Drop RPC function for radius search
drop function if exists search_mooring_sites_with_distance(double precision, double precision, double precision);

-- Drop geo index and column
drop index if exists mooring_sites_geo_gix;
alter table if exists mooring_sites drop column if exists geo;
