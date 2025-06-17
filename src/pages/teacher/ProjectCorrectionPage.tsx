import { useState, useEffect } from "react";
import DashboardLayout from "@/layout/dashboard.layout";
import Divider from "@/components/layout/Divider";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { ProjectStatsCard } from "@/components/project/similarity/ProjectStatsCard";
import { ProjectSimilarityBarChart } from "@/components/project/similarity/ProjectSimilarityBarChart";
import { ProjectFileSimilarityHeatmap } from "@/components/project/similarity/ProjectFileSimilarityHeatmap";
import TextEditor from "@/components/report/TextEditor";
import { useReport } from "@/hooks/api/useReport";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { fetchGroupsWithMembers } from "@/services/groupService";
import { fetchSubmissionsByGroup } from "@/services/submissionService";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import { InfoIcon } from "lucide-react";
import CriteriaGridFillComponent from '@/components/evaluation/CriteriaGridFillComponent';
import { getCriteriaSets, CriteriaSet } from '@/services/criteriaSetService';
import { submitEvaluationGrid, fetchEvaluationGrid } from '@/services/evaluationGridService';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectProvider, useProjectContext } from '@/contexts/ProjectContext';

export default function ProjectCorrectionPageWithProvider() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return (
    <ProjectProvider projectId={id}>
      <ProjectCorrectionPage />
    </ProjectProvider>
  );
}

