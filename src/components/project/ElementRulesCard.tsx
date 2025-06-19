import React from "react";
import {
  FolderKanban,
  Users2,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  XCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Project, ProjectStatus } from "@/types/project.type";
import { cn } from "@/lib/utils";

const ELEMENTS: {
  key: keyof typeof LABELS;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    key: "project",
    icon: <FolderKanban className="h-6 w-6 text-blue-500" />,
    color: "text-blue-500",
  },
  {
    key: "groups",
    icon: <Users2 className="h-6 w-6 text-green-600" />,
    color: "text-green-600",
  },
  {
    key: "deliverable",
    icon: <ClipboardCheck className="h-6 w-6 text-pink-500" />,
    color: "text-pink-500",
  },
  {
    key: "report",
    icon: <FileText className="h-6 w-6 text-purple-500" />,
    color: "text-purple-500",
  },
  {
    key: "defense",
    icon: <ShieldCheck className="h-6 w-6 text-orange-500" />,
    color: "text-orange-500",
  },
];

const LABELS = {
  project: "Projet",
  groups: "Groupes",
  deliverable: "Livrables",
  report: "Rapports",
  defense: "Soutenances",
};

function getAvailabilityAndRules(project: Project) {
  return {
    project: {
      available: project.status === ProjectStatus.PUBLISHED,
      rules: project.description ? [project.description] : [],
    },
    groups: {
      available: Array.isArray(project.groups) && project.groups.length > 0,
      rules: [
        `Groupes prévus : ${project.nbGroups}`,
        `Taille min. : ${project.nbStudentsMinPerGroup}`,
        `Taille max. : ${project.nbStudentsMaxPerGroup}`,
        project.groupCompositionType &&
          `Type : ${project.groupCompositionType}`,
      ].filter(Boolean),
    },
    deliverable: {
      available: !!project.deliverableCriteriaSetId,
      rules: project.deliverableCriteriaSetId
        ? ["Grille d'évaluation définie."]
        : ["Aucun livrable requis pour l’instant."],
    },
    report: {
      available: Array.isArray(project.sections) && project.sections.length > 0,
      rules:
        Array.isArray(project.sections) && project.sections.length > 0
          ? [`Nombre de sections : ${project.sections.length}`]
          : ["Rapport non activé."],
    },
    defense: {
      available: !!project.defenseCriteriaSetId,
      rules: project.defenseCriteriaSetId
        ? ["Critères de soutenance définis."]
        : ["Soutenance non programmée."],
    },
  };
}

interface ElementRulesCardProps {
  project: Project;
}

export function ElementRulesCard({ project }: ElementRulesCardProps) {
  const availability = getAvailabilityAndRules(project);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {ELEMENTS.map(({ key, icon }) => {
        const { available, rules } = availability[key];
        return (
          <div
            key={key}
            className={cn(
              "flex flex-col items-center rounded-2xl shadow p-4 min-h-[160px] bg-white",
              !available && "opacity-60"
            )}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              {icon}
              <span className="font-medium">{LABELS[key]}</span>
            </div>
            <div className="flex items-center gap-2 mb-2 mt-1">
              {available ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-bold">Disponible</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-500 font-bold">Non disponible</span>
                </>
              )}
            </div>
            {rules && rules.length > 0 && (
              <div className="mt-2 w-full">
                <div className="flex items-center text-xs text-muted-foreground mb-1 gap-1">
                  <Info className="h-4 w-4" />
                  Règles&nbsp;:
                </div>
                <ul className="list-disc ml-6 text-xs text-gray-700">
                  {rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
