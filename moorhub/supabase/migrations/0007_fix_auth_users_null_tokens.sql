-- Fill NULL token fields in auth.users to avoid GoTrue scan errors (conditional per column so it fits any schema version)
do $$
begin
  -- text tokens
  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'confirmation_token') then
    update auth.users set confirmation_token = coalesce(confirmation_token, '');
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'recovery_token') then
    update auth.users set recovery_token = coalesce(recovery_token, '');
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'email_change_token_current') then
    update auth.users set email_change_token_current = coalesce(email_change_token_current, '');
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'email_change_token_new') then
    update auth.users set email_change_token_new = coalesce(email_change_token_new, '');
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'email_change') then
    update auth.users set email_change = coalesce(email_change, '');
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'phone_change') then
    update auth.users set phone_change = coalesce(phone_change, '');
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'phone_change_token') then
    update auth.users set phone_change_token = coalesce(phone_change_token, '');
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'reauthentication_token') then
    update auth.users set reauthentication_token = coalesce(reauthentication_token, '');
  end if;

  -- timestamps
  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'email_confirmed_at') then
    update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now());
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'phone_confirmed_at') then
    update auth.users set phone_confirmed_at = coalesce(phone_confirmed_at, now());
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'auth' and table_name = 'users' and column_name = 'phone_change_token_sent_at') then
    update auth.users set phone_change_token_sent_at = coalesce(phone_change_token_sent_at, now());
  end if;
end;
$$;
