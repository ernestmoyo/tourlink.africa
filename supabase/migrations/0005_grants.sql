-- TourLink CRM — grant the service_role access to the app tables.
-- The server reaches every table through the service-role key (bypassing RLS).
-- On hosted Supabase default privileges usually cover this; locally they don't,
-- so grant explicitly. Idempotent and safe to run anywhere.

grant usage on schema public to service_role, anon, authenticated;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all functions in schema public to service_role;

-- Cover any tables/sequences created by later migrations too.
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on functions to service_role;
