import { useState, useEffect } from "react";
import DashboardLayout from "@/layout/dashboard.layout";
import Divider from "@/components/layout/Divider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/hooks/theme-provider";
import { getLogoByTheme } from "@/utils/getLogo";
import { useParams } from "react-router-dom";
import { ProjectStatsCard } from "@/components/project/similarity/ProjectStatsCard";
import { ProjectFileSimilarityHeatmap } from "@/components/project/similarity/ProjectFileSimilarityHeatmap";
import TextEditor from "@/components/report/TextEditor";
// import { useReport } from "@/hooks/api/useReport";
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
import UserCard from "@/components/user/UserCard";

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
  const [allSubmissions, setAllSubmissions] = useState<Record<string, any[]>>({});
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [criteriaSets, setCriteriaSets] = useState<CriteriaSet[]>([]);
  // Toutes les grilles d'évaluation pour tous les groupes et deliverables : { [groupId]: { [deliverableId]: grid } }
  const [allEvaluationGrids, setAllEvaluationGrids] = useState<Record<string, Record<string, any>>>({});
  const [reportCriteriaSets, setReportCriteriaSets] = useState<CriteriaSet[]>([]);
  // Toutes les grilles d'évaluation rapport pour tous les groupes : { [groupId]: { [criteriaSetId]: grid } }
  const [allReportEvaluationGrids, setAllReportEvaluationGrids] = useState<Record<string, Record<string, any>>>({});
  // Tous les rapports pour tous les groupes : { [groupId]: report }
  const [allReports, setAllReports] = useState<Record<string, any>>({});
  const teacherId = localStorage.getItem('userId') || '';

  const { project } = useProjectContext ? useProjectContext() : { project: null };
  const filteredGroups = groups.filter(g => Array.isArray(g.members) && g.members.length >= 1);
  const group = filteredGroups[currentGroupIndex];
  // Rapport du groupe courant
  const report = group ? allReports[group.id] : undefined;
  // Submissions du groupe courant
  const submissions = group ? allSubmissions[group.id] || [] : [];
  // Grilles d'évaluation du groupe courant (par deliverable)
  const evaluationGrids = group && allEvaluationGrids[group.id] ? allEvaluationGrids[group.id] : {};
  // Grilles d'évaluation rapport du groupe courant (par criteriaSet)
  const reportEvaluationGrids = group && allReportEvaluationGrids[group.id] ? allReportEvaluationGrids[group.id] : {};

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
    async function loadAll() {
      setLoading(true);
      setProgress(5);
      const groupsData = await fetchGroupsWithMembers(id!);
      setGroups(groupsData);
      setCurrentGroupIndex(0);
      setProgress(15);
      const deliverablesRes = await fetchDeliverablesByProject(id!);
      const deliverablesList = deliverablesRes.data || [];
      setDeliverables(deliverablesList);
      setProgress(25);
      const submissionsObj: Record<string, any[]> = {};
      const allReportsObj: Record<string, any> = {};
      const allEvalGridsObj: Record<string, Record<string, any>> = {};
      const allReportEvalGridsObj: Record<string, Record<string, any>> = {};
      const deliverableCriteriaSets = await getCriteriaSets('deliverable');
      setCriteriaSets(deliverableCriteriaSets || []);
      setProgress(30);
      const reportCriteriaSetsList = await getCriteriaSets('report');
      setReportCriteriaSets(reportCriteriaSetsList || []);
      setProgress(35);
      // Progression par groupe
      const totalSteps = groupsData.length * 4; // submissions, report, evalGrids, reportEvalGrids
      let doneSteps = 0;
      await Promise.all(
        groupsData.map(async (g: any) => {
          const submissionsRes = await fetchSubmissionsByGroup(g.id);
          submissionsObj[g.id] = submissionsRes.data || [];
          doneSteps++;
          setProgress(35 + Math.round((doneSteps / totalSteps) * 65));
          let report = undefined;
          try {
            const res = await fetch(`/api/reports/group/${g.id}`);
            if (res.ok) report = await res.json();
          } catch {}
          allReportsObj[g.id] = report;
          doneSteps++;
          setProgress(35 + Math.round((doneSteps / totalSteps) * 65));
          const evalGrids: Record<string, any> = {};
          for (const deliverable of deliverablesList) {
            if (deliverable.criteriaSetId) {
              evalGrids[deliverable.id] = await fetchEvaluationGrid(
                deliverable.criteriaSetId,
                g.id,
                deliverable.id
              );
            }
          }
          doneSteps++;
          setProgress(35 + Math.round((doneSteps / totalSteps) * 65));
          const reportEvalGrids: Record<string, any> = {};
          for (const set of reportCriteriaSetsList || []) {
            if (set && set.id) {
              reportEvalGrids[String(set.id)] = await fetchEvaluationGrid(
                set.id,
                g.id,
                undefined,
                undefined,
                report?.id
              );
            }
          }
          doneSteps++;
          setProgress(35 + Math.round((doneSteps / totalSteps) * 65));
          allEvalGridsObj[g.id] = evalGrids;
          allReportEvalGridsObj[g.id] = reportEvalGrids;
        })
      );
      setAllSubmissions(submissionsObj);
      setAllReports(allReportsObj);
      setAllEvaluationGrids(allEvalGridsObj);
      setAllReportEvaluationGrids(allReportEvalGridsObj);
      setProgress(100);
      setTimeout(() => setLoading(false), 200); // petit délai pour la fluidité
    }
    loadAll();
  }, [id]);


  const goPrevious = () => setCurrentGroupIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrentGroupIndex((i) => Math.min(i + 1, groups.length - 1));

  // Fonction pour mettre à jour localement les grilles d'évaluation livrable
  const handleSubmitEvaluationGrid = async (args: any) => {
    const { groupId, deliverableId, scores, comments } = args;
    const updated = await submitEvaluationGrid(args);
    setAllEvaluationGrids(prev => ({
      ...prev,
      [groupId]: {
        ...(prev[groupId] || {}),
        [deliverableId]: {
          ...((prev[groupId] && prev[groupId][deliverableId]) || {}),
          scores,
          comments,
        },
      },
    }));
    return updated;
  };

  // Fonction pour mettre à jour localement les grilles d'évaluation rapport
  const handleSubmitReportEvaluationGrid = async ({ criteriaSetId, groupId, scores, comments, reportId }: any) => {
    const updated = await submitEvaluationGrid({
      projectId: id!,
      criteriaSetId,
      groupId,
      reportId,
      filledBy: teacherId,
      scores,
      comments,
    });
    setAllReportEvaluationGrids(prev => ({
      ...prev,
      [groupId]: {
        ...(prev[groupId] || {}),
        [criteriaSetId]: {
          ...((prev[groupId] && prev[groupId][criteriaSetId]) || {}),
          scores,
          comments,
        },
      },
    }));
    return updated;
  };

  // Loading steps for display
  const loadingSteps = [
    "Chargement des groupes…",
    "Chargement des livrables…",
    "Chargement des grilles d'évaluation livrable…",
    "Chargement des grilles d'évaluation rapport…",
    "Chargement des rendus…",
    "Chargement des rapports…",
    "Finalisation…"
  ];

  // Compute current step based on progress
  let currentStep = 0;
  if (progress < 10) currentStep = 0;
  else if (progress < 20) currentStep = 1;
  else if (progress < 30) currentStep = 2;
  else if (progress < 40) currentStep = 3;
  else if (progress < 70) currentStep = 4;
  else if (progress < 95) currentStep = 5;
  else currentStep = 6;

  if (loading) {
    const { theme } = useTheme();
    const logoUrl = getLogoByTheme(theme === "dark" ? "light" : "dark").logoText;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-md flex flex-col items-center">
          <img
            src={logoUrl}
            alt="Logo"
            className=" mt-2 w-36 h-36 object-contain drop-shadow"
            draggable={false}
          />
          <Progress value={progress} className="h-2" />
          <ul className="mt-4 mb-2 text-sm text-gray-500">
            {loadingSteps.map((step, idx) => (
              <li key={step} className={
                idx === currentStep
                  ? "font-semibold text-primary flex items-center"
                  : idx < currentStep
                  ? "text-green-600 flex items-center"
                  : "opacity-60 flex items-center"
              }>
                {idx < currentStep && <span className="mr-2">✔️</span>}
                {idx === currentStep && <span className="mr-2 animate-spin">⏳</span>}
                {idx > currentStep && <span className="mr-2">•</span>}
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
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
        <div className="flex items-center justify-between mb-4 w-full">
          <TabsList className="mb-0">
            <TabsTrigger value="rendus">Rendus</TabsTrigger>
            <TabsTrigger value="rapport">Rapport</TabsTrigger>
          </TabsList>
          {group && Array.isArray(group.members) && group.members.length > 0 && (
            <div className="flex gap-2 ml-4 w-full max-w-2xl">
              {group.members.map((member: any) => {
                // Format lastName in UPPERCASE and firstName with first letter capitalized
                const formattedLastName = member.lastName ? member.lastName.toUpperCase() : '';
                const formattedFirstName = member.firstName
                  ? member.firstName.charAt(0).toUpperCase() + member.firstName.slice(1).toLowerCase()
                  : '';
                return (
                  <UserCard
                    key={member.id}
                    firstName={formattedFirstName}
                    lastName={formattedLastName}
                  />
                );
              })}
            </div>
          )}
        </div>
        <TabsContent value="rendus">
          <DeliverableTabsSection
            deliverables={deliverables}
            criteriaSets={criteriaSets}
            evaluationGrids={evaluationGrids}
            submissions={submissions}
            group={group}
            id={id!}
            teacherId={teacherId}
            submitEvaluationGrid={handleSubmitEvaluationGrid}
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
              group &&
              reportCriteriaSets
                .filter((cs) => cs.id === project.reportCriteriaSetId)
                .map((criteriaSet) => {
                  const evaluationGrid = reportEvaluationGrids[String(criteriaSet.id)];
                  return (
                    <div key={criteriaSet.id} className="mb-4">
                      <Divider text={criteriaSet.title} />
                      <CriteriaGridFillComponent
                        key={criteriaSet.id + "-" + (evaluationGrid?.id || group.id)}
                        criteriaSet={criteriaSet}
                        initialScores={evaluationGrid?.scores ?? {}}
                        initialComments={evaluationGrid?.comments ?? {}}
                        groupId={group.id}
                        projectId={id}
                        filledBy={teacherId}
                        onSubmit={async ({ scores, comments }) => {
                          await handleSubmitReportEvaluationGrid({
                            criteriaSetId: criteriaSet.id!,
                            groupId: group.id,
                            scores,
                            comments,
                            reportId: report?.id ?? null,
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
                  total={project.comparisonResult?.totalGroups ?? 0}
                  average={project.comparisonResult?.averageGroupSimilarity ?? 0}
                  project={project}
                />
              <ProjectFileSimilarityHeatmap
                  data={project?.comparisonResult ?? {}}
                  groups={project?.groups ?? []}
                  projectId={project?.id || ""}
                />
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
