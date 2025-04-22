import FlexibleCard from "@/components/template/FlexibleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/layout/dashboard.layout";
import { Info } from "lucide-react";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { usePromotion } from "@/hooks/api/usePromotion";
import NotFoundPage from "../global/NotFoundPage";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import GroupEditComponent from "@/components/group/GroupEditComponent";
import GroupBuilder from "@/components/group/ GroupBuilder";
import ProjectGlobalEditComponent from "@/components/project/ProjectGlobalEditComponent";
import DefenseScheduler from "@/components/defense/DefenseScheduler";
import { useProjectContext } from "@/contexts/ProjectContext";

export default function ProjectEditPage() {
  const { project, loading } = useProjectContext();
  const { promotion, loading: loadingPromotion } = usePromotion(
    project?.promotion.id?.toString() || ""
  );

  if (loading || loadingPromotion) return <FallBackPageSkeleton />;
  if (!project) return <NotFoundPage />;

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <DashboardLayout>
      <FlexibleCard title={`${project.name}`}>
        <FlexibleAlert
          variant="warning"
          icon={<Info className="!text-orange-500 text-center" />}
          title="N'oubliez pas de sauvegarder vos modifications !"
        />

        <Tabs defaultValue="general" className="mt-4 w-full">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="general">Information Général</TabsTrigger>
            <TabsTrigger value="groupes">Groupes</TabsTrigger>
            <TabsTrigger value="livrables">Livrables</TabsTrigger>
            <TabsTrigger value="rapports">Rapports</TabsTrigger>
            <TabsTrigger value="soutenances">Soutenances</TabsTrigger>
          </TabsList>

          <div className="mt-2 p-4 border rounded-md">
            <TabsContent value="general">
              <ProjectGlobalEditComponent />
            </TabsContent>
            <TabsContent value="groupes">
              <GroupEditComponent promotion={promotion}/>
              <GroupBuilder/>
            </TabsContent>
            <TabsContent value="livrables"></TabsContent>
            <TabsContent value="rapports">
              Grille de notation des rapports a selectionner
            </TabsContent>
            <TabsContent value="soutenances">
              <DefenseScheduler />
            </TabsContent>
          </div>
        </Tabs>
      </FlexibleCard>
    </DashboardLayout>
  );
}
