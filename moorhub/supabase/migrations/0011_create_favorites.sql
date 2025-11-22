-- Favorites table linking users to mooring sites
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mooring_site_id uuid not null references mooring_sites (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, mooring_site_id)
);

alter table favorites enable row level security;

-- Policies: users manage their own favorites
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'favorites_select_own' and tablename = 'favorites') then
    create policy "favorites_select_own"
      on favorites for select
      using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'favorites_insert_own' and tablename = 'favorites') then
    create policy "favorites_insert_own"
      on favorites for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'favorites_delete_own' and tablename = 'favorites') then
    create policy "favorites_delete_own"
      on favorites for delete
      using (auth.uid() = user_id);
  end if;
end;
$$;
