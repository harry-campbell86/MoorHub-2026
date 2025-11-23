-- Add contact name/email columns and keep them in sync with linked auth.users
alter table if exists contacts
  add column if not exists name text,
  add column if not exists email text;

-- Backfill from auth.users where possible
update contacts c
set
  name = coalesce(c.name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', u.email),
  email = coalesce(c.email, u.email),
  updated_at = now()
from auth.users u
where c.user_id = u.id;

-- Trigger: set name/email on contact insert/update
create or replace function public.set_contact_name_email()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  meta_name text;
  meta_email text;
begin
  if new.user_id is not null then
    select
      coalesce(new.name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', u.email),
      coalesce(new.email, u.email)
    into meta_name, meta_email
    from auth.users u
    where u.id = new.user_id;

    new.name := coalesce(meta_name, new.name);
    new.email := coalesce(meta_email, new.email);
  end if;

  if new.name is null then
    new.name := new.email;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_contacts_set_name_email on contacts;
create trigger trg_contacts_set_name_email
before insert or update on contacts
for each row execute procedure public.set_contact_name_email();

-- Trigger: when an auth user updates their profile, refresh linked contacts
create or replace function public.refresh_contacts_from_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  update contacts
  set
    name = coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    email = new.email,
    updated_at = now()
  where user_id = new.id;
  return new;
end;
$$;

drop trigger if exists trg_contacts_refresh_on_user on auth.users;
create trigger trg_contacts_refresh_on_user
after update on auth.users
for each row execute procedure public.refresh_contacts_from_user();
