import { useEffect, useState } from "react";
import { getCriteriaSets, CriteriaSet } from "@/services/criteriaSetService";
import { useProjectContext } from "@/contexts/ProjectContext";
import { updateProject } from "@/services/projectService";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import FlexibleCard from "../template/FlexibleCard";

export default function ReportEditComponent({ reportCriteriaSetId, setReportCriteriaSetId }: { reportCriteriaSetId?: string, setReportCriteriaSetId: (id?: string) => void }) {
  const [criteriaSets, setCriteriaSets] = useState<CriteriaSet[]>([]);
  const { project, setProject } = useProjectContext();

  useEffect(() => {
    getCriteriaSets().then(setCriteriaSets).catch(() => {});
  }, []);

  const handleSaveCriteriaSet = async () => {
    if (!project) return;
    try {
      await updateProject(project.id, { reportCriteriaSetId });
      setProject({ ...project, reportCriteriaSetId });
      toast.success("Grille de notation des rapports sauvegardée");
    } catch (e) {
      toast.error("Erreur lors de la sauvegarde de la grille de rapport");
    }
  };

  return (
    <FlexibleCard title="Grille de notation des rapports" className="mt-4">
      <div className="mb-4">
        <select
          className="border rounded px-2 py-1 w-full"
          value={reportCriteriaSetId || ""}
          onChange={(e) => setReportCriteriaSetId(e.target.value || undefined)}
        >
          <option value="">Aucune</option>
          {criteriaSets
            .filter((cs) => cs.type === "report")
            .map((cs) => (
              <option key={cs.id} value={cs.id}>
                {cs.title}
              </option>
            ))}
        </select>
        <Button className="mt-2" onClick={handleSaveCriteriaSet}>
          Sauvegarder la grille
        </Button>
      </div>
    </FlexibleCard>
  );
}
