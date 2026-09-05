import { Spinner } from "@/components/primitives/Spinner";

export default function Loading() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}
