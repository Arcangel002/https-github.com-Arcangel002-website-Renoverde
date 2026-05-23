Supabase schema migrations

Files in this folder are SQL migrations intended to be run in the Supabase SQL
Editor (https://app.supabase.com → your project → SQL Editor → New query).

Run order:
- 001_create_supabase_tables.sql — creates `newsletter`, `contatos`, and `agendamentos` tables and Row-Level Security policies.

Security recommendations:
- Use the Supabase Service Role key on server-side endpoints only. Do NOT expose the
  Service Role key to client-side code or commit it to the repo.
- Keep the publishable `anon` key for client-side inserts only and rely on RLS policies
  to limit what anon users can do.

After running the migration, test form submissions from the site and verify rows
appear in the table using the Supabase Table Editor or SQL queries.
