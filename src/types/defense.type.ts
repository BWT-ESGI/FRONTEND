import { Group } from "./group.type";

export type Defense = {
    id: string;
    name: string;
    start: string;
    end: string;
    group: Group;
    createdAt: string;
    updatedAt: string;
    month: string;
};