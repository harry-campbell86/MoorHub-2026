-- Re-center dummy mooring site coordinates within the UK
update mooring_sites
set
  latitude = 51.0 + (random() * 3.5),
  longitude = -4.0 + (random() * 5.0)
where latitude is not null
  and longitude is not null;
