import api from "../config/axios";
import { Report } from "@/types/report.type";


export const fetchRapports = async (groupId: string): Promise<Report[]> => {
  try {
    const response = await api.get(`/reports/by-group/${groupId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rapports:", error);
    throw error;
  }
};

export async function fetchRapportContent(rapportId: string): Promise<string> {
  const response = await api.get(`/reports/${rapportId}`);
  return response.data.content;
}

export async function saveRapportContent(rapportId: string, content: string): Promise<void> {
  await api.put(`/reports/${rapportId}`, { content });
}

export async function createRapport(groupId: string): Promise<Report> {
  const response = await api.post("/Reports", {
    content: "",
    groupId: groupId,
  });
  return response.data;
}