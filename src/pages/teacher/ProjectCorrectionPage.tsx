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
import { fetchGroupsWithMembers } from "@/services/groupService";
import { fetchSubmissionsByGroup, downloadSubmission } from "@/services/submissionService";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import { InfoIcon } from "lucide-react";
import CriteriaGridFillComponent from '@/components/evaluation/CriteriaGridFillComponent';
import { getCriteriaSets, CriteriaSet } from '@/services/criteriaSetService';
import { submitEvaluationGrid, fetchEvaluationGrid } from '@/services/evaluationGridService';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectProvider, useProjectContext } from '@/contexts/ProjectContext';
import { motion, AnimatePresence } from "framer-motion";
import { fetchRuleResultsBySubmission } from '@/services/ruleResultService';
import { Github, Archive, CheckCircle, XCircle } from 'lucide-react';

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
  const [, setLoading] = useState(true);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [criteriaSets, setCriteriaSets] = useState<CriteriaSet[]>([]);
  const [evaluationGrids, setEvaluationGrids] = useState<Record<string, any>>({});
  const [reportCriteriaSets, setReportCriteriaSets] = useState<CriteriaSet[]>([]);
  const [reportEvaluationGrids, setReportEvaluationGrids] = useState<Record<string, any>>({});
  const teacherId = localStorage.getItem('userId') || '';

  const { project } = useProjectContext ? useProjectContext() : { project: null };

  const filteredGroups = groups.filter(g => Array.isArray(g.members) && g.members.length >= 1);
  const group = filteredGroups[currentGroupIndex];
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

  useEffect(() => {
    async function fetchSets() {
      const sets = await getCriteriaSets('deliverable');
      setCriteriaSets(sets || []);
    }
    fetchSets();
  }, []);

  useEffect(() => {
    async function fetchGrids() {
      const group = groups[currentGroupIndex];
      const groupId = group?.id;
      if (!groupId || deliverables.length === 0) return;
      const grids: Record<string, any> = {};
      for (const deliverable of deliverables) {
        if (deliverable.criteriaSetId) {
          grids[deliverable.id] = await fetchEvaluationGrid(
            deliverable.criteriaSetId,
            groupId,
            deliverable.id // Ajout du deliverableId pour l'unicité
          );
        }
      }
      setEvaluationGrids(grids);
    }
    fetchGrids();
  }, [groups, currentGroupIndex, deliverables]);

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
          grids[String(set.id)] = await fetchEvaluationGrid(
            set.id,
            group.id,
            undefined,
            undefined,
            report?.id // Ajout du reportId pour l'unicité
          );
        }
      }
      setReportEvaluationGrids(grids);
    }
    fetchGrids();
  }, [group, reportCriteriaSets, report]);

  const goPrevious = () => setCurrentGroupIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrentGroupIndex((i) => Math.min(i + 1, groups.length - 1));

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={goPrevious} disabled={currentGroupIndex === 0}>&larr; Groupe précédent</Button>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentGroupIndex}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mx-4 font-semibold"
          >
            {group?.name ? group.name : `Groupe ${currentGroupIndex + 1} / ${filteredGroups.length}`}
          </motion.span>
        </AnimatePresence>
        <Button onClick={goNext} disabled={currentGroupIndex === filteredGroups.length - 1}>Groupe suivant &rarr;</Button>
      </div>

      <Tabs defaultValue="rendus" className="w-full mx-auto mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="rendus">Rendus</TabsTrigger>
          <TabsTrigger value="rapport">Rapport</TabsTrigger>
        </TabsList>
        <TabsContent value="rendus">
          <div className="w-full mt-8 mb-8">
            {deliverables.length === 0 && (
              <FlexibleAlert
                variant="info"
                title="Aucune grille de notation de livrable défini pour ce projet."
                icon={<InfoIcon />}
              />
            )}
            {deliverables.map((deliverable) => {
              const criteriaSet = criteriaSets.find(cs => cs.id === deliverable.criteriaSetId);
              const evaluationGrid = evaluationGrids[deliverable.id];
              // Trouver le rendu pour ce livrable, uniquement pour le groupe courant
              const submission = submissions.find((s) => s.deliverableId === deliverable.id && s.groupId === group.id);
              // Affichage détaillé du rendu
              return (
                <div key={deliverable.id} className="mb-8">
                  <Divider text={deliverable.name} />
                  {submission ? (
                    <DetailedSubmissionView
                      submission={submission}
                      deliverable={deliverable}
                    />
                  ) : (
                    <div className="text-sm text-gray-500 mb-4">Aucun rendu pour ce livrable.</div>
                  )}
                  {criteriaSet ? (
                    <CriteriaGridFillComponent
                      key={deliverable.id + '-' + group.id}
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
                          deliverableId: deliverable.id,
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
            <TextEditor rapportId={report.id} projectSections={project?.sections || []} />
          ) : (
            <FlexibleAlert
              variant="info"
              title="Aucun rapport disponible pour ce groupe."
              icon={<InfoIcon />}
            />
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
                if (!report) return null; // Ne pas afficher la grille si pas de rapport
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
                        if (!report) return; // Sécurité
                        await submitEvaluationGrid({
                          projectId: id!,
                          criteriaSetId: criteriaSet.id!,
                          groupId: group.id,
                          reportId: report.id,
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

// Composant détaillé d'affichage d'un rendu étudiant pour un livrable
function DetailedSubmissionView({ submission, deliverable }: { submission: any, deliverable: any }) {
  const [ruleResults, setRuleResults] = useState<any[]>([]);
  useEffect(() => {
    fetchRuleResultsBySubmission(submission.id)
      .then(res => setRuleResults(res.data || []))
      .catch(err => {
        if (err?.response?.status === 404) setRuleResults([]); // Pas de résultat, on ignore
        else console.error(err);
      });
  }, [submission.id]);
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-white/80">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {deliverable.submissionType === 'git' ? <Github className="w-5 h-5 text-gray-700" /> : <Archive className="w-5 h-5 text-gray-700" />}
          <span className="font-semibold text-lg">{deliverable.name}</span>
          {submission.isLate && <span className="text-xs text-orange-600 font-bold ml-2">Rendu en retard</span>}
        </div>
        <div className="flex gap-2 items-center">
          {deliverable.submissionType === 'git' && submission.gitRepoUrl ? (
            <a href={submission.gitRepoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir le dépôt GitHub</a>
          ) : (
            submission.archiveObjectName && (
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={async () => {
                  const res = await downloadSubmission(submission.id);
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", submission.filename || "livrable.zip");
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode?.removeChild(link);
                }}
              >
                Télécharger l'archive
              </button>
            )
          )}
        </div>
      </div>
      <div className="mt-2">
        <span className="font-semibold text-base">Résultats des règles automatiques :</span>
        {ruleResults.length === 0 ? (
          <div className="text-xs text-gray-500 mt-1">Aucune règle vérifiée ou résultat non disponible.</div>
        ) : (
          <ul className="mt-2 space-y-1">
            {ruleResults.map((r) => (
              <li key={r.id} className="flex items-center gap-2 text-sm">
                {r.passed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                <span className={r.passed ? "text-green-700" : "text-red-700 font-semibold"}>{r.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
