import DashboardLayout from "@/layout/dashboard.layout";
import { useProject } from "@/hooks/api/useProject";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { useParams } from "react-router-dom";
import FlexibleCard from "@/components/template/FlexibleCard";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import RemainingDaysCard from "@/components/project/RemainingDayCard";
import {
  Check,
  ClipboardMinus,
  Download,
  FileText,
  FolderUp,
  GraduationCap,
  X,
} from "lucide-react";
import GroupMemberCard from "@/components/project/GroupMemberCard";
import { User } from "@/types/user.type";
import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";
import { useEffect, useState } from "react";
import TextEditor from "@/components/report/TextEditor";
import { getProjectDetailedById } from "@/services/projectService";

export default function ProjectStudentDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useProject(id || "");
  const [activeTab, setActiveTab] = useState<"resume" | "livrables" | "rapports" | "notes">("resume");

  useEffect(() => {
    getProjectDetailedById(id || "").then((data: any) => {
      if (data) {
        console.log("Project data:", data); 
      }
    });
  }, [id]);


    

  if (loading) return <FallBackPageSkeleton />;

  const fakeDefenseDate = new Date();
  fakeDefenseDate.setDate(fakeDefenseDate.getDate() + 1);
  fakeDefenseDate.setHours(14, 0, 0, 0);

  const teamMembers: User[] = [
    {
      id: "1",
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      role: "student",
    },
    {
      id: "2",
      username: "janesmith",
      firstName: "Jane",
      lastName: "Smith",
      email: "janesmith@gmail.com",
      role: "student",
    },
    {
      id: "3",
      username: "alicejohnson",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alicejohnson@gmail.com",
      role: "student",
    },
  ];

  const links = [
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
  ];

  const selectedRapport = "94eef5e1-70b6-433b-ba7c-44b810f42e09";

  return (
    <DashboardLayout>
      <div className="flex w-full justify-center">
        <FloatingDock items={links} desktopClassName="w-full" />
      </div>

      {activeTab === "resume" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProjectSummaryCard project={project!} />
            <RemainingDaysCard endAt={project!.endAt} />
            <FlexibleCard
              title="Soutenance"
              childrenRightEnd={
                <Button variant="ghost" className="text-gray-500">
                  <Download className="h-4 w-4" />
                </Button>
              }
            >
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-2xl font-bold">
                  {fakeDefenseDate.toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}{" "}
                  à{" "}
                  {fakeDefenseDate.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </FlexibleCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <FlexibleCard title="Statut du projet" className="col-span-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Livrable :</span>
                  <span
                    className={`font-bold ${
                      true ? "text-green-500" : "text-red-500"
                    } flex items-center gap-1`}
                  >
                    {true ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    {true ? "Soumis" : "Non soumis"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Rapport :</span>
                  <span
                    className={`font-bold ${
                      false ? "text-green-500" : "text-red-500"
                    } flex items-center gap-1`}
                  >
                    {false ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    {false ? "Soumis" : "Non soumis"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Soutenance :</span>
                  <span
                    className={`font-bold ${
                      false ? "text-green-500" : "text-red-500"
                    } flex items-center gap-1`}
                  >
                    {false ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    {false ? "Planifiée" : "Non planifiée"}
                  </span>
                </div>
              </div>
            </FlexibleCard>

            <FlexibleCard title="Note du projet" className="col-span-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Livrable :</span>
                  <span className={`font-bold flex items-center gap-1`}>
                    11<span className="text-gray-500">/20</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Rapport :</span>
                  <span className={`font-bold flex items-center gap-1`}>
                    24<span className="text-gray-500">/20</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Soutenance :</span>
                  <span className={`font-bold flex items-center gap-1`}>
                    15<span className="text-gray-500">/20</span>
                  </span>
                </div>
              </div>
            </FlexibleCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <GroupMemberCard members={teamMembers} className="col-span-3" />
          </div>
        </>
      )}

      {activeTab === "livrables" && <>Livrables </>}
      {activeTab === "rapports" && 

        selectedRapport ? (
            <TextEditor rapportId={selectedRapport} />
          ) : (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Aucun rapport disponible pour ce projet.
            </div>
          )
      }
      {activeTab === "notes" && <>Notes </>}
    </DashboardLayout>
  );
}
