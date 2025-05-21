import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { CheckCircle, Circle, Play, Flag } from "lucide-react";
import { Fragment } from "react";

import { Deliverable, Submission } from "@/types/deliverable.type";
import { Project } from "@/types/project.type";
import { Defense } from "@/types/defense.type";

interface ProjectDeliverableStepsProps {
  project: Project | null;
  deliverables: Deliverable[];
  submissions: Submission[];
  defense?: Defense | null;
}

const ProjectDeliverableSteps = ({
  project,
  deliverables,
  submissions,
  defense,
}: ProjectDeliverableStepsProps) => {
  const sortedDeliverables = [...deliverables].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const getLatestSubmission = (deliverableId: string) =>
    submissions
      .filter((s) => s.deliverableId === deliverableId)
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )[0];

  let defenseStep = null;
  if (defense) {
    const now = new Date();
    const defenseEnd = new Date(defense.end);
    const isDone = now > defenseEnd;
    defenseStep = {
      label: "Soutenance",
      icon: isDone ? CheckCircle : Circle,
      status: isDone ? "done" : "todo",
      dateString: `du ${new Date(defense.start).toLocaleDateString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })} au ${new Date(defense.end).toLocaleDateString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      deadline: defense.end,
      isDefense: true,
    };
  }

  const steps = [
    {
      label: "Début du projet",
      icon: Play,
      status: "done",
      dateString: new Date(project?.createdAt || "").toLocaleDateString(
        "fr-FR"
      ),
      deadline: null,
      isDefense: false,
    },
    ...sortedDeliverables.map((d) => {
      const latestSubmission = getLatestSubmission(d.id);
      const isDone = !!latestSubmission;
      const dateString = latestSubmission
        ? new Date(latestSubmission.submittedAt).toLocaleDateString("fr-FR")
        : null;
      return {
        label: d.name || "Livrable",
        icon: isDone ? CheckCircle : Circle,
        status: isDone ? "done" : "todo",
        dateString,
        deadline: d.deadline,
        isDefense: false,
      };
    }),
    ...(defenseStep ? [defenseStep] : []),
    {
      label: "Fin du projet",
      icon: Flag,
      status:
        sortedDeliverables.every((d) => getLatestSubmission(d.id)) &&
        (!defenseStep || defenseStep.status === "done")
          ? "done"
          : "todo",
      dateString: new Date(project?.endAt || "").toLocaleDateString("fr-FR"),
      deadline: null,
      isDefense: false,
    },
  ];

  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbPage className="w-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-neutral-400">
                <step.icon
                  className={`h-5 w-5 ${
                    step.status === "done"
                      ? "text-green-500"
                      : "text-gray-400 dark:text-neutral-500"
                  }`}
                />
                <span
                  className="font-medium text-center"
                >
                  {step.label}
                </span>
                {step.dateString && (
                  <span className="text-xs text-gray-400 text-center">
                    {step.isDefense
                      ? `(${step.dateString})`
                      : index === 0
                      ? `Début le ${step.dateString}`
                      : index === steps.length - 1
                      ? `Fin le ${step.dateString}`
                      : `Rendu le ${step.dateString}`}
                  </span>
                )}
                {step.deadline && !step.isDefense && (
                  <span className="text-xs text-red-400 text-center">
                    Deadline{" "}
                    {new Date(step.deadline).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
            {index !== steps.length - 1 && (
              <li
                role="presentation"
                aria-hidden="true"
                className={`inline-block h-[2px] w-[40px] self-center ${
                  step.status === "done"
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-neutral-700"
                }`}
              />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ProjectDeliverableSteps;