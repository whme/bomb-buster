create extension if not exists "pgcrypto";

create type public.game_status as enum (
  'lobby',
  'setup',
  'in_progress',
  'won',
  'lost',
  'cancelled'
);

create type public.wire_type as enum (
  'blue',
  'yellow',
  'red'
);

create type public.game_action_type as enum (
  'starting_hint',
  'guess',
  'solo_cut'
);

create type public.action_outcome as enum (
  'correct',
  'incorrect',
  'hit_red',
  'win',
  'lose'
);

create table public.game (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  host_player_id uuid not null,
  captain_player_id uuid not null,
  status public.game_status not null default 'lobby',
  current_turn_player_id uuid,
  red_wire_count integer not null default 0 check (red_wire_count between 0 and 11),
  yellow_wire_count integer not null default 0 check (yellow_wire_count between 0 and 11),
  turn_number integer not null default 0 check (turn_number >= 0),
  detonator_step integer not null default 0 check (detonator_step >= 0),
  detonator_limit integer check (detonator_limit > 0),
  next_yellow_rank integer not null default 1 check (next_yellow_rank between 1 and 11),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ended_at is null or started_at is not null),
  check (ended_at is null or ended_at >= started_at),
  check (status <> 'in_progress' or current_turn_player_id is not null)
);

create table public.game_player (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.game(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) > 0),
  seat_index integer not null check (seat_index >= 0),
  turn_order_index integer check (turn_order_index is null or turn_order_index >= 0),
  joined_at timestamptz not null default now(),
  unique (game_id, id),
  unique (game_id, seat_index)
);

alter table public.game
  add constraint game_host_player_fkey
  foreign key (id, host_player_id)
  references public.game_player(game_id, id)
  deferrable initially deferred;

alter table public.game
  add constraint game_captain_player_fkey
  foreign key (id, captain_player_id)
  references public.game_player(game_id, id)
  deferrable initially deferred;

alter table public.game
  add constraint game_current_turn_player_fkey
  foreign key (id, current_turn_player_id)
  references public.game_player(game_id, id);

create table public.game_rack (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.game(id) on delete cascade,
  rack_index integer not null check (rack_index >= 0),
  controller_player_id uuid not null,
  created_at timestamptz not null default now(),
  unique (game_id, rack_index),
  unique (game_id, id),
  unique (id, controller_player_id),
  foreign key (game_id, controller_player_id)
    references public.game_player(game_id, id)
);

create table public.game_tile (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.game(id) on delete cascade,
  rack_id uuid not null,
  rack_position integer not null check (rack_position >= 0),
  wire_type public.wire_type not null,
  wire_rank integer not null,
  is_revealed boolean not null default false,
  is_cut boolean not null default false,
  revealed_at timestamptz,
  cut_at timestamptz,
  unique (game_id, rack_id, rack_position),
  unique (game_id, id),
  unique (rack_id, id),
  foreign key (game_id, rack_id)
    references public.game_rack(game_id, id)
    on delete cascade,
  check (
    (wire_type = 'blue' and wire_rank between 1 and 12)
    or (wire_type in ('yellow', 'red') and wire_rank between 1 and 11)
  ),
  check (not (wire_type = 'red' and is_cut)),
  check (not is_cut or is_revealed),
  check (is_revealed or revealed_at is null),
  check (not is_revealed or revealed_at is not null),
  check (is_cut or cut_at is null),
  check (not is_cut or cut_at is not null)
);

create table public.game_action (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.game(id) on delete cascade,
  turn_number integer not null check (turn_number >= 0),
  actor_player_id uuid not null,
  actor_rack_id uuid,
  action_type public.game_action_type not null,
  target_rack_id uuid,
  target_tile_id uuid,
  declared_wire_type public.wire_type,
  declared_wire_rank integer,
  outcome public.action_outcome,
  detonator_step_change integer not null default 0,
  affected_tiles jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (game_id, actor_player_id)
    references public.game_player(game_id, id),
  foreign key (game_id, actor_rack_id)
    references public.game_rack(game_id, id),
  foreign key (game_id, target_rack_id)
    references public.game_rack(game_id, id),
  foreign key (game_id, target_tile_id)
    references public.game_tile(game_id, id),
  foreign key (actor_rack_id, actor_player_id)
    references public.game_rack(id, controller_player_id),
  foreign key (target_rack_id, target_tile_id)
    references public.game_tile(rack_id, id),
  check (target_tile_id is null or target_rack_id is not null),
  check (
    (action_type = 'starting_hint' and outcome is null)
    or (action_type <> 'starting_hint' and outcome is not null)
  ),
  check (
    (action_type = 'starting_hint' and turn_number = 0)
    or (action_type <> 'starting_hint' and turn_number > 0)
  ),
  check (jsonb_typeof(affected_tiles) = 'array'),
  check (
    declared_wire_rank is null
    or (
      declared_wire_type is not null
      and (
        (declared_wire_type = 'blue' and declared_wire_rank between 1 and 12)
        or (declared_wire_type in ('yellow', 'red') and declared_wire_rank between 1 and 11)
      )
    )
  )
);

