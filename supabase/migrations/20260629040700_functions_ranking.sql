-- 0007_functions_ranking.sql
-- 企業内の週次ランキングを返す。
-- ranking_opt_in = false の社員は、自分自身が呼び出した場合のみ自分の行が見える
-- （他者には一切表示されない = 完全に非表示）。
-- 生のpoints_ledger行や他社員のメールアドレス・本名は一切返さない。

create or replace function public.get_weekly_ranking()
returns table (
  rank bigint,
  nickname text,
  total_points bigint,
  is_current_user boolean
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_user_id uuid := auth.uid();
  v_company_id uuid;
  v_week_start date;
  v_week_end date;
begin
  if v_user_id is null then
    raise exception 'ログインが必要です';
  end if;

  select company_id into v_company_id from public.profiles where id = v_user_id;
  if v_company_id is null then
    return;
  end if;

  -- Postgresのdate_truncは月曜始まりの週で切り出す（ISO 8601週）
  v_week_start := date_trunc('week', (now() at time zone 'Asia/Tokyo'))::date;
  v_week_end := v_week_start + 6;

  return query
    with totals as (
      select
        p.id,
        p.nickname,
        p.ranking_opt_in,
        coalesce(sum(pl.points), 0) as total_points
      from public.profiles p
      left join public.points_ledger pl
        on pl.user_id = p.id
        and pl.is_reversed = false
        and (pl.created_at at time zone 'Asia/Tokyo')::date between v_week_start and v_week_end
      where p.company_id = v_company_id
        and (p.ranking_opt_in = true or p.id = v_user_id)
      group by p.id, p.nickname, p.ranking_opt_in
    )
    select
      rank() over (order by t.total_points desc) as rank,
      t.nickname,
      t.total_points,
      (t.id = v_user_id) as is_current_user
    from totals t
    order by t.total_points desc, t.nickname asc;
end;
$$;

revoke all on function public.get_weekly_ranking() from public, anon;
grant execute on function public.get_weekly_ranking() to authenticated;
