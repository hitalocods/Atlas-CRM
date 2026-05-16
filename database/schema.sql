create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  company text not null,
  email text,
  status text not null default 'lead',
  tags text[] not null default '{}',
  revenue numeric(12,2) not null default 0,
  last_contact timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'backlog',
  priority text not null default 'medium',
  deadline date,
  progress integer not null default 0 check (progress between 0 and 100),
  labels text[] not null default '{}',
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo',
  priority text not null default 'medium',
  due_at timestamptz,
  reminder_at timestamptz,
  subtasks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  kind text not null check (kind in ('income', 'expense')),
  title text not null,
  amount numeric(12,2) not null,
  category text not null,
  status text not null default 'pending',
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  encrypted_value text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  type text not null,
  title text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists clients_user_status_idx on public.clients(user_id, status);
create index if not exists projects_user_status_idx on public.projects(user_id, status);
create index if not exists tasks_user_due_idx on public.tasks(user_id, due_at);
create index if not exists finances_user_date_idx on public.finances(user_id, occurred_on desc);
create index if not exists activities_user_created_idx on public.activities(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.finances enable row level security;
alter table public.vault_items enable row level security;
alter table public.notes enable row level security;
alter table public.tags enable row level security;
alter table public.activities enable row level security;

create policy "profiles_own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "clients_own" on public.clients for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_own" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_own" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "finances_own" on public.finances for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "vault_items_own" on public.vault_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_own" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tags_own" on public.tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "activities_own" on public.activities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
