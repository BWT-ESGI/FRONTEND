import { Role } from "./role.type";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};
