import { Link, useParams } from "react-router-dom";
import { FlexibleCircularProgress } from "@/components/template/FlexibleCircularProgress";
import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleTable from "@/components/template/FlexibleTable";
import DashboardLayout from "@/layout/dashboard.layout";
import { User } from "@/types/user.type";
import { usePromotion } from "@/hooks/api/usePromotion";
import PromotionEditorPageSkeleton from "./PromotionEditorPageSkeleton";
import NotFoundPage from "../global/NotFoundPage";
import { Project } from "@/types/project.type";
import { Button } from "@/components/ui/button";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";

export default function PromotionEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { promotion, loading } = usePromotion(Number(id) || 0);

  if (loading) {
    return (
      <DashboardLayout>
        <PromotionEditorPageSkeleton />
      </DashboardLayout>
    );
  }

  if (!promotion) {
    return <NotFoundPage />;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <FlexibleCard
            key={promotion.id}
            title={promotion.name}
            description={`Enseignant: ${promotion.teacher.name}`}
          >
            <div className="max-w-xs mx-auto w-full flex items-center">
              <div className="flex flex-col items-center justify-center w-full">
                <FlexibleCircularProgress
                  value={promotion.students.length}
                  size={120}
                  strokeWidth={10}
                  showLabel
                  labelClassName="text-xl font-bold"
                  progressClassName="stroke-green-500"
                />
                <p className="mt-2 text-sm font-medium">Nombre d'étudiants</p>
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <FlexibleCircularProgress
                  value={promotion.projects.length}
                  size={120}
                  strokeWidth={10}
                  showLabel
                  labelClassName="text-xl font-bold"
                  progressClassName="stroke-orange-500"
                />
                <p className="mt-2 text-sm font-medium">Nombre de projets</p>
              </div>
            </div>
          </FlexibleCard>

          <ProjectSummaryCard project={promotion.projects[0]} />

        </div>
        <FlexibleCard
          title="Projets de la promotion"
          description="Gérer les projets de la promotion"
          childrenRightEnd={
            <Button size="sm">
              <Link to={`/teacher/promotions/${promotion.id}/projects/new`}>
                Créer un projet
              </Link>
            </Button>
          }
        >
          <FlexibleTable<Project> data={promotion.projects} />
        </FlexibleCard>

        <FlexibleCard
          title="Etudiants de la promotion"
          description="Gérer les étudiants de la promotion"
          childrenRightEnd={
            <Button size="sm">
              <Link to={`/gestion-promotions/${promotion.id}/ajouter-etudiant`}>
                Ajouter des étudiants
              </Link>
            </Button>
          }
        >
          <FlexibleTable<User> data={promotion.students} />
        </FlexibleCard>
      </div>
    </DashboardLayout>
  );
}
