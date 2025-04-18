import DashboardLayout from "@/layout/dashboard.layout";
import { useProjects } from "@/hooks/api/useProjects";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import ProjectListPageSkeleton from "./ProjectListPageSkeleton";
import { FlexibleSearchBar } from "@/components/template/FlexibleSearchBar";
import { Project } from "@/types/project.type";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
            rightChildren={
              <Link to="/gestion-projets/ajouter">
                <Button>Créer un projet</Button>
              </Link>
            }
            render={(filteredProjects) => (
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectSummaryCard key={project.id} project={project} btn={
                    <Link to={`/gestion-projets/${project.id}`}>
                      <Button className="cursor-pointer">Voir les détails</Button>
                    </Link>
                  } />
                ))}
              </div>
            )}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
