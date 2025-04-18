import { Info } from "lucide-react";
import FlexibleAlert from "../template/FlexibleAlert";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Project, ProjectStatus } from "@/types/project.type";

interface ProjectGlobalEditComponentProps {
  project: Project;
}

export default function ProjectGlobalEditComponent({
  project
}: ProjectGlobalEditComponentProps) {
  return (
    <>
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
        value={project.name}
        onChange={() => {}}
        className="mt-2"
        placeholder="Nom du projet"
      />

      <h4 className="text-sm mb-2 mt-4">Description:</h4>
      <Input
        value={project.description || ""}
        onChange={() => {}}
        className="mt-2"
        placeholder="Description du projet"
        type="text"
      />

      <h4 className="text-sm mb-2 mt-4">Statut:</h4>
      <Select value={project.status} onValueChange={() => {}}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Statut du projet" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ProjectStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <h4 className="text-sm mb-2 mt-4">Date de début:</h4>
      <Input
        value={project.createdAt.toString().slice(0, 10)}
        onChange={() => {}}
        className="mt-2"
        placeholder="Date de début"
        type="date"
      />

      <h4 className="text-sm mb-2 mt-4">Date de fin:</h4>
      <Input
        value={project.updatedAt.toString().slice(0, 10)}
        onChange={() => {}}
        className="mt-2"
        placeholder="Date de fin"
        type="date"
      />

      <h4 className="text-sm mb-2 mt-4">Promotion:</h4>
      <Input
        value={project.promotion?.name || ""}
        onChange={() => {}}
        className="mt-2"
        placeholder="Promotion"
      />
    </>
  );
}
