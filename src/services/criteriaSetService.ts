import api from '../config/axios';

export interface Criteria {
  id?: string;
  label: string;
  maxScore: number;
  weight: number;
  commentGlobal?: string;
  commentPerCriteria?: string;
}

export interface CriteriaSet {
    id?: string;
    title: string;
    type: "defense" | "deliverable" | "report";
    weight: number;
    criteria: Criteria[];
    groupId?: string;
    commentPerCriteria?: string;
    commentGlobal?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function createCriteriaSet(data: Omit<CriteriaSet, 'id'>) {
  const res = await api.post('/criteria-sets', data);
  return res.data;
}

export async function getCriteriaSets(type?: string) {
  const res = await api.get('/criteria-sets', { params: type ? { type } : {} });
  return res.data;
}
