import api from "../config/axios";

import { Deliverable } from '@/types/deliverable.type';

export async function fetchDeliverablesByProject(projectId: string) {
  return api.get<Deliverable[]>(`/deliverables?projectId=${projectId}`);
}

export async function createDeliverable(data: Partial<Deliverable> & { projectId: string }) {
  return api.post<Deliverable>(`/deliverables`, data);
}

export async function updateDeliverable(id: string, data: Partial<Deliverable>) {
  return api.patch<Deliverable>(`/deliverables/${id}`, data);
}

export async function deleteDeliverable(id: string) {
  return api.delete(`/deliverables/${id}`);
}
