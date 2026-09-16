const ContentSkeleton = () => (
  <main
    className="mx-auto min-h-[calc(100dvh-4.5rem)] w-full max-w-[1600px] p-4 sm:p-6 lg:p-8"
    role="status"
    aria-live="polite"
    aria-label="Loading page content"
  >
    <div className="animate-pulse space-y-6">
      <div className="h-40 rounded-3xl border border-white/8 bg-white/[0.055]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-36 rounded-3xl border border-white/8 bg-white/[0.045]" />
        <div className="h-36 rounded-3xl border border-white/8 bg-white/[0.045]" />
        <div className="hidden h-36 rounded-3xl border border-white/8 bg-white/[0.045] xl:block" />
      </div>
      <div className="h-72 rounded-3xl border border-white/8 bg-white/[0.045]" />
    </div>
    <span className="sr-only">Loading this section</span>
  </main>
);

export default ContentSkeleton;
