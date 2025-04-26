import DashboardLayout from "@/layout/dashboard.layout";
import { useProjects } from "@/hooks/api/useProjects";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import ProjectListPageSkeleton from "./ProjectListPageSkeleton";
import { FlexibleSearchBar } from "@/components/template/FlexibleSearchBar";
import { Project } from "@/types/project.type";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import isStudent from "@/utils/isStudent";
import getUserInfoFromLocalStorage from "@/utils/getUserInfoFromLocalStorage";

export default function ProjectListPage() {
  const { projects, loading } = useProjects();
  const userInfo = getUserInfoFromLocalStorage();
  const userId = userInfo?.userId;
  const isStudentUser = isStudent();

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
              isStudentUser ? undefined : (
                <Link to="/promotions">
                  <Button>Créer un projet</Button>
                </Link>
              )
            }
            render={(filteredProjects) => (
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {filteredProjects.map((project) => {
                  const hasGroup = project.groups?.some(g =>
                    g.members.some(m => m.id === userId)
                  );
                  return (
                    <ProjectSummaryCard key={project.id} project={project} btn={
                      isStudentUser && project.groupCompositionType === "student_choice" && !hasGroup ? (
                        <Link to={`/students/projets/${project.id}/rejoindre`}>
                          <Button className="cursor-pointer">Rejoindre un groupe</Button>
                        </Link>
                      ) :  (
                        <Link to={isStudentUser ? `/students/projets/${project.id}` : `/projets/${project.id}`}>
                          <Button className="cursor-pointer">Voir les détails</Button>
                        </Link>)
                    } />
                  );
                })}
              </div>
            )}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
