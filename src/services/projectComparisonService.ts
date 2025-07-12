import api from "@/config/axios";

export async function triggerProjectComparison(projectId: string) {
  return api.post(`/projects/${projectId}/trigger-comparison`);
}
