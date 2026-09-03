import { Spinner } from "@/components/primitives/Spinner";
import { LoadingSkeleton } from "@/components/primitives/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-cruze-mint border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
