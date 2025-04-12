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

export async function fetchPromotions(): Promise<Promotion[]> {
  const response = await api.get<Promotion[]>("/promotions");
  return response.data;
}

export async function fetchPromotionById(id: string): Promise<Promotion> {
  const response = await api.get<Promotion>(`/promotions/${id}`);
  return response.data;
}