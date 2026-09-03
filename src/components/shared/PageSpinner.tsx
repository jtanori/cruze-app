/**
 * Full-page loading spinner.
 * Replaces the identical spinner pattern duplicated across 5 pages.
 */
export function PageSpinner() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-cruze-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
