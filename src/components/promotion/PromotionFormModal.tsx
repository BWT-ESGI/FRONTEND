import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createPromotion } from "@/services/promotionService";
import getUserInfoFromLocalStorage from "@/utils/getUserInfoFromLocalStorage";

interface PromotionFormModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PromotionFormModal({ open, onClose }: PromotionFormModalProps) {
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = getUserInfoFromLocalStorage()?.userId || null;
    setTeacherId(storedUserId);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      teacherId: teacherId || "",
    };

    try {
      await createPromotion(payload);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la promotion :", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle promotion</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            placeholder="Nom de la promotion"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex justify-end">
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}