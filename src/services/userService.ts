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

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export async function fetchAllStudents(): Promise<User[]> {
  const response = await api.get<User[]>("/users/students");
  return response.data;
}


export async function fetchAllUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function addMultipleStudents(
  students: {
    firstName: string;
    lastName: string;
    email: string;
  }[]
): Promise<void> {
  try {
    await api.post("/users/add-multiple-students", students);
  } catch (error) {
    console.error("Error adding multiple students:", error);
    throw error;
  }
}