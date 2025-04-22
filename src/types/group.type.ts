import { Defense } from "./defense.type";
import { Project } from "./project.type";
import { User } from "./user.type";

export type Group = {
    id: string;
    name: string;
    project: Project;
    members: User[];
    defense: Defense[];
};