import api from '../config/axios';

export interface EvaluationGridPayload {
  projectId: string;
  criteriaSetId: string;
  groupId: string;
  filledBy: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
}

export async function submitEvaluationGrid(payload: EvaluationGridPayload) {
  const res = await api.post('/evaluation-grids', payload);
  return res.data;
}

export async function fetchEvaluationGrid(criteriaSetId: string, groupId: string) {
  const res = await api.get('/evaluation-grids', { params: { criteriaSetId, groupId } });
  return res.data;
}
