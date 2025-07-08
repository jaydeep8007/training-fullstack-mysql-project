// components/skeletons/SkeletonGlobalConfigForm.tsx
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonGlobalConfigForm = () => {
  return (
    <div className="border border-border p-6 rounded-xl bg-card shadow-lg ring-1 ring-muted/30 space-y-4">
      <Skeleton className="h-6 w-1/3" /> {/* Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
};

export default SkeletonGlobalConfigForm;
