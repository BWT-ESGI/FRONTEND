import { Project } from "./project.type";
import { User } from "./user.type";

export type Group = {
    id: string;
    name: string;
    leader?: User;
    project: Project;
    members: User[];
};