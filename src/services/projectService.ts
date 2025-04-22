import api from "../config/axios";
import { Project } from "@/types/project.type";

export interface CreateProjectPayload {
  name: string;
  description?: string;
  promotionId: string;
}

export const createProject = async (payload: CreateProjectPayload) => {
  const response = await api.post("/projects", payload);
  return response.data;
};

export async function fetchAllProjects(): Promise<Project[]> {
  const response = await api.get("/projects");
  return response.data;
}

export async function updateProject(
  projectId: string,
  payload: Partial<Project>
): Promise<Project> {
  const response = await api.patch(`/projects/${projectId}`, payload);
  return response.data;
}