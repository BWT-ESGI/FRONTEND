import { useState, useEffect } from "react";
import DashboardLayout from "@/layout/dashboard.layout";
import Divider from "@/components/layout/Divider";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { ProjectStatsCard } from "@/components/project/similarity/ProjectStatsCard";
import { ProjectFileSimilarityHeatmap } from "@/components/project/similarity/ProjectFileSimilarityHeatmap";
import TextEditor from "@/components/report/TextEditor";
import { useReport } from "@/hooks/api/useReport";
import { fetchGroupsWithMembers } from "@/services/groupService";
import { fetchSubmissionsByGroup } from "@/services/submissionService";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import { Download, InfoIcon } from "lucide-react";
import CriteriaGridFillComponent from '@/components/evaluation/CriteriaGridFillComponent';
import { getCriteriaSets, CriteriaSet } from '@/services/criteriaSetService';
import { submitEvaluationGrid, fetchEvaluationGrid } from '@/services/evaluationGridService';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectProvider, useProjectContext } from '@/contexts/ProjectContext';
import { motion, AnimatePresence } from "framer-motion";
import { DeliverableTabsSection } from "../../components/ProjectCorrection/DeliverableTabsSection";
import { generateFullReportPdf } from "@/services/pdfReportService";

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
  const { report } = useReport(group?.id || "");

  const handleDownloadFullReport = () => {
    if (report && Array.isArray(report.sections)) {
      generateFullReportPdf(
        report.sections,
        project?.name || "Rapport complet",
        group?.name,
        group?.members || []
      );
    }
  };

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
            deliverable.id
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
            report?.id
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
        <Button onClick={goPrevious} disabled={currentGroupIndex === 0}>
          &larr; Groupe précédent
        </Button>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentGroupIndex}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mx-4 font-semibold"
          >
            {group?.name
              ? group.name
              : `Groupe ${currentGroupIndex + 1} / ${filteredGroups.length}`}
          </motion.span>
        </AnimatePresence>
        <Button
          onClick={goNext}
          disabled={currentGroupIndex === filteredGroups.length - 1}
        >
          Groupe suivant &rarr;
        </Button>
      </div>

      <Tabs defaultValue="rendus" className="w-full mx-auto mb-4">
        <TabsList className="mb-4">
          <TabsTrigger value="rendus">Rendus</TabsTrigger>
          <TabsTrigger value="rapport">Rapport</TabsTrigger>
        </TabsList>

        <TabsContent value="rendus">
          <DeliverableTabsSection
            deliverables={deliverables}
            criteriaSets={criteriaSets}
            evaluationGrids={evaluationGrids}
            submissions={submissions}
            group={group}
            id={id!}
            teacherId={teacherId}
            submitEvaluationGrid={submitEvaluationGrid}
          />
        </TabsContent>

        <TabsContent value="rapport">
          {report ? (
            <>
              <div className="flex justify-start mb-4">
                <Button
                  variant="outline"
                  onClick={handleDownloadFullReport}
                  disabled={!report || !Array.isArray(report.sections)}
                >
                  <Download className="mr-2" />
                  Télécharger le rapport complet (PDF)
                </Button>
              </div>
              <TextEditor
                rapportId={report.id}
                projectSections={project?.sections || []}
                readOnly={true}
              />
            </>
          ) : (
            <FlexibleAlert
              variant="info"
              title="Aucun rapport disponible pour ce groupe."
              icon={<InfoIcon />}
            />
          )}

          <div className="w-full mb-4">
            {(!project?.reportCriteriaSetId ||
              reportCriteriaSets.length === 0) && (
              <div className="mt-4">
                <FlexibleAlert
                  variant="info"
                  title="Aucune grille de notation rapport définie pour ce projet."
                  icon={<InfoIcon />}
                />
              </div>
            )}
            {project?.reportCriteriaSetId &&
              reportCriteriaSets
                .filter((cs) => cs.id === project.reportCriteriaSetId)
                .map((criteriaSet) => {
                  const evaluationGrid =
                    reportEvaluationGrids[String(criteriaSet.id)];
                  return (
                    <div key={criteriaSet.id} className="mb-4">
                      <Divider text={criteriaSet.title} />
                      <CriteriaGridFillComponent
                        key={
                          criteriaSet.id +
                          "-" +
                          (evaluationGrid?.id || group.id)
                        }
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
          {project?.comparisonResult ? (
            <>
              <ProjectStatsCard
                total={project?.comparisonResult.totalGroups}
                average={project?.comparisonResult.averageGroupSimilarity}
              />
              <ProjectFileSimilarityHeatmap data={project?.comparisonResult ?? {}} />
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
