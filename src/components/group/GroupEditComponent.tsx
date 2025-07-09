import {
  Info,
  ListTodo,
  Shuffle,
  SquareDashedMousePointer,
  UserCheck,
} from "lucide-react";
import FlexibleRadioGroupCard from "../template/FlexibleRadioGroupCard";
import Divider from "../layout/Divider";
import { Input } from "../ui/input";
import { useProjectContext } from "@/contexts/ProjectContext";
import { Promotion } from "@/types/promotion.type";
import NotFoundPage from "@/pages/global/NotFoundPage";

interface GroupEditComponentProps {
  promotion: Promotion | null;
}

export default function GroupEditComponent({
  promotion,
}: GroupEditComponentProps) {
  const { project, setProject } = useProjectContext();

  if (!project) return <NotFoundPage />;

  const updateConfig = (
    changes: Partial<{
      groupCompositionType: typeof project.groupCompositionType;
      nbGroups: number;
      nbStudentsMinPerGroup: number;
      nbStudentsMaxPerGroup: number;
      deadlineGroupSelection: Date;
    }>
  ) => {
    setProject({
      ...project,
      ...changes,
    });
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        <ListTodo className="inline-block mr-2" /> Composition des groupes
      </h2>

      <FlexibleRadioGroupCard
        options={[
          {
            label: "Libre",
            value: "student_choice",
            icon: <UserCheck className="mb-2.5 text-muted-foreground" />,
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
        onValueChange={(mode) =>
          updateConfig({ groupCompositionType: mode as any })
        }
        className="mt-4"
      />

      <p className="text-sm text-muted-foreground mt-4">
        <Info className="inline-block mr-1 w-4 h-4" />
        {project.groupCompositionType === "student_choice"
          ? "Choix libre par les étudiants."
          : project.groupCompositionType === "manual"
          ? "Configuration manuelle par l'enseignant."
          : "Répartition aléatoire."}
      </p>

      <Divider className="my-4" />

      <div className="flex items-center w-full justify-between gap-4">
        <div className="flex flex-col w-full">
          <h4 className="text-sm mb-2">Nombre de groupes :</h4>
          <Input
            type="number"
            defaultValue={project.nbGroups}
            onBlur={(e) => updateConfig({ nbGroups: Number(e.target.value) })}
            min={1}
            max={100}
            disabled={true}
          />
        </div>

        <div className="flex flex-col w-full">
          <h4 className="text-sm mb-2">Étudiants min par groupe :</h4>
          <Input
            type="number"
            defaultValue={project.nbStudentsMinPerGroup}
            onBlur={(e) =>
              updateConfig({ nbStudentsMinPerGroup: Number(e.target.value) })
            }
            min={1}
            max={promotion?.students?.length || 1}
          />
        </div>

        <div className="flex flex-col w-full">
          <h4 className="text-sm mb-2">Étudiants max par groupe :</h4>
          <Input
            type="number"
            defaultValue={project.nbStudentsMaxPerGroup}
            onBlur={(e) =>
              updateConfig({ nbStudentsMaxPerGroup: Number(e.target.value) })
            }
            min={project.nbStudentsMinPerGroup!}
            max={promotion?.students?.length || 1}
          />
        </div>

        {project.groupCompositionType === "student_choice" && (
          <div className="flex flex-col w-full">
            <h4 className="text-sm mb-2">Date de clôture :</h4>
            <Input
              type="date"
              defaultValue={
                project.deadlineGroupSelection &&
                typeof project.deadlineGroupSelection === "string" &&
                !isNaN(new Date(project.deadlineGroupSelection).getTime())
                  ? new Date(project.deadlineGroupSelection)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onBlur={(e) => {
                updateConfig({
                  deadlineGroupSelection: e.target.value
                    ? new Date(e.target.value)
                    : undefined,
                });
              }}
            />
          </div>
        )}
      </div>

      <Divider className="my-4" />
    </>
  );
}
