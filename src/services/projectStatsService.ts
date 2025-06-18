import api from "@/config/axios";

export async function fetchProjectStats(projectId: string) {
  const { data } = await api.get(`statistics/project/${projectId}`);
  return data;
}
