import { SetStateAction, useState } from "react";
import DashboardLayout from "@/layout/dashboard.layout";
import { useProject } from "@/hooks/api/useProject";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import Divider from "@/components/layout/Divider";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import SummaryOverviewSection from "@/components/project/SummaryOverviewSection";
import SummaryGradesChartSection from "@/components/project/SummaryGradesChartSection";
import SummaryGradesStatsSection from "@/components/project/SummaryGradesStatsSection";
import ProjectGroupsManager from "@/components/group/ProjectGroupsManager";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupBuilder from "@/components/group/ GroupBuilder";
import NavReport from "@/components/report/NavReport";
import TextEditor from "@/components/report/TextEditor";
import { Report } from "@/types/report.type";
import { useParams } from "react-router-dom";

export default function ProjectDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useProject(id || "");
  const [tab, setTab] = useState("overview");

  //groups
  const [groupMode, setGroupMode] = useState<"manual" | "random" | "student_choice">(
    "manual"
  );
  const [minSize, setMinSize] = useState(2);
  const [maxSize, setMaxSize] = useState(5);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedRapport, setSelectedRapport] = useState<Report | null>(null);

  if (loading) return <FallBackPageSkeleton />;

  return (
    <DashboardLayout>
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="groups">Groupes</TabsTrigger>
          <TabsTrigger value="rapports">Rapports</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "overview" && (
        <>
          <Divider text="Résumé du projet" className="mt-0" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project && <ProjectSummaryCard project={project} btn={false} />}
          </div>

          <SummaryOverviewSection project={project} />
          <SummaryGradesChartSection />
          <SummaryGradesStatsSection />
        </>
      )}

      {tab === "groups" && (
        <>
          <Divider text="Groupes" />
          <ProjectGroupsManager
            mode={groupMode}
            setMode={setGroupMode}
            minSize={minSize}
            maxSize={maxSize}
            setMinSize={setMinSize}
            setMaxSize={setMaxSize}
            deadline={deadline}
            setDeadline={setDeadline}
          />
          <Divider text="Gérer" />
          <GroupBuilder
            mode={groupMode}
            minSize={minSize}
            maxSize={maxSize}
            deadline={deadline}
          />
        </>
      )}

      {tab === "rapports" && (
        <>
          <NavReport
            projectId={String(id)}
            onSelect={(report: SetStateAction<Report | null>) => setSelectedRapport(report)} />
          <Divider
            text={`Rapport ${selectedRapport ? "" : "Chargement..."}`}
            className="mt-0"
          />

          {selectedRapport ? (
            <TextEditor rapportId={selectedRapport.id} />
          ) : (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Aucun rapport disponible pour ce projet.
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
