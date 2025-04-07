import { Group } from "./group.type";

export type ProjectStatus = "draft" | "published" | "archived";
export type GroupCompositionType = "manual" | "random" | "student_choice";

export type Project = {
    id: number;
    name: string;
    description?: string | null;
    promotionId: number;
    nbStudensMinPerGroup: number;
    nbStudentsMaxPerGroup: number;
    nbGroups: number;
    groupCompositionType: GroupCompositionType;
    status: ProjectStatus;
    groups: Group[];
    createdAt: Date;
    updatedAt: Date;
};