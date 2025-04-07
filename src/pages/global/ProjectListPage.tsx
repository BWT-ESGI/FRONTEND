import DashboardLayout from "@/layout/dashboard.layout";
import { useProjects } from "@/hooks/api/useProjects";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import ProjectListPageSkeleton from "./ProjectListPageSkeleton";

export default function ProjectListPage() {
  const { projects, loading } = useProjects();

  return (
    <DashboardLayout>
      <div className="p-4 pt-0">
        {loading ? (
          <ProjectListPageSkeleton />
        ) : (
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {projects.map(
              (project) =>
                project && (
                  <ProjectSummaryCard key={project.id} project={project} />
                )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
