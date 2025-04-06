import { Role } from "./role.type";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
