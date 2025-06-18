import { useEffect, useState } from "react";
import { getCriteriaSets, CriteriaSet } from "@/services/criteriaSetService";

export default function ReportEditComponent({ reportCriteriaSetId, setReportCriteriaSetId }: { reportCriteriaSetId?: string, setReportCriteriaSetId: (id?: string) => void }) {
  const [criteriaSets, setCriteriaSets] = useState<CriteriaSet[]>([]);

  useEffect(() => {
    getCriteriaSets().then(setCriteriaSets).catch(() => {});
  }, []);

  return (
    <div>
      <label className="block font-medium mb-1">Grille de notation pour les rapports</label>
      <select
        className="border rounded px-2 py-1 w-full"
        value={reportCriteriaSetId || ''}
        onChange={e => setReportCriteriaSetId(e.target.value || undefined)}
      >
        <option value="">Aucune</option>
        {criteriaSets.filter(cs => cs.type === 'report').map(cs => (
          <option key={cs.id} value={cs.id}>{cs.title}</option>
        ))}
      </select>
    </div>
  );
}
