import { Project } from "./project.type";
import { User } from "./user.type";

export type Promotion = {
  id: string;
  name: string;
  teacher: User;
  students: User[];
  projects: Project[];
};