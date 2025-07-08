import { Skeleton } from "@/components/ui/skeleton";

const SkeletonPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Title */}
      <Skeleton className="h-8 w-1/3 rounded-lg" />

      {/* Breadcrumbs */}
      <Skeleton className="h-4 w-1/4 rounded-md" />

      {/* Content blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonPage;
