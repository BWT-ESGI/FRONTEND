import { Project } from "./project.type";
import { User } from "./user.type";

export type Group = {
    id: number;
    name: string;
    leader?: User;
    project: Project;
    members: User[];
};