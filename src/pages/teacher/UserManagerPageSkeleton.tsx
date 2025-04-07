import DashboardLayout from "@/layout/dashboard.layout";
import { FlexibleCardSkeleton } from "@/components/template/skeleton/FlexibleCardSkeleton";
import { FlexibleTableSkeleton } from "@/components/template/skeleton/FlexibleTableSkeleton";

export default function UserManagerPageSkeleton() {
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <FlexibleCardSkeleton>
          <FlexibleTableSkeleton />
        </FlexibleCardSkeleton>
      </div>
    </DashboardLayout>
  );
}
