export async function fetchAllPromotions(): Promise<Promotion[]> {
  const response = await api.get<Promotion[]>("/promotions");
  return response.data;
}
import api from "../config/axios";
import { Promotion } from "@/types/promotion.type.ts";

export interface CreatePromotionPayload {
  name: string;
  teacherId: string;
  studentIds?: string[];
}

export async function createPromotion(payload: CreatePromotionPayload) {
  const response = await api.post("/promotions", payload);
  return response.data;
}

export async function fetchPromotions(id: string): Promise<Promotion[]> {
  const response = await api.get<Promotion[]>(`/promotions/user/${id}`);
  return response.data;
}

export async function fetchPromotionById(id: string): Promise<Promotion> {
  const response = await api.get<Promotion>(`/promotions/${id}`);
  return response.data;
}

export async function deletePromotionById(id: string): Promise<void> {
  await api.delete(`/promotions/${id}`);
}

export async function updatePromotionById(
  id: string,
  payload: Partial<CreatePromotionPayload>
): Promise<Promotion> {
  const response = await api.patch<Promotion>(`/promotions/${id}`, payload);
  return response.data;
}

export async function updateStudentsPromotion(id: string, studentIds: string[]): Promise<Promotion> {
  const response = await api.patch<Promotion>(`/promotions/${id}/edit-students`, {
    ids: studentIds,
  });
  return response.data;
}