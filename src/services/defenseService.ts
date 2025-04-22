import api from "../config/axios";
import { Defense } from "@/types/defense.type";

export async function saveOrder(order: Defense[]): Promise<void> {
  try {
    await api.post(`/order`, order, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Impossible d'enregistrer l'ordre");
  }
}
