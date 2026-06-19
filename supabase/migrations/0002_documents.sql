-- TourLink CRM — document delivery support.
-- Additive: outbox gains media fields so the bridge can send a PDF as a WhatsApp
-- document, plus a private Storage bucket for generated quotes/itineraries/vouchers.

alter table outbox add column if not exists media_mime text;
alter table outbox add column if not exists media_name text;

-- Private bucket for generated documents. Files are reached only via short-lived
-- signed URLs minted server-side. Idempotent.
insert into storage.buckets (id, name, public)
values ('tourlink-docs', 'tourlink-docs', false)
on conflict (id) do nothing;
