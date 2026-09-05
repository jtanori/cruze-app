import { Spinner } from "@/components/primitives/Spinner";

export default function Loading() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
