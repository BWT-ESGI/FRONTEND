import { FlexibleBadge } from "../template/FlexibleBadge";
import FlexibleCard from "../template/FlexibleCard";
import { Project } from "@/types/project.type";
import { Progress } from "../ui/progress";

interface ProjectSummaryCardProps {
  project: Project;
  btn?: React.ReactNode;
}

export default function ProjectSummaryCard({ project, btn = (<></>) } : ProjectSummaryCardProps) {
    if (!project) return null;
    return (
      <FlexibleCard
        key={project.id}
        title={project.name}
        description={project.description || "Aucune description"}
        childrenRightEnd={<FlexibleBadge status={project.status} />}
        childrenFooter={
          <div className="flex justify-between mt-4 items-center">
            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-600/10 dark:text-gray-300">
              Créer le{" "}
              {new Date(project.createdAt).toLocaleString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {btn && (btn)}
          </div>
        }
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <strong>Étudiants par groupe : </strong>
            <FlexibleBadge status={project.groupCompositionType} noDot />
            {
              project.nbGroups > 0 && (
                <FlexibleBadge
                  status="custom"
                  noDot
                  label={`${project.nbGroups} groupe${
                    project.nbGroups > 1 ? "s" : ""
                  }`}
                />
              )
            }
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span>{project.nbStudensMinPerGroup}</span>
            <Progress
              value={
                (project.nbStudensMinPerGroup / project.nbStudentsMaxPerGroup) *
                100
              }
              className="w-full"
            />
            <span>{project.nbStudentsMaxPerGroup}</span>
          </div>
        </div>
      </FlexibleCard>
    );
}