create index game_host_player_id_idx
  on public.game (host_player_id);

create index game_captain_player_id_idx
  on public.game (captain_player_id);

create index game_current_turn_player_id_idx
  on public.game (current_turn_player_id);

create index game_player_game_id_idx
  on public.game_player (game_id);

create unique index game_player_normalized_display_name_idx
  on public.game_player (game_id, lower(trim(display_name)));

create unique index game_player_turn_order_index_idx
  on public.game_player (game_id, turn_order_index)
  where turn_order_index is not null;

create index game_rack_controller_player_id_idx
  on public.game_rack (controller_player_id);

create index game_tile_game_revealed_idx
  on public.game_tile (game_id, is_revealed);

create index game_tile_rack_position_idx
  on public.game_tile (rack_id, rack_position);

create index game_action_game_created_at_idx
  on public.game_action (game_id, created_at);

create index game_action_game_turn_number_idx
  on public.game_action (game_id, turn_number);

create or replace function public.generate_game_invite_code()
returns text
language plpgsql
as $$
declare
  invite_code_characters constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  generated_invite_code text := '';
  character_position integer;
begin
  for character_position in 1..6 loop
    generated_invite_code :=
      generated_invite_code ||
      substr(
        invite_code_characters,
        1 + floor(random() * length(invite_code_characters))::integer,
        1
      );
  end loop;

  return generated_invite_code;
end;
$$;

create or replace function public.create_game_lobby(display_name_input text)
returns table (
  game_id uuid,
  invite_code text,
  status public.game_status,
  captain_player_id uuid,
  red_wire_count integer,
  yellow_wire_count integer,
  player_id uuid,
  display_name text,
  seat_index integer
)
language plpgsql
as $$
declare
  trimmed_display_name text := btrim(display_name_input);
  created_game_id uuid := gen_random_uuid();
  created_player_id uuid := gen_random_uuid();
  created_invite_code text;
  conflicting_constraint_name text;
begin
  if trimmed_display_name = '' then
    raise exception using errcode = 'P0001', message = 'display_name_invalid';
  end if;

  loop
    created_invite_code := public.generate_game_invite_code();

    begin
      insert into public.game (
        id,
        invite_code,
        host_player_id,
        captain_player_id
      )
      values (
        created_game_id,
        created_invite_code,
        created_player_id,
        created_player_id
      );

      insert into public.game_player (
        id,
        game_id,
        display_name,
        seat_index
      )
      values (
        created_player_id,
        created_game_id,
        trimmed_display_name,
        0
      );

      exit;
    exception
      when unique_violation then
        get stacked diagnostics
          conflicting_constraint_name = constraint_name;

        if conflicting_constraint_name = 'game_invite_code_key' then
          continue;
        end if;

        raise;
    end;
  end loop;

  return query
  select
    created_game_id,
    created_invite_code,
    'lobby'::public.game_status,
    created_player_id,
    0,
    0,
    created_player_id,
    trimmed_display_name,
    0;
end;
$$;

create or replace function public.join_game_lobby(
  invite_code_input text,
  display_name_input text
)
returns table (
  game_id uuid,
  invite_code text,
  status public.game_status,
  captain_player_id uuid,
  red_wire_count integer,
  yellow_wire_count integer,
  player_id uuid,
  display_name text,
  seat_index integer
)
language plpgsql
as $$
declare
  trimmed_display_name text := btrim(display_name_input);
  normalized_invite_code text := upper(btrim(invite_code_input));
  locked_game public.game%rowtype;
  created_player_id uuid := gen_random_uuid();
  created_seat_index integer;
  joined_player_count integer;
begin
  if trimmed_display_name = '' then
    raise exception using errcode = 'P0001', message = 'display_name_invalid';
  end if;

  select *
  into locked_game
  from public.game
  where game.invite_code = normalized_invite_code
  for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'game_not_found';
  end if;

  if locked_game.status <> 'lobby' then
    raise exception using errcode = 'P0001', message = 'invalid_status';
  end if;

  select count(*)
  into joined_player_count
  from public.game_player
  where game_player.game_id = locked_game.id;

  if joined_player_count >= 5 then
    raise exception using errcode = 'P0001', message = 'game_full';
  end if;

  if exists (
    select 1
    from public.game_player
    where game_player.game_id = locked_game.id
      and lower(trim(game_player.display_name)) = lower(trimmed_display_name)
  ) then
    raise exception using errcode = 'P0001', message = 'display_name_taken';
  end if;

  select coalesce(max(game_player.seat_index) + 1, 0)
  into created_seat_index
  from public.game_player
  where game_player.game_id = locked_game.id;

  insert into public.game_player (
    id,
    game_id,
    display_name,
    seat_index
  )
  values (
    created_player_id,
    locked_game.id,
    trimmed_display_name,
    created_seat_index
  );

  return query
  select
    locked_game.id,
    locked_game.invite_code,
    locked_game.status,
    locked_game.captain_player_id,
    locked_game.red_wire_count,
    locked_game.yellow_wire_count,
    created_player_id,
    trimmed_display_name,
    created_seat_index;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_game_updated_at
before update on public.game
for each row
execute function public.set_updated_at();
