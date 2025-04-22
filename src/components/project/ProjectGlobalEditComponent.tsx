import { Info } from "lucide-react";
import FlexibleAlert from "../template/FlexibleAlert";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Project, ProjectStatus } from "@/types/project.type";
import { useState } from "react";
import { updateProject } from "@/services/projectService";
import toast from "react-hot-toast";

interface ProjectGlobalEditComponentProps {
  project: Project;
}

export default function ProjectGlobalEditComponent({
  project,
}: ProjectGlobalEditComponentProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [startDate, setStartDate] = useState(
    project.createdAt.toString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    project.updatedAt.toString().slice(0, 10)
  );
  const [promotion, setPromotion] = useState(project.promotion?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: Partial<Project> = {
        name,
        description,
        status,
        createdAt: new Date(startDate),
        updatedAt: new Date(endDate),
        promotion: project.promotion
          ? { ...project.promotion, name: promotion }
          : undefined,
      };
      await updateProject(String(project.id), payload);
      toast.success("Modifications sauvegardées avec succès");
    } catch (e: any) {
      toast.error("Erreur lors de la sauvegarde");
    }
    setLoading(false);
  };

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

      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="text-sm mb-2">Nom du projet:</h4>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du projet"
          />
        </div>

        <div>
          <h4 className="text-sm mb-2">Description:</h4>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du projet"
            type="text"
          />
        </div>

        <div>
          <h4 className="text-sm mb-2">Statut:</h4>
          <Select
            value={status}
            onValueChange={(val) => setStatus(val as ProjectStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut du projet" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProjectStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="text-sm mb-2">Date de début:</h4>
          <Input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Date de début"
            type="date"
          />
        </div>

        <div>
          <h4 className="text-sm mb-2">Date de fin:</h4>
          <Input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Date de fin"
            type="date"
          />
        </div>

        <div>
          <h4 className="text-sm mb-2">Promotion:</h4>
          <Input
            value={promotion}
            onChange={(e) => setPromotion(e.target.value)}
            placeholder="Promotion"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Enregistrement..." : "Sauvegarder"}
        </Button>
      </div>
    </>
  );
}
