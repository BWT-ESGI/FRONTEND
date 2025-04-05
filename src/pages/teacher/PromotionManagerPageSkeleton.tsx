import { FlexibleCardSkeleton } from "@/components/template/skeleton/FlexibleCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function PromotionManagerPageSkeleton() {
    return (
            <div className="p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                       <FlexibleCardSkeleton key={index}>
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

                            <div className="flex justify-end mt-8">
                                <Skeleton className="h-10 w-32 rounded" />
                            </div>
                        </FlexibleCardSkeleton>
                    ))}
                </div>
            </div>
    );
}
