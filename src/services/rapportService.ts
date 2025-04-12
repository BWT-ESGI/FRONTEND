import api from "../config/axios";
import { Report } from "@/types/report.type";


export const fetchRapports = async (projectId: string): Promise<Report[]> => {
  try {
    const response = await api.get(`/reports/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rapports:", error);
    throw error;
  }
};