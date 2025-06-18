import api from '../config/axios';

export interface EvaluationGridPayload {
  projectId: string;
  criteriaSetId: string;
  groupId: string;
  filledBy: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  deliverableId?: string;
  defenseId?: string;
  reportId?: string;
}

export async function submitEvaluationGrid(payload: EvaluationGridPayload) {
  const res = await api.post('/evaluation-grids', payload);
  return res.data;
}

export async function fetchEvaluationGrid(
  criteriaSetId: string,
  groupId: string,
  deliverableId?: string,
  defenseId?: string,
  reportId?: string
) {
  const params: any = { criteriaSetId, groupId };
  if (deliverableId) params.deliverableId = deliverableId;
  if (defenseId) params.defenseId = defenseId;
  if (reportId) params.reportId = reportId;
  const res = await api.get('/evaluation-grids', { params });
  return res.data;
}

export async function fetchGradesForUser() {
  const res = await api.get('/evaluation-grids/getAllGrad');
  return res.data;
}
