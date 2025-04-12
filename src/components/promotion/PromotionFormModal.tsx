import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { fetchAllUsers } from "@/services/userService";
import { createPromotion } from "@/services/promotionService";
import { User } from "@/types/user.type";

interface PromotionFormModalProps {
  open: boolean;
  onClose: () => void;
}

type Option = { label: string; value: string };

export default function PromotionFormModal({ open, onClose }: PromotionFormModalProps) {
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Option[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setTeacherId(storedUserId);

    const load = async () => {
      const allUsers = await fetchAllUsers();
      if (allUsers) {
        setUsers(allUsers);
      }
    };

    load();
  }, []);

  const studentOptions: Option[] = users
    .filter((u) => u.role === "student")
    .map((u) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.id.toString(),
    }));

  const handleCreateOption = (inputValue: string) => {
    if (!inputValue.includes("@")) return; // basique vérification d'email
    const newOption = { label: inputValue, value: inputValue };
    setSelectedStudents((prev) => [...prev, newOption]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const studentIds = selectedStudents.map((s) => s.value);

    const payload = {
      name,
      teacherId: teacherId || "",
      studentIds,
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Étudiants</label>
            <CreatableSelect
              isMulti
              options={studentOptions}
              value={selectedStudents}
              onChange={(selected) => setSelectedStudents(selected as Option[])}
              onCreateOption={handleCreateOption}
              placeholder="Sélectionner ou ajouter un étudiant..."
              className="react-select-container"
              classNamePrefix="react-select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  neutral0: "#1f2937",
                  neutral80: "#ffffff",
                  primary25: "#374151",
                  primary: "#3b82f6",
                },
              })}
              styles={{
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#374151",
                  borderRadius: "6px",
                  padding: "2px 4px",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "white",
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "white",
                  ":hover": {
                    backgroundColor: "#4b5563",
                    color: "white",
                  },
                }),
              }}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}