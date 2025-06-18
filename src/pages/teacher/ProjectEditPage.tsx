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
import CreateDelivrableComponent from "@/components/delivrable/CreateDelivrableComponent";

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
        <FlexibleAlert
          variant="info"
          icon={<Info className="!text-grey-500 text-center" />}
          title="N'oubliez pas de sauvegarder vos modifications !"
        />

        <Tabs defaultValue="general" className="mt-4 w-full">
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="general">Informations Générales</TabsTrigger>
            <TabsTrigger value="groupes">Groupes</TabsTrigger>
            <TabsTrigger value="livrables">Livrables</TabsTrigger>
            <TabsTrigger value="rapports">Rapports</TabsTrigger>
            <TabsTrigger value="soutenances">Soutenances</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <FlexibleCard>
              <ProjectGlobalEditComponent />
            </FlexibleCard>
          </TabsContent>
          <TabsContent value="groupes" className="flex flex-col gap-4">
            <FlexibleCard>
              <GroupEditComponent promotion={promotion} />
            </FlexibleCard>
            <FlexibleCard>
              <GroupBuilder />
            </FlexibleCard>
          </TabsContent>
          <TabsContent value="livrables">
            <CreateDelivrableComponent />
          </TabsContent>
          <TabsContent value="rapports">
            Grille de notation des rapports a selectionner
          </TabsContent>
          <TabsContent value="soutenances">
            <DefenseScheduler />
          </TabsContent>

        </Tabs>
      </FlexibleCard>
    </DashboardLayout>
  );
}
