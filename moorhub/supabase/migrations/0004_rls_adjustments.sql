-- Allow users to view their own account_membership rows explicitly (avoid circular membership check)
do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'select memberships for self' and schemaname = 'public'
  ) then
    create policy "select memberships for self" on account_memberships
      for select using (auth.uid() = user_id);
  end if;
end;
$$;

-- (Existing policy still allows admins/members; this augments with self-read)
