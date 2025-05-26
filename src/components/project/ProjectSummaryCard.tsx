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

    console.log(project);
    return (
      <FlexibleCard
        key={project.id}
        title={project.name}
        description={project.description || "Aucune description"}
        className="w-full h-full"
        childrenRightEnd={<FlexibleBadge status={project.status} />}
        childrenFooter={
          <div className="flex justify-between mt-4 items-center">
            <div>
              <p className="text-sm text-gray-500">
                Créé le{" "}
                {new Date(project.createdAt).toLocaleString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-500">
                Mis à jour le{" "}
                {new Date(project.updatedAt).toLocaleString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {project.endAt && (
                <p className="text-sm text-gray-500">
                  Date de fin :{" "}
                  {new Date(project.endAt).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
            {btn && btn}
          </div>
        }
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <strong>Groupe : </strong>
            <FlexibleBadge status={project.groupCompositionType} noDot />
            {/* {project.nbGroups > 0 && (
              <FlexibleBadge
                status="custom"
                noDot
                label={`${project.nbGroups} groupe${
                  project.nbGroups > 1 ? "s" : ""
                }`}
              />
            )} */}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span>{project.nbStudentsMinPerGroup}</span>
            <Progress
              value={
                (project.nbStudentsMinPerGroup /
                  project.nbStudentsMaxPerGroup) *
                100
              }
              className="w-full"
            />
            <span>{project.nbStudentsMaxPerGroup}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <strong>Nombre de groupes : </strong>
            <span>{project.nbGroups}</span>
          </div>
          {project.promotion && (
            <div className="flex items-center gap-2 mt-1">
              <strong>Promotion : </strong>
              <span>{project.promotion.name}</span>
            </div>
          )}

        </div>
      </FlexibleCard>
    );
}