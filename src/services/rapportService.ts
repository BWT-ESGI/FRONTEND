import { Section } from "@/types/sections.type";
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

export async function fetchRapportSections(rapportId: string): Promise<Section[]> {
  const response = await api.get(`/reports/${rapportId}/sections`);
  return response.data;
}

export async function saveRapportSections(rapportId: string, sections: Section[]): Promise<void> {
  await api.put(`/reports/${rapportId}/sections`, { sections });
}

export async function createRapport(groupId: string): Promise<Report> {
  const response = await api.post("/Reports", {
    content: "",
    groupId: groupId,
  });
  return response.data;
}