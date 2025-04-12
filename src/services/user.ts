import api from "../config/axios";

export const getUserdata = async (token: string) => {
  try {
    const response = await api.put(`/users/${email}`, data);
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}