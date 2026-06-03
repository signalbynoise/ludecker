-- Content CMS schema for @ludecker/website

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text,
  content text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  article_type text not null default 'article',
  cover_image text,
  seo_title text,
  seo_description text,
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (article_type, slug)
);

create table if not exists public.content_tags (
  content_id uuid not null references public.content (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (content_id, tag_id)
);

alter table public.content enable row level security;
alter table public.tags enable row level security;
alter table public.content_tags enable row level security;

create policy "Public read published content"
  on public.content
  for select
  using (status = 'published');

create policy "Authenticated manage content"
  on public.content
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Public read tags"
  on public.tags
  for select
  using (true);

create policy "Authenticated manage tags"
  on public.tags
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Public read content_tags for published"
  on public.content_tags
  for select
  using (
    exists (
      select 1
      from public.content c
      where c.id = content_id and c.status = 'published'
    )
  );

create policy "Authenticated manage content_tags"
  on public.content_tags
  for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('content-images', 'content-images', true)
on conflict (id) do nothing;

create policy "Authenticated upload content images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'content-images');

create policy "Public read content images"
  on storage.objects
  for select
  using (bucket_id = 'content-images');
