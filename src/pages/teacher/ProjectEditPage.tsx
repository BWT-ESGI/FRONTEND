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
import ReportEditComponent from "@/components/report/ReportEditComponent";
import toast from "react-hot-toast";

export default function ProjectEditPage() {
  const { project, loading, setProject } = useProjectContext();
  const { promotion, loading: loadingPromotion } = usePromotion(
    project?.promotion.id?.toString() || ""
  );

  if (loading || loadingPromotion) return <FallBackPageSkeleton />;
  if (!project) return <NotFoundPage />;

  if (!project) {
    return <NotFoundPage />;
  }

  const handleReportCriteriaSetChange = async (id?: string) => {
    if (!project) return;
    try {
      setProject({ ...project, reportCriteriaSetId: id });
      toast.success("Grille de notation des rapports sauvegardée");
    } catch (e) {
      toast.error("Erreur lors de la sauvegarde de la grille de rapport");
    }
  };

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
            <FlexibleCard>
              <ReportEditComponent
                reportCriteriaSetId={project.reportCriteriaSetId}
                setReportCriteriaSetId={handleReportCriteriaSetChange}
              />
            </FlexibleCard>
          </TabsContent>
          <TabsContent value="soutenances">
            <DefenseScheduler />
          </TabsContent>

        </Tabs>
    </DashboardLayout>
  );
}
