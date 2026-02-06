-- PodifyAI Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create conversions table
create table conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  pdf_url text,
  audio_url text,
  script text,
  style text not null check (style in ('quick', 'summary', 'deep')),
  voice text not null,
  duration_seconds int,
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  created_at timestamptz default now()
);

-- Create usage tracking table
create table usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  month text not null,
  count int default 0,
  created_at timestamptz default now(),
  unique(user_id, month)
);

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', true);
insert into storage.buckets (id, name, public) values ('audio', 'audio', true);

-- Set up Row Level Security
alter table conversions enable row level security;
alter table usage enable row level security;

-- Conversions policies
create policy "Users can view their own conversions"
  on conversions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own conversions"
  on conversions for insert
  with check (auth.uid() = user_id);

create policy "Service role can update conversions"
  on conversions for update
  using (true);

-- Usage policies
create policy "Users can view their own usage"
  on usage for select
  using (auth.uid() = user_id);

create policy "Service role can manage usage"
  on usage for all
  using (true);

-- Storage policies for PDFs bucket
create policy "Users can upload their own PDFs"
  on storage.objects for insert
  with check (bucket_id = 'pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view PDFs"
  on storage.objects for select
  using (bucket_id = 'pdfs');

create policy "Service role can manage PDFs"
  on storage.objects for all
  using (bucket_id = 'pdfs');

-- Storage policies for audio bucket
create policy "Users can view audio"
  on storage.objects for select
  using (bucket_id = 'audio');

create policy "Service role can manage audio"
  on storage.objects for all
  using (bucket_id = 'audio');

-- Create indexes for performance
create index conversions_user_id_idx on conversions(user_id);
create index conversions_created_at_idx on conversions(created_at desc);
create index usage_user_id_month_idx on usage(user_id, month);
