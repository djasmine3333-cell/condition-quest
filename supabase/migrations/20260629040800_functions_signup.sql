-- 0008_functions_signup.sql
-- 新規登録画面は未ログイン状態(anon)で企業コードを検証する必要があるため、
-- companiesテーブルを直接公開する代わりに、company_idのみを返す関数を用意する。
-- 企業名や企業一覧そのものは公開しない。

create or replace function public.get_company_id_by_code(p_company_code text)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.companies where company_code = p_company_code;
$$;

revoke all on function public.get_company_id_by_code(text) from public;
grant execute on function public.get_company_id_by_code(text) to anon, authenticated;
