import api from "../config/axios";
import { User } from "@/types/user.type.ts";


// export const getUserdata = async (token: string) => {
//   try {
//     const response = await api.put(`/users/${email}`, data);
//     return response;
//   } catch (error) {
//     console.error('Error updating user profile:', error);
//     throw error;
//   }
// }


export async function fetchAllUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  console.log("users", response.data);
  return response.data;
}