#!/usr/bin/env bash
# test-setup/run-all.sh
#
# マイグレーション・RLS・RPC関数(二重付与防止・ランキング・重複予約禁止)を
# ローカルPostgreSQLに対して検証するスクリプト。
#
# 本来は `supabase start` (Docker) でSupabaseのローカルスタックを使うべきだが、
# Docker非対応の環境でも検証できるよう、auth schema/ロールを最小限モックして
# 同等のテストを行う(test-setup/00_mock_supabase_auth.sql)。
#
# 実プロジェクトに対する検証は、Docker環境で
#   supabase start && supabase db reset
# を実行し、改めてRLS/RPCの挙動を確認することを推奨する。

set -euo pipefail

DB_NAME="condition_quest_test"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> テスト用データベースを再作成: $DB_NAME"
dropdb --if-exists "$DB_NAME"
createdb "$DB_NAME"

echo "==> Supabase auth スキーマのモックを適用"
psql -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/00_mock_supabase_auth.sql" > /dev/null

echo "==> マイグレーションを適用"
for f in "$PROJECT_ROOT"/supabase/migrations/*.sql; do
  echo "    - $(basename "$f")"
  psql -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$f" > /dev/null
done

echo "==> シードデータを投入"
psql -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$PROJECT_ROOT/supabase/seed.sql" > /dev/null

echo "==> サインアップ(ユーザー作成)テスト"
psql -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/01_test_signup.sql"

echo "==> 業務ロジック(RLS・二重付与防止・ランキング)テスト"
psql -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/02_test_business_logic.sql"

echo "==> 今すぐクエストの重複予約禁止テスト"
psql -d "$DB_NAME" -f "$SCRIPT_DIR/03_test_overlap.sql"

echo "==> anonユーザーによる企業コード検証テスト"
psql -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$SCRIPT_DIR/04_test_anon_signup_lookup.sql"

echo "==> すべてのDB層テストが完了しました"
