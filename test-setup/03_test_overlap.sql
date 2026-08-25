\set ON_ERROR_STOP off
select id as admin_id from public.profiles where role = 'super_admin' \gset

set role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', false);
select set_config('request.jwt.claim.sub', :'admin_id', false);

\echo '--- 既存クエストの表示時間帯と重複する新規クエストを作成(拒否されるはず) ---'
insert into public.quests
  (title, description, category, duration_seconds, points, scheduled_at, expires_at, notification_title, notification_body, status, created_by)
values
  ('重複クエスト', '既存クエストと時間帯が重なる', 'mental', 30, 5,
   now(), now() + interval '5 minutes',
   'x', 'x', 'published', :'admin_id');

\echo '--- 時間帯が重ならない新規クエストを作成(成功するはず) ---'
insert into public.quests
  (title, description, category, duration_seconds, points, scheduled_at, expires_at, notification_title, notification_body, status, created_by)
values
  ('時間がずれたクエスト', '既存クエストと重ならない', 'mental', 30, 5,
   now() + interval '1 day', now() + interval '1 day 10 minutes',
   'x', 'x', 'published', :'admin_id')
returning id, scheduled_at, expires_at;
