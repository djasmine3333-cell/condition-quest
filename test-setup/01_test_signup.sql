-- test-setup/01_test_signup.sql
\set ON_ERROR_STOP on

-- service_roleとして実行(auth.usersへのINSERTは通常Supabase Auth経由のため、
-- ここではservice_role相当の操作として直接INSERTする)
set role postgres;

do $$
declare
  v_company_id uuid;
  v_user1 uuid := gen_random_uuid();
  v_user2 uuid := gen_random_uuid();
  v_admin uuid := gen_random_uuid();
begin
  select id into v_company_id from public.companies where company_code = 'DEMO-COMPANY';

  insert into auth.users (id, email, raw_user_meta_data)
  values (v_user1, 'employee1@example.com', jsonb_build_object('company_id', v_company_id, 'nickname', '健太'));

  insert into auth.users (id, email, raw_user_meta_data)
  values (v_user2, 'employee2@example.com', jsonb_build_object('company_id', v_company_id, 'nickname', 'ゆうこ'));

  insert into auth.users (id, email, raw_user_meta_data)
  values (v_admin, 'admin@example.com', jsonb_build_object('company_id', v_company_id, 'nickname', '管理者用'));

  -- 管理者ロールへの昇格(service_role権限が必要な操作)
  perform set_config('request.jwt.claim.role', 'service_role', true);
  update public.profiles set role = 'super_admin' where id = v_admin;
  perform set_config('request.jwt.claim.role', '', true);

  raise notice 'user1=%, user2=%, admin=%, company=%', v_user1, v_user2, v_admin, v_company_id;
end;
$$;

select id, nickname, role, company_id from public.profiles order by created_at;
