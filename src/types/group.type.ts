import { Project } from "./project.type";
import { User } from "./user.type";

export type Group = {
    id: number;
    name: string;
    project: Project;
    members: User[];
};