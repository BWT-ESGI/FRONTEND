import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Project, ProjectStatus } from "@/types/project.type";
import { useState } from "react";
import { updateProject } from "@/services/projectService";
import toast from "react-hot-toast";
import { useProjectContext } from "@/contexts/ProjectContext";
import NotFoundPage from "@/pages/global/NotFoundPage";
import { Textarea } from "@/components/ui/textarea";
import ProjectStatusSelector from "@/components/project/ProjectStatusSelector";

export default function ProjectGlobalEditComponent() {
  const { project, setProject } = useProjectContext();
  if (!project) return <NotFoundPage />;

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [startDate, setStartDate] = useState(
    project.createdAt ? project.createdAt.toString().slice(0, 10) : ""
  );
  const [endDate, setEndDate] = useState(
    project.endAt ? project.endAt.toString().slice(0, 10): ""
  );
  const [promotion] = useState(project.promotion?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: Partial<Project> = {
        name,
        description,
        status,
        createdAt: new Date(startDate),
        endAt: new Date(endDate),
        promotion: project.promotion
          ? { ...project.promotion, name: promotion }
          : undefined,
      };
      await updateProject(String(project.id), payload);
      setProject({
        ...project,
        ...payload,
      });
      toast.success("Modifications sauvegardées avec succès");
    } catch (e: any) {
      toast.error("Erreur lors de la sauvegarde");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold mb-4">
          <Info className="inline-block mr-2" />
          Informations générales
        </h2>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Enregistrement..." : "Sauvegarder"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ProjectStatusSelector status={status} setStatus={setStatus} />

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
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du projet"
          />
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="w-full">
            <h4 className="text-sm mb-2">Date de début:</h4>
            <Input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Date de début"
              type="date"
            />
          </div>

          <div className="w-full">
            <h4 className="text-sm mb-2">Date de fin:</h4>
            <Input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Date de fin"
              type="date"
            />
          </div>
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
