import { useParams } from "react-router-dom";
import { FlexibleCircularProgress } from "@/components/template/FlexibleCircularProgress";
import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleTable from "@/components/template/FlexibleTable";
import DashboardLayout from "@/layout/dashboard.layout";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user.type";
import { usePromotion } from "@/hooks/api/usePromotion";
import PromotionEditorPageSkeleton from "./PromotionEditorPageSkeleton";
import NotFoundPage from "../global/NotFoundPage";
import { Project } from "@/types/project.type";
import { FlexibleBadge } from "@/components/template/FlexibleBadge";

export default function PromotionEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { promotion, loading } = usePromotion(id || "");

  if (loading) {
    return (
      <DashboardLayout>
        <PromotionEditorPageSkeleton />
      </DashboardLayout>
    );
  }

  if (!promotion) {
    return (
      <NotFoundPage />
    );
  }

  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: info =>
        info.getValue() === "student" ? "Student" : info.getValue(),
    },
  ];
  const projectColumns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: info => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: info => new Date(info.getValue() as string).toLocaleDateString(),
    },
  ];
  const userData = promotion.students;
  const projectsData = promotion.projects;
  
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
                <p className="mt-2 text-sm font-medium">
                  Nombre d'étudiants
                </p>
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
                <p className="mt-2 text-sm font-medium">
                  Nombre de projets
                </p>
              </div>
            </div>
          </FlexibleCard>

          <FlexibleCard
            title={`Projet: ${promotion.projects[0].name}`} 
            description={promotion.teacher.name}
            badge={<FlexibleBadge status='in-progress' />}
          >
            <div className="max-w-xs mx-auto w-full flex items-center">
              <span className="text-sm font-medium">
                {promotion.projects[0].description}
              </span>
              

            </div> {/* Closing div for max-w-xs */}
          </FlexibleCard> {/* Closing FlexibleCard for project */}
          

        </div>
        <FlexibleCard title="Projets de la promotion" description="Gérer les projets de la promotion">
          <FlexibleTable<Project> data={projectsData} columns={projectColumns} />
        </FlexibleCard>

        <FlexibleCard title="Etudiants dans la promotion" description="Gérer les étudiants de la promotion">
          <FlexibleTable<User> data={userData} columns={userColumns} />
        </FlexibleCard>
      </div>
    </DashboardLayout>
  );
}