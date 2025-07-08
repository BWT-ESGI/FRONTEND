import DashboardLayout from "@/layout/dashboard.layout";
import { useProject } from "@/hooks/api/useProject";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import FlexibleCard from "@/components/template/FlexibleCard";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import RemainingDaysCard from "@/components/project/RemainingDayCard";
import { ClipboardMinus, FileText, FolderUp, GraduationCap, X } from "lucide-react";
import GroupMemberCard from "@/components/project/GroupMemberCard";
import { useEffect, useState } from "react";
import TextEditor from "@/components/report/TextEditor";
import getUserInfoFromLocalStorage from "@/utils/getUserInfoFromLocalStorage";
import getGroupOfStudentFromProject from "@/utils/getGroupOfStudentFromProject";
import { useDefense } from "@/hooks/api/useDefence";
import { FloatingDock } from "@/components/ui/floating-dock";
import DefenseCard from "@/components/project/DefenseCard";
import { useReport } from "@/hooks/api/useReport";
import toast from "react-hot-toast";
import { leaveGroup } from "@/services/groupService";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import { Button } from "@/components/ui/button";
import { createRapport } from "@/services/rapportService";
import StudentDeliverableTimeline from "@/components/delivrable/StudentDeliverableTimeline";
import { Deliverable, Submission } from "@/types/deliverable.type";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import { fetchSubmissionsByGroup } from "@/services/submissionService";
import ProjectDeliverableSteps from "@/components/project/ProjectDeliverableSteps";
import ProjectGrades from "@/components/project/ProjectGrades";


export default function ProjectStudentDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading: projectLoading } = useProject(id || "");
  const groupId = project?.groups?.[0]?.id;
  const { defense, loading: defenseLoading } = useDefense(groupId || "");
  const { report, loading: reportLoading, setReport } = useReport(groupId || "");
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const userInfo = getUserInfoFromLocalStorage();
  const userId = userInfo ? userInfo.userId : null;
  const navigate = useNavigate();

  const handleLeaveGroup = async () => {
    if (!groupId || !userId) return;
    try {
      await leaveGroup(groupId, userId);
      toast.success("Vous avez quitté le groupe");
      navigate("/students/projets");
    } catch (error) {
      console.error("Erreur lors du départ du groupe :", error);
      toast.error("Impossible de quitter le groupe");
    }
  };

  const [activeTab, setActiveTab] = useState<"resume" | "livrables" | "rapports" | "notes">("resume");

  useEffect(() => {
    if (project && userId) {
      getGroupOfStudentFromProject(project, userId).then((groups) => {
        if (groups) {
          project.groups = groups;
        }
      });
    }
    if (!project || !groupId) return;
    Promise.all([
      fetchDeliverablesByProject(project.id),
      fetchSubmissionsByGroup(groupId),
    ])
      .then(([dRes, sRes]) => {
        setDeliverables(Array.isArray(dRes.data) ? dRes.data : []);
        setSubmissions(Array.isArray(sRes.data) ? sRes.data : []);
      })
      .catch((err) => {
        if (err?.response?.status !== 404) {
          toast.error("Erreur lors du chargement des livrables ou rendus");
        }
      })
  }, [project]);

  if (projectLoading) return <FallBackPageSkeleton />;
  if (reportLoading) return <FallBackPageSkeleton />;
  if (!groupId) {
    return (
      <DashboardLayout>
        <FlexibleAlert
          title={<div><div>Aucun groupe attribué</div><div className="text-sm text-neutral-500">Vous n'avez pas été attribué à un groupe pour ce projet. Veuillez contacter votre professeur.</div></div>}
          icon={<X className="h-6 w-6 text-red-500" />}
        />
      </DashboardLayout>
    );
  }

  const tabs = [
    {
      title: "Résumé",
      icon: (
        <ClipboardMinus className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => setActiveTab("resume"),
    },
    {
      title: "Livrables",
      icon: (
        <FolderUp className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => setActiveTab("livrables"),
    },
    {
      title: "Raports",
      icon: (
        <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => setActiveTab("rapports"),
    },
    {
      title: "Notes",
      icon: (
        <GraduationCap className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => setActiveTab("notes"),
    },
    {
      title: "Quitter le groupe",
      icon: (
        <X className="h-full w-full text-red-500" />
      ),
      onClick: handleLeaveGroup,
    },
  ];

  const start = new Date(defense?.start || "");
  const end = new Date(defense?.end || "");
  const duration = Math.abs(end.getTime() - start.getTime());
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const formattedDuration = `${hours > 0 ? `${hours}h` : ""} ${minutes > 0 ? `${minutes}m` : ""
    }`.trim();

  const handleCreateReport = async () => {
    if (!project) return;
    try {
      if (!groupId) {
        toast.error("Aucun groupe trouvé");
        return;
      }
      await createRapport(groupId).then((reportFromApi) => {
        setReport(reportFromApi);
        toast.success("Rapport créé avec succès");
      }).catch((error) => {
        console.error("Erreur lors de la création du rapport :", error);
        toast.error("Erreur lors de la création du rapport");
      });
    } catch (error) {
      console.error("Erreur lors de la création du rapport :", error);
      toast.error("Erreur lors de la création du rapport");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex w-full justify-center">
        <FloatingDock items={tabs} desktopClassName="w-full" />
      </div>

      {activeTab === "resume" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProjectSummaryCard project={project!} />
            <RemainingDaysCard endAt={project!.endAt} />
            <DefenseCard
              defense={defense}
              loading={projectLoading || defenseLoading}
              formattedDuration={formattedDuration}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <FlexibleCard className="col-span-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <ProjectDeliverableSteps
                    project={project}
                    deliverables={deliverables}
                    submissions={submissions}
                    defense={defense}
                  />
                </div>
              </div>
            </FlexibleCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <GroupMemberCard
              members={project?.groups[0]?.members || []}
              groupName={project?.groups[0]?.name || "Groupe inconnu"}
              className="col-span-3"
            />
          </div>
        </>
      )}

      {activeTab === "livrables" && project && groupId && (
        <StudentDeliverableTimeline projectId={project.id} groupId={groupId} />
      )}
      {activeTab === "rapports" ? (
        report ? (
          <TextEditor rapportId={report.id} projectSections={project.sections} readOnly={false}/>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FlexibleAlert
              title="Aucun rapport trouvé"
              icon={<ClipboardMinus className="h-4 w-4 text-neutral-500" />}
            />
            <Button onClick={() => handleCreateReport()} className="mt-4">
              {" "}
              Créer un rapport
            </Button>
          </div>
        )
      ) : null}
      {activeTab === "notes" && project && (
        <ProjectGrades projectId={project.id} />
      )}
    </DashboardLayout>
  );
}
