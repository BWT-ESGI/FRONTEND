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
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchPromotions } from "@/services/promotionService";
import { Promotion } from "@/types/promotion.type";
import toast from "react-hot-toast";
import Divider from "@/components/layout/Divider";

export default function ProjectListPage() {
  const { projects, loading } = useProjects();
  const userInfo = getUserInfoFromLocalStorage();
  const userId = userInfo?.userId;
  const isStudentUser = isStudent();

  // Promotion filter state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotionId, setSelectedPromotionId] = useState<
    string | "all"
  >("all");
  const [promotionsLoading, setPromotionsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setPromotionsLoading(true);
    fetchPromotions(userId)
      .then(setPromotions)
      .finally(() => setPromotionsLoading(false));
  }, [userId]);

  const filteredProjects = (projects.filter(Boolean) as Project[]).filter(
    (project) =>
      (selectedPromotionId === "all" || project.promotion?.id === selectedPromotionId) &&
      project.status !== "archived"
  );


  const archivedProjects = (projects.filter(Boolean) as Project[]).filter(
    (project) => project.status === "archived"
  );

  return (
    <DashboardLayout>
      <div className="p-4 pt-0">
        {loading || promotionsLoading ? (
          <ProjectListPageSkeleton />
        ) : (
          <>
            <FlexibleSearchBar<Project>
              data={filteredProjects}
              placeholder="Rechercher un projet..."
              rightChildren={
                <>
                  <Select
                    value={selectedPromotionId}
                    onValueChange={setSelectedPromotionId}
                  >
                    <SelectTrigger className="min-w-[180px]">
                      <SelectValue placeholder="Filtrer par promotion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les promotions</SelectItem>
                      {promotions.map((promotion) => (
                        <SelectItem key={promotion.id} value={promotion.id}>
                          {promotion.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isStudentUser && (
                    <Link to="/promotions">
                      <Button>Créer un projet</Button>
                    </Link>
                  )}
                </>
              }
              render={(filteredProjects) => (
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  {filteredProjects.map((project) => {
                    const hasGroup = project.groups?.some((g) =>
                      g.members.some((m) => m.id === userId)
                    );
                    const handleDetailsClick = (e: React.MouseEvent) => {
                      if (isStudentUser && !hasGroup) {
                        e.preventDefault();
                        toast.error(
                          "Vous n'avez pas été attribué à un groupe pour ce projet. Veuillez contacter votre professeur."
                        );
                      }
                    };
                    return (
                      <ProjectSummaryCard
                        key={project.id}
                        project={project}
                        btn={
                          isStudentUser &&
                          project.groupCompositionType === "student_choice" &&
                          !hasGroup ? (
                            // Si la deadline de sélection des groupes est dépassée
                            project.deadlineGroupSelection &&
                            new Date(project.deadlineGroupSelection) <
                              new Date() ? (
                              <Button disabled className="cursor-not-allowed">
                                Deadline de sélection dépassée
                              </Button>
                            ) : // Sinon, si la date de fin du projet est dépassée
                            project.endAt &&
                              new Date(project.endAt) < new Date() ? (
                              <Button disabled className="cursor-not-allowed">
                                Projet terminé
                              </Button>
                            ) : (
                              // Sinon, bouton pour rejoindre un groupe
                              <Link
                                to={`/students/projets/${project.id}/rejoindre`}
                              >
                                <Button className="cursor-pointer">
                                  Rejoindre un groupe
                                </Button>
                              </Link>
                            )
                          ) : (
                            <Link
                              to={
                                isStudentUser
                                  ? `/students/projets/${project.id}`
                                  : `/projets/${project.id}`
                              }
                              onClick={handleDetailsClick}
                            >
                              <Button className="cursor-pointer">
                                Voir les détails
                              </Button>
                            </Link>
                          )
                        }
                      />
                    );
                  })}
                </div>
              )}
            />

            {archivedProjects.length > 0 && (
              <div className="mt-8">
                <Divider className="mb-4" text="Projets archivés" />
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  {archivedProjects.map((project) => (
                    <ProjectSummaryCard
                      key={project.id}
                      project={project}
                      btn={
                        <Link
                          to={
                            isStudentUser
                              ? `/students/projets/${project.id}`
                              : `/projets/${project.id}`
                          }
                        >
                          <Button className="cursor-pointer">
                            Voir les détails
                          </Button>
                        </Link>
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
