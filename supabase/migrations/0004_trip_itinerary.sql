-- TourLink CRM — store a day-by-day itinerary on a trip (from a catalogue
-- package or hand-authored), so itinerary PDFs and the traveller portal can show
-- a proper day plan rather than just segments. Additive.

alter table trips add column if not exists itinerary jsonb not null default '[]';
