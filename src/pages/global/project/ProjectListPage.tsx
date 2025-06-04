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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { fetchPromotions } from "@/services/promotionService";
import { Promotion } from "@/types/promotion.type";

export default function ProjectListPage() {
  const { projects, loading } = useProjects();
  const userInfo = getUserInfoFromLocalStorage();
  const userId = userInfo?.userId;
  const isStudentUser = isStudent();

  // Promotion filter state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | "all">("all");
  const [promotionsLoading, setPromotionsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setPromotionsLoading(true);
    fetchPromotions(userId)
      .then(setPromotions)
      .finally(() => setPromotionsLoading(false));
  }, [userId]);

  // Filter projects by selected promotion
  const filteredProjects = (projects.filter(Boolean) as Project[]).filter(
    (project) =>
      selectedPromotionId === "all" || project.promotion?.id === selectedPromotionId
  );

  return (
    <DashboardLayout>
      <div className="p-4 pt-0">
        {loading || promotionsLoading ? (
          <ProjectListPageSkeleton />
        ) : (
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
