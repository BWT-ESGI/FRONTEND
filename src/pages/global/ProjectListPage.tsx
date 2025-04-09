import DashboardLayout from "@/layout/dashboard.layout";
import { useProjects } from "@/hooks/api/useProjects";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import ProjectListPageSkeleton from "./ProjectListPageSkeleton";
import { FlexibleSearchBar } from "@/components/template/FlexibleSearchBar";
import { Project } from "@/types/project.type";

export default function ProjectListPage() {
  const { projects, loading } = useProjects();

  return (
    <DashboardLayout>
      <div className="p-4 pt-0">
        {loading ? (
          <ProjectListPageSkeleton />
        ) : (
          <FlexibleSearchBar<Project>
            data={projects.filter(Boolean) as Project[]}
            placeholder="Rechercher un projet..."
            render={(filteredProjects) => (
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectSummaryCard key={project.id} project={project} />
                ))}
              </div>
            )}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
