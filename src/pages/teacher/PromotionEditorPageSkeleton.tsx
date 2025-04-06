import { FlexibleCardSkeleton } from "@/components/template/skeleton/FlexibleCardSkeleton";
import { FlexibleTableSkeleton } from "@/components/template/skeleton/FlexibleTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromotionEditorPageSkeleton() {
  return (
    <div className="p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <FlexibleCardSkeleton>
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <Skeleton className="rounded-full h-[120px] w-[120px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </div>
            <div className="flex flex-col items-center">
              <Skeleton className="rounded-full h-[120px] w-[120px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </div>
          </div>
        </FlexibleCardSkeleton>
        <FlexibleCardSkeleton></FlexibleCardSkeleton>
      </div>
      <div className="mt-4">
        <FlexibleCardSkeleton>
          <FlexibleTableSkeleton />
        </FlexibleCardSkeleton>
      </div>
      <div className="mt-4">
        <FlexibleCardSkeleton>
          <FlexibleTableSkeleton />
        </FlexibleCardSkeleton>
      </div>
    </div>
  );
}
