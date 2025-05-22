import React, { JSX, useMemo } from "react";

import FlexibleRadioGroupCard from "@/components/template/FlexibleRadioGroupCard";
import { OptionGroupe } from "@/types/optionGroupe.type";
import { ProjectStatus } from "@/types/project.type";
import { Pencil, Share, Archive, CheckCircle } from "lucide-react";

interface Props {
  status: ProjectStatus;
  setStatus: (status: ProjectStatus) => void;
}

const ProjectStatusRelatedIcon: Record<ProjectStatus, JSX.Element | string> = {
    [ProjectStatus.DRAFT]: <Pencil className="mb-2.5 text-muted-foreground" />,
    [ProjectStatus.PUBLISHED]: <Share className="mb-2.5 text-muted-foreground" />,
    [ProjectStatus.ARCHIVED]: <Archive className="mb-2.5 text-muted-foreground" />,
/*     [ProjectStatus.ACTIVE]: <CheckCircle /> */
};

const ProjectStatusDisplayName: Record<ProjectStatus, string> = {
    [ProjectStatus.DRAFT]: "Brouillon",
    [ProjectStatus.PUBLISHED]: "Publié",
    [ProjectStatus.ARCHIVED]: "Archivé",
    /* [ProjectStatus.ACTIVE]: "Actif" */
};

const ProjectStatusSelector: React.FC<Props> = ({ status, setStatus }) => {
  const statusOptions: OptionGroupe[] = useMemo(
    () =>
      Object.values(ProjectStatus).map((s: ProjectStatus) => ({
        value: s,
        label: ProjectStatusDisplayName[s as keyof typeof ProjectStatusDisplayName],
        icon: ProjectStatusRelatedIcon[s as keyof typeof ProjectStatusRelatedIcon],
      })),
    []
  );

  return (
    <FlexibleRadioGroupCard
      options={statusOptions}
      defaultValue={status}
      onValueChange={(val: any) => setStatus(val as ProjectStatus)}
      gridCols={3}
      className="my-4"
    />
  );
};

export default ProjectStatusSelector;
