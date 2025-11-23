-- Accounts table (already defined in 0001, add defaults/indices if missing)
alter table if exists accounts
  alter column id set default gen_random_uuid(),
  alter column created_at set default now(),
  alter column updated_at set default now();

-- Account memberships: link users to accounts with roles
create table if not exists account_memberships (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  unique (account_id, user_id)
);
create index if not exists account_memberships_account_idx on account_memberships (account_id);
create index if not exists account_memberships_user_idx on account_memberships (user_id);

-- Helper functions for membership checks (after memberships table exists)
create or replace function public.is_account_member(acc_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from account_memberships m
    where m.account_id = acc_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_account_admin(acc_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from account_memberships m
    where m.account_id = acc_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
  );
$$;

-- Trigger: when a user creates an account, make them an admin member automatically
create or replace function public.add_creator_as_admin()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if new.created_by_user_id is not null then
    insert into account_memberships (account_id, user_id, role)
    values (new.id, new.created_by_user_id, 'admin')
    on conflict (account_id, user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_accounts_add_creator_as_admin on accounts;
create trigger trg_accounts_add_creator_as_admin
after insert on accounts
for each row execute procedure public.add_creator_as_admin();

-- Contacts: linked to accounts and optionally to auth.users
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  role text,
  phone text,
  name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contacts_account_idx on contacts (account_id);
create index if not exists contacts_user_idx on contacts (user_id);

-- Consumers: boat owners linked 1:1 to auth.users
create table if not exists consumers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists consumers_user_idx on consumers (user_id);

-- Mooring sites owned by accounts
create table if not exists mooring_sites (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  name text not null,
  description text,
  address text,
  latitude double precision,
  longitude double precision,
  status text default 'draft', -- draft | published | archived
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists mooring_sites_account_idx on mooring_sites (account_id);
create index if not exists mooring_sites_status_idx on mooring_sites (status);

-- Enable Row Level Security
alter table accounts enable row level security;
alter table account_memberships enable row level security;
alter table contacts enable row level security;
alter table consumers enable row level security;
alter table mooring_sites enable row level security;

-- Policies
-- Accounts
create policy "select accounts for members" on accounts
  for select using (public.is_account_member(id));
create policy "insert accounts for authenticated" on accounts
  for insert with check (created_by_user_id = auth.uid());
create policy "update accounts for admins" on accounts
  for update using (public.is_account_admin(id));
create policy "delete accounts for admins" on accounts
  for delete using (public.is_account_admin(id));

-- Account memberships
create policy "select memberships for members" on account_memberships
  for select using (public.is_account_member(account_id));
create policy "manage memberships for admins" on account_memberships
  using (public.is_account_admin(account_id))
  with check (public.is_account_admin(account_id));

-- Contacts
create policy "select contacts for members" on contacts
  for select using (public.is_account_member(account_id));
create policy "manage contacts for admins" on contacts
  using (public.is_account_admin(account_id))
  with check (public.is_account_admin(account_id));

-- Consumers (user-owned)
create policy "manage own consumer row" on consumers
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Mooring sites
create policy "select mooring_sites for members or published" on mooring_sites
  for select using (public.is_account_member(account_id) or status = 'published');
create policy "manage mooring_sites for members" on mooring_sites
  using (public.is_account_member(account_id))
  with check (public.is_account_member(account_id));
