import api from "../config/axios";
import { getUserById } from "./userService";

export const sendGoogleToken = async (credential: string) => {
  try {
    const response = await api.post('/authentication/google', {
      token: credential,
    });
    
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      const userInfo = await getUserById(response.data.userId);
      localStorage.setItem('userFirstname', userInfo.firstName);
      localStorage.setItem('userLastname', userInfo.lastName);
      localStorage.setItem('userEmail', userInfo.email);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('role', response.data.role);
    }
    return response;
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
};

export const finalizeRegistration = async (email: string | undefined, credential: string) => {
  try {
    const response = await api.post('/authentication/google', {
      token: credential,
      email: email || '',
    });
    
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response;
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
}

export const checkRegistrationId = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}/check-registration`);
    return response.data;
  } catch (error) {
    console.error('Error checking registration ID:', error);
    throw error;
  }
}

export const updateUserProfile = async (email: string, data: any) => {
  try {
    const response = await api.put(`/users/${email}`, data);
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}