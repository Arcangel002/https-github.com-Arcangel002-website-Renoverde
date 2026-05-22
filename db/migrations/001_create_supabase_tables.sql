-- 001_create_supabase_tables.sql
-- Creates newsletter, contatos and agendamentos tables and RLS policies

begin;

-- Extension for UUID generation
create extension if not exists "pgcrypto";

-- NEWSLETTER
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default timezone('utc', now())
);

alter table public.newsletter enable row level security;
-- Allow anonymous clients (anon key) to INSERT newsletter subscriptions
create policy "newsletter_insert_anon" on public.newsletter
  for insert with check (auth.role() = 'anon');
-- Restrict SELECT to authenticated (or service) roles
create policy "newsletter_select_auth" on public.newsletter
  for select using (auth.role() = 'authenticated');

-- CONTATOS (contact messages)
create table if not exists public.contatos (
  id uuid primary key default gen_random_uuid(),
  nome text,
  email text,
  telefone text,
  assunto text,
  mensagem text,
  created_at timestamptz default timezone('utc', now())
);

alter table public.contatos enable row level security;
create policy "contatos_insert_anon" on public.contatos
  for insert with check (auth.role() = 'anon');
create policy "contatos_select_auth" on public.contatos
  for select using (auth.role() = 'authenticated');

-- AGENDAMENTOS (scheduling requests)
create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  nome text,
  email text,
  telefone text,
  tipo_residuo text,
  data date,
  horario text,
  mensagem text,
  status text default 'pending',
  created_at timestamptz default timezone('utc', now())
);

alter table public.agendamentos enable row level security;
create policy "agendamentos_insert_anon" on public.agendamentos
  for insert with check (auth.role() = 'anon');
create policy "agendamentos_select_auth" on public.agendamentos
  for select using (auth.role() = 'authenticated');

commit;

-- Notes:
-- 1) These RLS policies permit anonymous inserts using the Supabase anon key.
-- 2) Selecting rows is limited to authenticated users (or the service role).
-- 3) For admin consoles or server-side processing, use the Supabase Service Role key
--    (keeps it secret in Vercel env) which bypasses RLS.
