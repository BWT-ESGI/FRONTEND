import api from "../config/axios";

export async function fetchRuleResultsBySubmission(submissionId: string) {
    return api.get(`/rule-results/submission/${submissionId}`);
}

export async function fetchRuleResultsByProject(projectId: string) {
    return api.get(`/rule-results/project/${projectId}`);
}