import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCriteriaSets, CriteriaSet } from "@/services/criteriaSetService";
import CriteriaGridFillComponent from "@/components/evaluation/CriteriaGridFillComponent";
import { fetchEvaluationGrid, submitEvaluationGrid } from "@/services/evaluationGridService";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";

export default function CriteriaGridPage() {
  const [searchParams] = useSearchParams();
  const criteriaSetId = searchParams.get("criteriaSetId");
  const groupId = searchParams.get("groupId");
  const projectId = searchParams.get("projectId");
  const filledBy = searchParams.get("filledBy");
  const [criteriaSet, setCriteriaSet] = useState<CriteriaSet | null>(null);
  const [initialScores, setInitialScores] = useState<Record<string, number>>({});
  const [initialComments, setInitialComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!criteriaSetId) return;
    setLoading(true);
    getCriteriaSets().then((sets) => {
      const set = sets.find((s: CriteriaSet) => s.id === criteriaSetId);
      setCriteriaSet(set || null);
      setLoading(false);
    });
    if (groupId) {
      fetchEvaluationGrid(criteriaSetId, groupId).then((grid) => {
        setInitialScores(grid?.scores || {});
        setInitialComments(grid?.comments || {});
      });
    }
  }, [criteriaSetId, groupId]);

  if (!criteriaSetId) return <div>criteriaSetId manquant dans l'URL</div>;
  if (!groupId) return <div>groupId manquant dans l'URL</div>;
  if (!projectId) return <div>projectId manquant dans l'URL</div>;
  if (!filledBy) return <div>filledBy manquant dans l'URL</div>;
  if (loading || !criteriaSet) return <FallBackPageSkeleton />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Grille d'évaluation</h1>
      <CriteriaGridFillComponent
        criteriaSet={criteriaSet}
        onSubmit={async ({ scores, comments }) => {
          await submitEvaluationGrid({ criteriaSetId, groupId, projectId, filledBy, scores, comments });
        }}
        initialScores={initialScores}
        initialComments={initialComments}
      />
    </div>
  );
}
