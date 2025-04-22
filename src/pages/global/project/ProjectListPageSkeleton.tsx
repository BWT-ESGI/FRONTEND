import ProjectSummaryCardSkeleton from "@/components/project/skeleton/ProjectSummaryCardSkeleton";

export default function ProjectListPageSkeleton() {
  return (
    <div className="p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <ProjectSummaryCardSkeleton/>
                <ProjectSummaryCardSkeleton/>
                <ProjectSummaryCardSkeleton/>
          </div>
      </div>
  );
}
