export default function Loading() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="h-14 w-14 rounded-full border-4 border-navy/20 border-t-navy animate-spin" />
      </div>

      {/* Brand text */}
      <p className="text-lg font-serif text-navy tracking-wide">
        Loading&hellip;
      </p>
    </div>
  );
}
