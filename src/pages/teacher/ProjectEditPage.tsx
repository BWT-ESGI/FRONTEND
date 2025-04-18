import FlexibleCard from "@/components/template/FlexibleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "@/hooks/api/useProject";
import DashboardLayout from "@/layout/dashboard.layout";
import { CircleCheckBig } from "lucide-react";
import { useParams } from "react-router-dom";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { usePromotion } from "@/hooks/api/usePromotion";
import NotFoundPage from "../global/NotFoundPage";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import GradingRubricForm from "@/components/project/GradingRubricForm";
import GroupEditComponent from "@/components/group/GroupEditComponent";
import GroupBuilder from "@/components/group/ GroupBuilder";
import ProjectGlobalEditComponent from "@/components/project/ProjectGlobalEditComponent";

export default function ProjectCreatePage() {
  const { id: projectId } = useParams();
  const { project, loading: loadingProject } = useProject(projectId || "");
  const { promotion, loading: loadingPromotion } = usePromotion(
    project?.promotion.id?.toString() || ""
  );

  if (loadingProject || loadingPromotion) {
    return <FallBackPageSkeleton />;
  }

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <DashboardLayout>
      <FlexibleCard title={`${project.name}`}>
        <FlexibleAlert
          variant="success"
          icon={<CircleCheckBig className="h-4 w-4 !text-emerald-500" />}
          title="Bonne nouvelle! Toutes vos modifications sont sauvegardé en temps réel."
        />

        <Tabs defaultValue="general" className="mt-4 w-full">
          <TabsList className="w-full grid grid-cols-6">
            <TabsTrigger value="general">Information Général</TabsTrigger>
            <TabsTrigger value="groupes">Groupes</TabsTrigger>
            <TabsTrigger value="notation">Grilles de Notation</TabsTrigger>
            <TabsTrigger value="livrables">Livrables</TabsTrigger>
            <TabsTrigger value="rapports">Rapports</TabsTrigger>
            <TabsTrigger value="soutenances">Soutenances</TabsTrigger>
          </TabsList>

          <div className="mt-2 p-4 border rounded-md">
            <TabsContent value="general">
             <ProjectGlobalEditComponent project={project} />
            </TabsContent>
            <TabsContent value="groupes">
              <GroupEditComponent project={project} promotion={promotion} />
              <GroupBuilder
                mode={project.groupCompositionType}
                minSize={project.nbStudensMinPerGroup}
                maxSize={project.nbStudentsMaxPerGroup}
                deadline={project.deadline}
              />
            </TabsContent>
            <TabsContent value="notation">
              <GradingRubricForm />
            </TabsContent>
            <TabsContent value="livrables">Test2</TabsContent>
            <TabsContent value="rapports">Test3</TabsContent>
            <TabsContent value="soutenances">Test4</TabsContent>
          </div>
        </Tabs>
      </FlexibleCard>
    </DashboardLayout>
  );
}
