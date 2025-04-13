import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleRadioGroupCard from "@/components/template/FlexibleRadioGroupCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "@/hooks/api/useProject";
import DashboardLayout from "@/layout/dashboard.layout";
import {
  CircleCheckBig,
  Info,
  ListTodo,
  Shuffle,
  SquareDashedMousePointer,
  SquarePi,
  UserCheck,
} from "lucide-react";
import { useParams } from "react-router-dom";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Divider from "@/components/layout/Divider";
import { Input } from "@/components/ui/input";
import { usePromotion } from "@/hooks/api/usePromotion";
import NotFoundPage from "../global/NotFoundPage";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import GradingRubricForm from "@/components/project/GradingRubricForm";

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
              <h2 className="text-lg font-semibold mb-4">
                <ListTodo className="inline-block mr-2" />
                Composition des groupes
              </h2>
              <div className="mb-4">
                <FlexibleAlert
                  icon={<Info className="h-4 w-4 !text-blue-500" />}
                  title="Le mode de composition des groupes détermine comment les étudiants seront regroupés pour travailler sur le projet."
                />
              </div>
              <FlexibleRadioGroupCard
                options={[
                  {
                    label: "Libre",
                    value: "student_choice",
                    icon: (
                      <UserCheck className="mb-2.5 text-muted-foreground" />
                    ),
                  },
                  {
                    label: "Manuelle",
                    value: "manual",
                    icon: (
                      <SquareDashedMousePointer className="mb-2.5 text-muted-foreground" />
                    ),
                  },
                  {
                    label: "Aléatoire",
                    value: "random",
                    icon: <Shuffle className="mb-2.5 text-muted-foreground" />,
                  },
                ]}
                defaultValue={project.groupCompositionType}
                onValueChange={(value) => console.log(value)}
              />
              <p className="text-sm text-muted-foreground mt-4">
                <Info className="h-4 w-4 inline-block mr-1" />
                {project.groupCompositionType === "student_choice"
                  ? "Les étudiants peuvent librement choisir leurs groupes pour le projet."
                  : project.groupCompositionType === "manual"
                  ? "Les groupes seront définis par l'enseignant de manière manuelle."
                  : "Les groupes seront générés de manière aléatoire pour le projet."}
              </p>

              <Divider className="my-4" />
              <h2 className="text-lg font-semibold mb-4">
                <SquarePi className="inline-block mr-2" />
                Nombre de groupes
              </h2>
              <Alert className="bg-blue-500/10 dark:bg-blue-600/30 border-none">
                <Info className="h-4 w-4 !text-blue-500" />
                <AlertTitle>
                  Le nombre de groupes détermine combien d'équipes seront
                  formées pour le projet.
                </AlertTitle>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center text-2xl text-red-600">
                    {project.nbStudensMinPerGroup}{" "}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Nombre d'étudiants minimum par groupe
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center text-2xl text-emerald-600">
                    {project.nbStudentsMaxPerGroup}{" "}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Nombre d'étudiants maximum par groupe
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center text-2xl text-blue-600">
                    {promotion && promotion.students.length}{" "}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Nombre d'étudiants dans la promotion
                  </p>
                </div>
              </div>

              <Divider className="my-4" />

              <h4 className="text-sm mb-2 mt-4">Nombre de groupes:</h4>
              <Input
                type="number"
                defaultValue={project.nbGroups}
                onChange={(e) => console.log(e.target.value)}
                className="mt-2"
                placeholder="Nombre de groupes"
                min={1}
                max={10}
              />
              <h4 className="text-sm mb-2 mt-4">
                Nombre d'étudiants minimum par groupe:
              </h4>
              <Input
                type="number"
                defaultValue={project.nbStudensMinPerGroup}
                onChange={(e) => console.log(e.target.value)}
                className="mt-2"
                placeholder="Nombre d'étudiants minimum par groupe"
                min={1}
                max={10}
              />
              <h4 className="text-sm mb-2 mt-4">
                Nombre d'étudiants maximum par groupe:
              </h4>
              <Input
                type="number"
                defaultValue={project.nbStudentsMaxPerGroup}
                onChange={(e) => console.log(e.target.value)}
                className="mt-2"
                placeholder="Nombre d'étudiants maximum par groupe"
                min={1}
                max={10}
              />
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
