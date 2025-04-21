import api from "../config/axios";

export interface PassageGroup {
  id: string;
  name: string;
  start: string;
  end: string;
}

export async function fetchDefenses(projectId: string): Promise<PassageGroup[]> {
  try {
    const response = await api.get<PassageGroup[]>(`/api/defense/${projectId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Impossible de récupérer les défenses");
  }
}

export async function saveOrder(order: PassageGroup[]): Promise<void> {
  try {
    await api.post(`/order`, order, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Impossible d'enregistrer l'ordre");
  }
}
