import { Group } from "./group.type";import { Promotion } from "./promotion.type";
export enum ProjectStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
   /*  ACTIVE = "active", */
};

export type GroupCompositionType = "manual" | "random" | "student_choice";

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  nbStudentsMinPerGroup: number;
  nbStudentsMaxPerGroup: number;
  nbGroups: number;
  groupCompositionType: GroupCompositionType;
  status: ProjectStatus;
  groups: Group[];
  createdAt: Date;
  updatedAt: Date;
  endAt: Date;
  deadline: Date;
  promotion: Promotion;
  defenseCriteriaSetId?: string;
  reportCriteriaSetId?: string;
  deliverableCriteriaSetId?: string;
};