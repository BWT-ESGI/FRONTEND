import { Group } from "./group.type";

export type Project = {
    id: number;
    name: string;
    description?: string | null;
    promotionId: number;
    groups: Group[];
    createdAt: Date;
    updatedAt: Date;
};