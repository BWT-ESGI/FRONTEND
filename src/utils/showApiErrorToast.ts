import { toast } from "react-hot-toast";

export function showApiErrorToast(error: any) {
  if (error?.response?.data?.message) {
    const messages = Array.isArray(error.response.data.message)
      ? error.response.data.message
      : [error.response.data.message];
    messages.forEach((msg: string) => toast.error(msg));
  } else {
    toast.error("Erreur inconnue lors de la requête");
  }
}
