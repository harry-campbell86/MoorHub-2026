-- Seed dummy data:
-- - 3 accounts
-- - 10 mooring sites per account
-- - 3 contacts per account (1 admin contact + 2 members)
-- All users share the same demo password: Password123!

-- Ensure pgcrypto for password hashing
create extension if not exists pgcrypto;

-- Create / upsert users for contacts and admins
with user_rows (email, full_name) as (
  values
    ('ava.admin@bluewater.test', 'Ava Admin'),
    ('ben.ops@bluewater.test', 'Ben Ops'),
    ('chloe.sales@bluewater.test', 'Chloe Sales'),
    ('liam.admin@harborlight.test', 'Liam Admin'),
    ('mia.ops@harborlight.test', 'Mia Ops'),
    ('nora.sales@harborlight.test', 'Nora Sales'),
    ('oscar.admin@seabird.test', 'Oscar Admin'),
    ('piper.ops@seabird.test', 'Piper Ops'),
    ('quinn.sales@seabird.test', 'Quinn Sales')
),
ins_users as (
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, encrypted_password, email_confirmed_at, created_at, updated_at)
  select
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    email,
    jsonb_build_object('full_name', full_name),
    crypt('Password123!', gen_salt('bf')),
    now(),
    now(),
    now()
  from user_rows
  on conflict (instance_id, email) do update
    set raw_user_meta_data = excluded.raw_user_meta_data
  returning email, id
),
user_map as (
  select email, id from ins_users
),
account_rows (name, account_type, admin_email) as (
  values
    ('Bluewater Marinas', 'company', 'ava.admin@bluewater.test'),
    ('HarborLight Docks', 'company', 'liam.admin@harborlight.test'),
    ('Seabird Moorings', 'company', 'oscar.admin@seabird.test')
),
ins_accounts as (
  insert into accounts (id, name, account_type, created_by_user_id)
  select gen_random_uuid(), ar.name, ar.account_type, um.id
  from account_rows ar
  join user_map um on um.email = ar.admin_email
  on conflict (name) do update set account_type = excluded.account_type
  returning id, name
),
account_map as (
  select name, id from ins_accounts
),
contact_rows (account_name, email, role, phone, is_admin) as (
  values
    ('Bluewater Marinas', 'ava.admin@bluewater.test', 'Marina Director', '555-100-0001', true),
    ('Bluewater Marinas', 'ben.ops@bluewater.test', 'Ops Lead', '555-100-0002', false),
    ('Bluewater Marinas', 'chloe.sales@bluewater.test', 'Sales', '555-100-0003', false),
    ('HarborLight Docks', 'liam.admin@harborlight.test', 'Harbor Master', '555-200-0001', true),
    ('HarborLight Docks', 'mia.ops@harborlight.test', 'Ops', '555-200-0002', false),
    ('HarborLight Docks', 'nora.sales@harborlight.test', 'Sales', '555-200-0003', false),
    ('Seabird Moorings', 'oscar.admin@seabird.test', 'Owner', '555-300-0001', true),
    ('Seabird Moorings', 'piper.ops@seabird.test', 'Ops', '555-300-0002', false),
    ('Seabird Moorings', 'quinn.sales@seabird.test', 'Sales', '555-300-0003', false)
),
ins_contacts as (
  insert into contacts (id, account_id, user_id, role, phone)
  select
    gen_random_uuid(),
    am.id,
    um.id,
    cr.role,
    cr.phone
  from contact_rows cr
  join account_map am on am.name = cr.account_name
  left join user_map um on um.email = cr.email
  on conflict do nothing
  returning account_id, user_id, role, phone
),
ins_memberships as (
  insert into account_memberships (id, account_id, user_id, role)
  select
    gen_random_uuid(),
    am.id,
    um.id,
    case when cr.is_admin then 'admin' else 'member' end
  from contact_rows cr
  join account_map am on am.name = cr.account_name
  join user_map um on um.email = cr.email
  on conflict (account_id, user_id) do update
    set role = excluded.role
  returning account_id
)
-- Mooring sites: 10 per account
insert into mooring_sites (id, account_id, name, description, address, latitude, longitude, status)
select
  gen_random_uuid(),
  am.id,
  format('%s Site %s', am.name, gs),
  'Spacious berth with power and water hookups.',
  format('%s Harbor, Dock %s', am.name, gs),
  50.0 + (random() * 0.5),
  -1.0 + (random() * 0.5),
  'published'
from account_map am
cross join generate_series(1, 10) as gs
on conflict do nothing;