function ProjectCorrectionPage() {
  const { id } = useParams<{ id: string }>();
  const [groups, setGroups] = useState<any[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [similarityStats] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [criteriaSets, setCriteriaSets] = useState<CriteriaSet[]>([]);
  const [evaluationGrids, setEvaluationGrids] = useState<Record<string, any>>({});
  const [reportCriteriaSets, setReportCriteriaSets] = useState<CriteriaSet[]>([]);
  const [reportEvaluationGrids, setReportEvaluationGrids] = useState<Record<string, any>>({});
  const teacherId = localStorage.getItem('userId') || '';

  const { project } = useProjectContext ? useProjectContext() : { project: null };

  const group = groups[currentGroupIndex];
  const { report, } = useReport(group?.id || "");

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
      const [submissionsRes, deliverablesRes] = await Promise.all([
        fetchSubmissionsByGroup(group.id),
        fetchDeliverablesByProject(id!),
      ]);
      setSubmissions(submissionsRes.data || []);
      setDeliverables(deliverablesRes.data || []);
      setLoading(false);
    }
    if (groups.length > 0) {
      loadGroupData();
    }
  }, [groups, currentGroupIndex, id]);

  // Récupère toutes les grilles de critères livrable
  useEffect(() => {
    async function fetchSets() {
      const sets = await getCriteriaSets('deliverable');
      setCriteriaSets(sets || []);
    }
    fetchSets();
  }, []);

  // Récupère toutes les grilles d'évaluation pour chaque livrable/groupe
  useEffect(() => {
    async function fetchGrids() {
      const group = groups[currentGroupIndex];
      const groupId = group?.id;
      if (!groupId || deliverables.length === 0 || criteriaSets.length === 0) return;
      const grids: Record<string, any> = {};
      for (const deliverable of deliverables) {
        // On suppose que le criteriaSet a un nom unique par livrable
        const set = criteriaSets.find(cs => cs.title === deliverable.name);
        if (set && set.id) {
          grids[deliverable.id] = await fetchEvaluationGrid(set.id, groupId);
        }
      }
      setEvaluationGrids(grids);
    }
    fetchGrids();
  }, [groups, currentGroupIndex, deliverables, criteriaSets]);

  useEffect(() => {
    async function fetchSets() {
      const sets = await getCriteriaSets('report');
      setReportCriteriaSets(sets || []);
    }
    fetchSets();
  }, []);

  useEffect(() => {
    async function fetchGrids() {
      if (!group?.id || reportCriteriaSets.length === 0) return;
      const grids: Record<string, any> = {};
      for (const set of reportCriteriaSets) {
        if (set && set.id) {
          grids[String(set.id)] = await fetchEvaluationGrid(set.id, group.id);
        }
      }
      setReportEvaluationGrids(grids);
    }
    fetchGrids();
  }, [group, reportCriteriaSets]);

  const goPrevious = () => setCurrentGroupIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrentGroupIndex((i) => Math.min(i + 1, groups.length - 1));

  if (loading) return <FallBackPageSkeleton />;

  return (
    <DashboardLayout>
      <Divider text={`Correction du groupe ${group?.name || "-"}`} className="mt-0 cursor-pointer" />
      <div className="flex justify-between items-center mb-4">
        <Button onClick={goPrevious} disabled={currentGroupIndex === 0}>&larr; Groupe précédent</Button>
        <span>Groupe {currentGroupIndex + 1} / {groups.length}</span>
        <Button onClick={goNext} disabled={currentGroupIndex === groups.length - 1}>Groupe suivant &rarr;</Button>
      </div>

      <Tabs defaultValue="rendus" className="w-full mx-auto mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="rendus">Rendus</TabsTrigger>
          <TabsTrigger value="rapport">Rapport</TabsTrigger>
        </TabsList>
        <TabsContent value="rendus">
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
          <div className="w-full mb-8">
            {deliverables.length === 0 && (
              <FlexibleAlert
                variant="info"
                title="Aucun livrable défini pour ce projet."
                icon={<InfoIcon />}
              />
            )}
            {deliverables.map((deliverable) => {
              const criteriaSet = criteriaSets.find(cs => cs.title === deliverable.name);
              const evaluationGrid = evaluationGrids[deliverable.id];
              return (
                <div key={deliverable.id} className="mb-8">
                  <Divider text={deliverable.name} />
                  {criteriaSet ? (
                    <CriteriaGridFillComponent
                      key={criteriaSet.id + '-' + (evaluationGrid?.id || group.id)}
                      criteriaSet={criteriaSet}
                      initialScores={evaluationGrid?.scores ?? {}}
                      initialComments={evaluationGrid?.comments ?? {}}
                      groupId={group.id}
                      projectId={id}
                      filledBy={teacherId}
                      onSubmit={async ({ scores, comments }) => {
                        await submitEvaluationGrid({
                          projectId: id!,
                          criteriaSetId: criteriaSet.id!,
                          groupId: group.id,
                          filledBy: teacherId,
                          scores,
                          comments,
                        });
                      }}
                    />
                  ) : (
                    <div className="mt-8">
                      <FlexibleAlert
                        variant="warning"
                        title={`Aucune grille de notation définie pour le livrable "${deliverable.name}".`}
                        icon={<InfoIcon />}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="rapport">
          <Divider text="Rapport" />
          {report ? (
            <TextEditor rapportId={report.id} readOnly />
          ) : (
            <div className="text-center text-sm text-muted-foreground mt-4">Aucun rapport disponible pour ce groupe.</div>
          )}
          <div className="w-full mb-8">
            {(!project?.reportCriteriaSetId || reportCriteriaSets.length === 0) && (
              <div className="mt-8">
                <FlexibleAlert
                  variant="info"
                  title="Aucune grille de notation rapport définie pour ce projet."
                  icon={<InfoIcon />}
                />
            </div>
            )}
            {project?.reportCriteriaSetId && reportCriteriaSets
              .filter(cs => cs.id === project.reportCriteriaSetId)
              .map((criteriaSet) => {
                const evaluationGrid = reportEvaluationGrids[String(criteriaSet.id)];
                return (
                  <div key={criteriaSet.id} className="mb-8">
                    <Divider text={criteriaSet.title} />
                    <CriteriaGridFillComponent
                      key={criteriaSet.id + '-' + (evaluationGrid?.id || group.id)}
                      criteriaSet={criteriaSet}
                      initialScores={evaluationGrid?.scores ?? {}}
                      initialComments={evaluationGrid?.comments ?? {}}
                      groupId={group.id}
                      projectId={id}
                      filledBy={teacherId}
                      onSubmit={async ({ scores, comments }) => {
                        await submitEvaluationGrid({
                          projectId: id!,
                          criteriaSetId: criteriaSet.id!,
                          groupId: group.id,
                          filledBy: teacherId,
                          scores,
                          comments,
                        });
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>

      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Divider text="Statistiques de plagiat" className="cursor-pointer" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {similarityStats ? (
            <>
              <ProjectStatsCard total={similarityStats.totalProjects} average={similarityStats.averageProjectSimilarity} />
              <ProjectSimilarityBarChart data={similarityStats.projectComparisons} />
              <ProjectFileSimilarityHeatmap data={similarityStats} />
            </>
          ) : (
            <FlexibleAlert
              variant="warning"
              title="Aucune statistique de plagiat disponible pour ce projet."
              icon={<InfoIcon />}
            />
          )}
        </CollapsibleContent>
      </Collapsible>
    </DashboardLayout>
  );
}
