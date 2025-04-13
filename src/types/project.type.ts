import { Group } from "./group.type";
import { Promotion } from "./promotion.type";

export type ProjectStatus = "draft" | "published" | "archived" | "active";
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
    promotion: Promotion;
};