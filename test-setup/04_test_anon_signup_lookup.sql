set role anon;
\echo '--- anonとして正しい企業コードを検証(成功するはず) ---'
select public.get_company_id_by_code('DEMO-COMPANY');

\echo '--- anonとして存在しない企業コードを検証(NULLが返るはず) ---'
select public.get_company_id_by_code('NOT-EXIST');

\echo '--- anonがcompaniesテーブルを直接SELECTできないことを確認(拒否されるはず) ---'
select * from public.companies;
