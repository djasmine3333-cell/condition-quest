-- 0006_functions_complete_quest.sql
-- ポイント付与は必ずこの関数経由で行う。クライアント側からpoints_ledgerや
-- quest_completions / daily_quest_completionsへ直接書き込む権限は与えない（RLSで拒否）。
-- UNIQUE制約 + ON CONFLICT DO NOTHING により、連打・多重リクエスト・通信再送が
-- 発生してもポイントは1回しか付与されない（データベース制約とサーバー処理の二重防御）。

create or replace function public.complete_instant_quest(p_quest_id uuid)
returns table (success boolean, points_awarded integer, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_company_id uuid;
  v_quest public.quests;
  v_completion_id uuid;
begin
  if v_user_id is null then
    raise exception 'ログインが必要です';
  end if;

  select company_id into v_company_id from public.profiles where id = v_user_id;
  if v_company_id is null then
    return query select false, 0, '社員情報が見つかりません';
    return;
  end if;

  select * into v_quest from public.quests where id = p_quest_id for update;
  if v_quest.id is null then
    return query select false, 0, 'クエストが見つかりません';
    return;
  end if;

  if v_quest.status <> 'published'
     or now() < v_quest.scheduled_at
     or now() >= v_quest.expires_at then
    return query select false, 0, 'このクエストは現在受け付けていません';
    return;
  end if;

  insert into public.quest_completions (quest_id, user_id, company_id)
  values (p_quest_id, v_user_id, v_company_id)
  on conflict (quest_id, user_id) do nothing
  returning id into v_completion_id;

  if v_completion_id is null then
    return query select false, 0, 'このクエストは既に完了しています';
    return;
  end if;

  insert into public.points_ledger (user_id, company_id, reason_type, quest_id, points)
  values (v_user_id, v_company_id, 'instant_quest', p_quest_id, v_quest.points);

  return query select true, v_quest.points, '完了しました';
end;
$$;

revoke all on function public.complete_instant_quest(uuid) from public, anon;
grant execute on function public.complete_instant_quest(uuid) to authenticated;

-- =========================================
-- デイリークエスト完了
-- =========================================
create or replace function public.complete_daily_quest(p_daily_quest_id uuid)
returns table (success boolean, points_awarded integer, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_company_id uuid;
  v_daily_quest public.daily_quests;
  v_today date;
  v_completion_id uuid;
begin
  if v_user_id is null then
    raise exception 'ログインが必要です';
  end if;

  select company_id into v_company_id from public.profiles where id = v_user_id;
  if v_company_id is null then
    return query select false, 0, '社員情報が見つかりません';
    return;
  end if;

  select * into v_daily_quest from public.daily_quests where id = p_daily_quest_id;
  if v_daily_quest.id is null or v_daily_quest.is_active = false then
    return query select false, 0, 'クエストが見つかりません';
    return;
  end if;

  -- Asia/Tokyo基準の「今日」をDB側でも計算する（アプリ側のsrc/lib/date.tsと同じ基準）
  v_today := (now() at time zone 'Asia/Tokyo')::date;

  insert into public.daily_quest_completions (daily_quest_id, user_id, company_id, completed_date)
  values (p_daily_quest_id, v_user_id, v_company_id, v_today)
  on conflict (daily_quest_id, user_id, completed_date) do nothing
  returning id into v_completion_id;

  if v_completion_id is null then
    return query select false, 0, '本日はすでに完了しています';
    return;
  end if;

  insert into public.points_ledger (user_id, company_id, reason_type, daily_quest_id, points)
  values (v_user_id, v_company_id, 'daily_quest', p_daily_quest_id, v_daily_quest.points);

  return query select true, v_daily_quest.points, '完了しました';
end;
$$;

revoke all on function public.complete_daily_quest(uuid) from public, anon;
grant execute on function public.complete_daily_quest(uuid) to authenticated;
