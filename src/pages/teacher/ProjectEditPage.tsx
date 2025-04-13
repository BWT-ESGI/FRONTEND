import FlexibleCard from "@/components/template/FlexibleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "@/hooks/api/useProject";
import DashboardLayout from "@/layout/dashboard.layout";
import {
  CircleCheckBig,
  Info,
} from "lucide-react";
import { useParams } from "react-router-dom";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { Input } from "@/components/ui/input";
import { usePromotion } from "@/hooks/api/usePromotion";
import NotFoundPage from "../global/NotFoundPage";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import GradingRubricForm from "@/components/project/GradingRubricForm";
import GroupEditComponent from "@/components/group/GroupEditComponent";

export default function ProjectCreatePage() {
  const { id: projectId } = useParams();
  const { project, loading: loadingProject } = useProject(projectId || "");
  const { promotion, loading: loadingPromotion } = usePromotion(
    project?.promotionId?.toString() || ""
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
                <h2 className="text-lg font-semibold mb-4">
                    <Info className="inline-block mr-2" />
                    Informations générales
                </h2>
                <div className="mb-4">
                    <FlexibleAlert
                        icon={<Info className="h-4 w-4 !text-blue-500" />}
                        title="Les informations générales du projet sont essentielles pour la gestion et le suivi du projet."
                    />
                </div>

                <h4 className="text-sm mb-2 mt-4">Nom du projet:</h4>
                <Input
                    defaultValue={project.name}
                    onChange={(e) => console.log(e.target.value)}
                    className="mt-2"
                    placeholder="Nom du projet"
                />
                <h4 className="text-sm mb-2 mt-4">Description:</h4>
                <Input
                    defaultValue={project.description || ""}
                    onChange={(e) => console.log(e.target.value)}
                    className="mt-2"
                    placeholder="Description du projet"
                    type="text"
                />
                <h4 className="text-sm mb-2 mt-4">Statut:</h4>
                <Input
                    defaultValue={project.status}
                    onChange={(e) => console.log(e.target.value)}
                    className="mt-2"
                    placeholder="Statut du projet"
                    type="text"
                />
                <h4 className="text-sm mb-2 mt-4">Date de début:</h4>
                <Input
                    defaultValue={project.createdAt.toString()}
                    onChange={(e) => console.log(e.target.value)}
                    className="mt-2"
                    placeholder="Date de début"
                    type="date"
                />
                <h4 className="text-sm mb-2 mt-4">Date de fin:</h4>
                <Input
                    defaultValue={project.updatedAt.toString()}
                    onChange={(e) => console.log(e.target.value)}
                    className="mt-2"
                    placeholder="Date de fin"
                    type="date"
                />
                <h4 className="text-sm mb-2 mt-4">Promotion:</h4>
                <Input
                    defaultValue={promotion?.name}
                    onChange={(e) => console.log(e.target.value)}
                    className="mt-2"
                    placeholder="Promotion"
                    type="text"
                />
            </TabsContent>
            <TabsContent value="groupes">
              <GroupEditComponent project={project} promotion={promotion} />
            </TabsContent>
            <TabsContent value="notation"><GradingRubricForm/></TabsContent>
            <TabsContent value="livrables">Test2</TabsContent>
            <TabsContent value="rapports">Test3</TabsContent>
            <TabsContent value="soutenances">Test4</TabsContent>
          </div>
        </Tabs>
      </FlexibleCard>
    </DashboardLayout>
  );
}
