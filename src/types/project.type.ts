import { Group } from "./group.type";
import { Promotion } from "./promotion.type";

export type Project = {
    id: number;
    name: string;
    description?: string | null;
    promotionId: number;
    groups: Group[];
    createdAt: Date;
    updatedAt: Date;
};