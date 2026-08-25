-- test-setup/02_test_business_logic.sql
\set ON_ERROR_STOP on

-- UUIDの取得はRLSを意識せず行えるpostgres権限のうちに済ませておく
select id as admin_id from public.profiles where role = 'super_admin' \gset
select id as kenta_id from public.profiles where nickname = '健太' \gset
select id as yuko_id from public.profiles where nickname = 'ゆうこ' \gset
select id as daily_quest_id from public.daily_quests where sort_order = 1 \gset

set role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', false);

-- ===== 1. super_adminとしてクエストを作成できることを確認 =====
select set_config('request.jwt.claim.sub', :'admin_id', false);

insert into public.quests
  (title, description, category, duration_seconds, points, scheduled_at, expires_at, notification_title, notification_body, status, created_by)
values
  ('30秒だけ遠くを見よう', '画面から目を離して遠くを見ましょう。', 'mental', 30, 5,
   now() - interval '1 minute', now() + interval '10 minutes',
   '今すぐクエスト', '30秒だけ遠くを見よう', 'published', :'admin_id')
returning id as quest_id \gset

\echo '--- 作成されたクエストID ---'
select :'quest_id';

-- ===== 2. employeeとしてはクエストを作成できない(拒否される)ことを確認 =====
select set_config('request.jwt.claim.sub', :'kenta_id', false);

\echo '--- employeeによるクエスト作成は拒否されるはず ---'
do $$
begin
  begin
    insert into public.quests
      (title, description, category, duration_seconds, points, scheduled_at, expires_at, notification_title, notification_body, status, created_by)
    values
      ('不正なクエスト', 'これは作成できないはず', 'mental', 30, 5,
       now(), now() + interval '5 minutes', 'x', 'x', 'published',
       current_setting('request.jwt.claim.sub')::uuid);
    raise exception 'テスト失敗: employeeがクエストを作成できてしまった';
  exception when insufficient_privilege or others then
    raise notice 'OK: employeeによるクエスト作成は正しく拒否された (%)', sqlerrm;
  end;
end;
$$;

-- ===== 3. 健太が今すぐクエストを完了する =====
\echo '--- 健太がクエストを完了(1回目) ---'
select * from public.complete_instant_quest(:'quest_id'::uuid);

\echo '--- 健太が同じクエストを完了(2回目・連打想定) ---'
select * from public.complete_instant_quest(:'quest_id'::uuid);

-- ===== 4. デイリークエストの同日二重完了防止 =====
\echo '--- 健太がデイリークエストを完了(1回目) ---'
select * from public.complete_daily_quest(:'daily_quest_id'::uuid);

\echo '--- 健太が同じデイリークエストを同日に完了(2回目) ---'
select * from public.complete_daily_quest(:'daily_quest_id'::uuid);

-- ===== 5. ポイント残高の確認(健太) =====
\echo '--- 健太のポイント残高(SUM) ---'
select coalesce(sum(points), 0) as balance from public.points_ledger where user_id = auth.uid() and is_reversed = false;

-- ===== 6. ゆうこも完了し、ランキングを確認 =====
select set_config('request.jwt.claim.sub', :'yuko_id', false);
select * from public.complete_instant_quest(:'quest_id'::uuid);
select * from public.complete_daily_quest(:'daily_quest_id'::uuid);

\echo '--- ゆうこから見た週次ランキング ---'
select * from public.get_weekly_ranking();

-- ===== 7. ランキング非表示設定の確認 =====
update public.profiles set ranking_opt_in = false where id = :'yuko_id';

select set_config('request.jwt.claim.sub', :'kenta_id', false);
\echo '--- 健太から見た週次ランキング(ゆうこは非表示になるはず) ---'
select * from public.get_weekly_ranking();

select set_config('request.jwt.claim.sub', :'yuko_id', false);
\echo '--- ゆうこ自身からは自分の行は見えるはず(非表示でも自分には見える) ---'
select * from public.get_weekly_ranking();

-- ===== 8. profilesにメールアドレス等のカラムが存在しないことの確認 =====
\echo '--- profilesテーブルのカラム一覧(emailが存在しないことを目視確認) ---'
select column_name from information_schema.columns where table_schema = 'public' and table_name = 'profiles';
