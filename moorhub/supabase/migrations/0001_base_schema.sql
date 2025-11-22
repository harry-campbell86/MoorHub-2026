-- Accounts: companies or individuals that list marinas/moorings
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  account_type text not null default 'company', -- company | individual
  created_by_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contacts: people tied to an account (can log in via linked user)
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  role text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contacts_account_idx on contacts (account_id);
create index if not exists contacts_user_idx on contacts (user_id);

-- Consumers: boat owners/end users (linked to auth.users)
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

-- Note: Row Level Security is not enabled yet. Add policies based on your auth model:
-- alter table accounts enable row level security;
-- alter table contacts enable row level security;
-- alter table consumers enable row level security;
-- alter table mooring_sites enable row level security;
-- Then define policies that map auth.uid() to the correct user/account memberships.
