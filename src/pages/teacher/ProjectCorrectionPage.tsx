import { useState, useEffect } from "react";
import DashboardLayout from "@/layout/dashboard.layout";
import Divider from "@/components/layout/Divider";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { ProjectStatsCard } from "@/components/project/similarity/ProjectStatsCard";
import { ProjectSimilarityBarChart } from "@/components/project/similarity/ProjectSimilarityBarChart";
import { ProjectFileSimilarityHeatmap } from "@/components/project/similarity/ProjectFileSimilarityHeatmap";
import TextEditor from "@/components/report/TextEditor";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { fetchGroupsWithMembers } from "@/services/groupService";
import { fetchSubmissionsByGroup } from "@/services/submissionService";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import { useReport } from "@/hooks/api/useReport";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import { InfoIcon } from "lucide-react";

export default function ProjectCorrectionPage() {
  const { id } = useParams<{ id: string }>();
  const [groups, setGroups] = useState<any[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [similarityStats] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const groupsData = await fetchGroupsWithMembers(id!);
      setGroups(groupsData);
      setCurrentGroupIndex(0);
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    async function loadGroupData() {
      if (!groups[currentGroupIndex]) return;
      setLoading(true);
      const group = groups[currentGroupIndex];
      const [submissionsRes] = await Promise.all([
        fetchSubmissionsByGroup(group.id),
        fetchDeliverablesByProject(id!),
      ]);
      setSubmissions(submissionsRes.data || []);
      setLoading(false);
    }
    if (groups.length > 0) {
      loadGroupData();
    }
  }, [groups, currentGroupIndex, id]);

  const goPrevious = () => setCurrentGroupIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrentGroupIndex((i) => Math.min(i + 1, groups.length - 1));

  const group = groups[currentGroupIndex];
  const groupId = group?.id;
  const { report, loading: reportLoading } = useReport(groupId || "");

  if (loading || reportLoading) return <FallBackPageSkeleton />;

  return (
    <DashboardLayout>
      <Divider text={`Correction du groupe ${group?.name || "-"}`} className="mt-0" />
      <div className="flex justify-between items-center mb-4">
        <Button onClick={goPrevious} disabled={currentGroupIndex === 0}>&larr; Groupe précédent</Button>
        <span>Groupe {currentGroupIndex + 1} / {groups.length}</span>
        <Button onClick={goNext} disabled={currentGroupIndex === groups.length - 1}>Groupe suivant &rarr;</Button>
      </div>
      <Divider text="Rendus du groupe" />
      <div className="mb-4">
        {submissions.length > 0 ? (
          <ul>
            {submissions.map((s) => (
              <li key={s.id} className="mb-2">
                <span className="font-semibold">{s.fileName}</span> - Rendu à l'heure : {s.onTime ? "Oui" : "Non"}
              </li>
            ))}
          </ul>
        ) : (
          <FlexibleAlert variant="info" title="Aucun rendu disponible pour ce groupe" icon={<InfoIcon />} />
        )}
      </div>
      <Divider text="Rapport" />
      {report ? (
        <TextEditor rapportId={report.id} readOnly />
      ) : (
        <div className="text-center text-sm text-muted-foreground mt-4">Aucun rapport disponible pour ce groupe.</div>
      )}
      <Divider text="Statistiques de plagiat" />
      {similarityStats ? (
        <>
          <ProjectStatsCard total={similarityStats.totalProjects} average={similarityStats.averageProjectSimilarity} />
          <ProjectSimilarityBarChart data={similarityStats.projectComparisons} />
          <ProjectFileSimilarityHeatmap data={similarityStats} />
        </>
      ) : (
        <div className="text-muted-foreground">Aucune statistique disponible.</div>
      )}
    </DashboardLayout>
  );
}
