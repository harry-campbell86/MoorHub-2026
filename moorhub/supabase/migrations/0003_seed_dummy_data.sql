-- Seed dummy data:
-- - 3 accounts
-- - 10 mooring sites per account
-- - 3 contacts per account (1 admin contact + 2 members)
-- All users share the same demo password: Password123!

create extension if not exists pgcrypto;

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
    crypt('Password123!'::text, extensions.gen_salt('bf')::text),
    now(),
    now(),
    now()
  from user_rows
  where not exists (
    select 1 from auth.users u where lower(u.email) = lower(user_rows.email)
  )
  returning email, id
),
existing_users as (
  select u.email, u.id
  from auth.users u
  join user_rows ur on lower(u.email) = lower(ur.email)
),
user_map as (
  select email, id from ins_users
  union all
  select email, id from existing_users where email not in (select email from ins_users)
),
consumer_user_rows (email, full_name) as (
  values
    ('daisy.consumer@test', 'Daisy Consumer'),
    ('ellis.boater@test', 'Ellis Boater'),
    ('frank.marina@test', 'Frank Marina')
),
ins_consumer_users as (
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, encrypted_password, email_confirmed_at, created_at, updated_at)
  select
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    email,
    jsonb_build_object('full_name', full_name),
    crypt('Password123!'::text, extensions.gen_salt('bf')::text),
    now(),
    now(),
    now()
  from consumer_user_rows cur
  where not exists (select 1 from auth.users u where lower(u.email) = lower(cur.email))
  returning email, id
),
existing_consumer_users as (
  select u.email, u.id
  from auth.users u
  join consumer_user_rows cur on lower(u.email) = lower(cur.email)
),
consumer_user_map as (
  select email, id from ins_consumer_users
  union all
  select email, id from existing_consumer_users where email not in (select email from ins_consumer_users)
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
  where not exists (select 1 from accounts a where a.name = ar.name)
  returning id, name
),
account_map as (
  select name, id from ins_accounts
  union all
  select a.name, a.id from accounts a join account_rows ar on ar.name = a.name
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
  insert into contacts (id, account_id, user_id, role, phone, name, email)
  select
    gen_random_uuid(),
    am.id,
    um.id,
    cr.role,
    cr.phone,
    coalesce(ur.full_name, cr.email),
    cr.email
  from contact_rows cr
  join account_map am on am.name = cr.account_name
  left join user_map um on um.email = cr.email
  left join user_rows ur on ur.email = cr.email
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
insert into mooring_sites (id, account_id, name, description, address, latitude, longitude, status)
select
  gen_random_uuid(),
  am.id,
  format('%s Site %s', am.name, gs),
  'Spacious berth with power and water hookups.',
  format('%s Harbor, Dock %s', am.name, gs),
  51.0 + (random() * 3.5), -- roughly within UK latitudes
  -4.0 + (random() * 5.0), -- roughly within UK longitudes
  'published'
from account_map am
cross join generate_series(1, 10) as gs
on conflict do nothing;

-- Dummy consumers tied to auth users
insert into consumers (id, user_id, full_name, phone)
select
  gen_random_uuid(),
  cum.id,
  cur.full_name,
  '555-400-000' || row_number() over ()
from consumer_user_map cum
join consumer_user_rows cur on cur.email = cum.email
on conflict (user_id) do nothing;
