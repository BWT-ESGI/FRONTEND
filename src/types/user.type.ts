import { Role } from "./role.type";

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: Role;
};
