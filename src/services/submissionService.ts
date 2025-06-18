import api from "../config/axios";

export async function fetchDeliverablesByProject(projectId: string) {
  return api.get(`/deliverables?projectId=${projectId}`);
}

export async function fetchSubmissionsByGroup(groupId: string) {
  return api.get(`/submissions?groupId=${groupId}`);
}

export async function uploadSubmission(formData: FormData) {
  return api.post("/submissions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function downloadSubmission(submissionId: string) {
  return api.get(`/submissions/download/${submissionId}`, {
    responseType: "blob",
  });
}

export async function deleteSubmission(submissionId: string) {
  return api.delete(`/submissions/${submissionId}`);
}

export async function uploadGitSubmission(data: { deliverableId: string; groupId: string; gitRepoUrl: string }) {
  return api.post("/submissions", data);
}
