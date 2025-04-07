import { FlexibleCardSkeleton } from "@/components/template/skeleton/FlexibleCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectSummaryCardSkeleton() {
  return (
    <FlexibleCardSkeleton>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-40" /> 
          <Skeleton className="h-6 w-10 rounded" />{" "}
          <Skeleton className="h-6 w-10 rounded" /> 
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Skeleton className="h-4 w-6" /> 
          <div className="flex-1">
            <Skeleton className="h-4 w-full" /> 
          </div>
          <Skeleton className="h-4 w-6" />
        </div>
      </div>
    </FlexibleCardSkeleton>
  );
}
