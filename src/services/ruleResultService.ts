import api from "../config/axios";

export async function fetchRuleResultsBySubmission(submissionId: string) {
    return api.get(`/rule-results/submission/${submissionId}`);
}
