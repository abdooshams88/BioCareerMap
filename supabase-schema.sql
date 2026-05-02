-- BioCareerMap Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  university text,
  year_of_study text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users
alter table public.users enable row level security;

-- Users can view and update their own data
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- 2. Profiles table (onboarding and assessment data)
create table if not exists public.profiles (
  user_id uuid references public.users on delete cascade not null primary key,
  swot_results jsonb default '{}'::jsonb,
  career_tracks jsonb default '[]'::jsonb,
  skill_grid jsonb default '{}'::jsonb,
  completed_onboarding boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Users can only access their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- 3. POW Vault (Proof of Work)
create table if not exists public.pow_vault (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  type text check (type in ('internship', 'course', 'research', 'certificate', 'lab_report', 'project')) not null,
  description text,
  organization text,
  supervisor text,
  achievement_date date,
  upload_url text,
  verification_code text unique,
  verified boolean default false,
  employer_feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on pow_vault
alter table public.pow_vault enable row level security;

-- Users can manage their own POW entries
create policy "Users can view own POW"
  on public.pow_vault for select
  using (auth.uid() = user_id);

create policy "Users can insert own POW"
  on public.pow_vault for insert
  with check (auth.uid() = user_id);

create policy "Users can update own POW"
  on public.pow_vault for update
  using (auth.uid() = user_id);

create policy "Users can delete own POW"
  on public.pow_vault for delete
  using (auth.uid() = user_id);

-- 4. Company Reviews
create table if not exists public.company_reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  company_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  salary_range text,
  review_text text,
  red_flags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on company_reviews
alter table public.company_reviews enable row level security;

-- Anyone can view reviews
create policy "Anyone can view reviews"
  on public.company_reviews for select
  using (true);

-- Users can create reviews
create policy "Users can insert reviews"
  on public.company_reviews for insert
  with check (auth.uid() = user_id);

-- Users can update their own reviews
create policy "Users can update own reviews"
  on public.company_reviews for update
  using (auth.uid() = user_id);

-- Users can delete their own reviews
create policy "Users can delete own reviews"
  on public.company_reviews for delete
  using (auth.uid() = user_id);

-- 5. Mistakes Archive
create table if not exists public.mistakes_archive (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  story text not null,
  lesson_learned text not null,
  upvotes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on mistakes_archive
alter table public.mistakes_archive enable row level security;

-- Anyone can view mistakes
create policy "Anyone can view mistakes"
  on public.mistakes_archive for select
  using (true);

-- Users can create mistake entries
create policy "Users can insert mistakes"
  on public.mistakes_archive for insert
  with check (auth.uid() = user_id);

-- Users can update their own mistakes
create policy "Users can update own mistakes"
  on public.mistakes_archive for update
  using (auth.uid() = user_id);

-- Users can delete their own mistakes
create policy "Users can delete own mistakes"
  on public.mistakes_archive for delete
  using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_pow_vault_user_id on public.pow_vault(user_id);
create index if not exists idx_company_reviews_user_id on public.company_reviews(user_id);
create index if not exists idx_company_reviews_company on public.company_reviews(company_name);
create index if not exists idx_mistakes_user_id on public.mistakes_archive(user_id);
create index if not exists idx_mistakes_created_at on public.mistakes_archive(created_at desc);

-- Updated at trigger for profiles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
