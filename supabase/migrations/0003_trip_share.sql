-- TourLink CRM — traveller portal share tokens.
-- Each trip gets an unguessable token used for the public "track my trip" page
-- (/trip/<token>) and token-scoped document downloads. Additive.

alter table trips add column if not exists share_token text;

-- Backfill any existing rows, then set a default for new ones.
update trips set share_token = encode(gen_random_bytes(9), 'hex') where share_token is null;
alter table trips alter column share_token set default encode(gen_random_bytes(9), 'hex');

create unique index if not exists trips_share_token_idx on trips(share_token);
