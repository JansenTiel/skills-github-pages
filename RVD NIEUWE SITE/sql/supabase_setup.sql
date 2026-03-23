create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku_base text not null unique,
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  sku_unique text not null unique,
  status text not null default 'CREATED' check (status in ('CREATED','IN_STOCK','OUT')),
  location text,
  in_at timestamptz,
  out_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.movements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('IN','OUT')),
  product_id uuid references public.products(id) on delete set null,
  sku_unique text,
  location text,
  order_no text,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz default now()
);

create sequence if not exists public.items_seq;

create or replace function public.create_items(p_product_id uuid, p_qty integer)
returns table(id uuid, sku_unique text)
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  i int;
  newsku text;
begin
  select sku_base into base from public.products where products.id = p_product_id;
  if base is null then
    raise exception 'Product niet gevonden';
  end if;
  if p_qty < 1 then
    raise exception 'Aantal moet minimaal 1 zijn';
  end if;
  for i in 1..p_qty loop
    newsku := base || '-' || lpad(nextval('public.items_seq')::text, 5, '0');
    insert into public.items(product_id, sku_unique)
    values (p_product_id, newsku)
    returning items.id, items.sku_unique into id, sku_unique;
    return next;
  end loop;
end;
$$;

grant execute on function public.create_items(uuid, integer) to authenticated;

create or replace view public.v_stock_summary as
select
  p.sku_base,
  p.name,
  count(i.id) as qty
from public.items i
join public.products p on p.id = i.product_id
where i.status = 'IN_STOCK'
group by p.sku_base, p.name;

create or replace view public.v_stock_items as
select
  i.id,
  i.sku_unique,
  p.sku_base,
  p.name,
  i.location,
  i.in_at
from public.items i
join public.products p on p.id = i.product_id
where i.status = 'IN_STOCK';

alter table public.products enable row level security;
alter table public.items enable row level security;
alter table public.movements enable row level security;
alter table public.profiles enable row level security;

drop policy if exists products_select on public.products;
drop policy if exists products_insert on public.products;
drop policy if exists products_update on public.products;
drop policy if exists items_select on public.items;
drop policy if exists items_insert on public.items;
drop policy if exists items_update on public.items;
drop policy if exists movements_select on public.movements;
drop policy if exists movements_insert on public.movements;
drop policy if exists profiles_select on public.profiles;
drop policy if exists profiles_insert on public.profiles;
drop policy if exists profiles_update on public.profiles;

create policy products_select on public.products for select to authenticated using (true);
create policy products_insert on public.products for insert to authenticated with check (true);
create policy products_update on public.products for update to authenticated using (true) with check (true);

create policy items_select on public.items for select to authenticated using (true);
create policy items_insert on public.items for insert to authenticated with check (true);
create policy items_update on public.items for update to authenticated using (true) with check (true);

create policy movements_select on public.movements for select to authenticated using (true);
create policy movements_insert on public.movements for insert to authenticated with check (true);

create policy profiles_select on public.profiles for select to authenticated using (true);
create policy profiles_insert on public.profiles for insert to authenticated with check (true);
create policy profiles_update on public.profiles for update to authenticated using (true) with check (true);

insert into public.profiles(id, role)
values ('487877f0-14e7-43a9-86cd-93316c3b358c', 'admin')
on conflict (id) do update set role = excluded.role;
