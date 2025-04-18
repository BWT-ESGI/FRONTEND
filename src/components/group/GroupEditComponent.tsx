import { Info, ListTodo, Shuffle, SquareDashedMousePointer, SquarePi, UserCheck } from "lucide-react";
import FlexibleAlert from "../template/FlexibleAlert";
import FlexibleRadioGroupCard from "../template/FlexibleRadioGroupCard";
import { Project } from "@/types/project.type";
import { Promotion } from "@/types/promotion.type";
import Divider from "../layout/Divider";
import { Input } from "../ui/input";

interface GroupEditComponentProps {
    project: Project;
    promotion: Promotion | null;
}

export default function GroupEditComponent({
    project,
    promotion,
    }: GroupEditComponentProps) {
    return (
      <>
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
        <FlexibleAlert
            icon={<Info className="h-4 w-4 !text-blue-500" />}
            title=" Le nombre de groupes détermine combien d'équipes seront formées pour
            le projet."
        />
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
              {promotion?.students && promotion.students.length}{" "}
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
      </>
    );
}