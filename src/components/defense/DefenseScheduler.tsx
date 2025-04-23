// src/components/defense/SoutenanceScheduler.tsx
import { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import toast from "react-hot-toast";
import { generatePdf } from "@/services/pdfService";
import { fetchActiveDefensesByProject } from "@/services/defenseService";
import { useProjectContext } from "@/contexts/ProjectContext";
import { Defense } from "@/types/defense.type";
import { User } from "@/types/user.type";

function SortableItem({ defense }: { defense: Defense }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: defense.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white rounded-2xl shadow"
    >
      <div className="font-bold text-lg">{defense.group.name}</div>
      <div className="text-sm mb-2">
        {new Date(defense.start).toLocaleString()} —{" "}
        {new Date(defense.end).toLocaleString()}
      </div>
      <div className="text-xs text-gray-600">
        Membres: {defense.group.members.map((m: User) => m.firstName).join(", ")}
      </div>
    </li>
  );
}

export default function SoutenanceScheduler() {
  const { project } = useProjectContext();
  const [defenses, setDefenses] = useState<Defense[]>([]);
  const [order, setOrder] = useState<Defense[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [duration, setDuration] = useState(30);

  if (!project) return null;

  // 1) Charger les défenses actives pour ce projet
  useEffect(() => {
    fetchActiveDefensesByProject(project.id)
      .then((data) => {
        setDefenses(data);
        setOrder(data);
      })
      .catch(console.error);
  }, [project.id]);

  if (defenses.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader title="Aucun groupe disponible" />
          <CardContent>
            <p className="text-sm">
              Aucun groupe avec des membres n’est pour l’instant généré.
              Veuillez d’abord créer et peupler des groupes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2) Recalcule les dates de chaque defense selon l'ordre
  const computeSchedule = (list: Defense[]): Defense[] => {
    const baseStartTs = start
      ? new Date(start).getTime()
      : new Date(list[0].start).getTime();
    const baseEndTs = end ? new Date(end).getTime() : null;
    const totalMin = baseEndTs !== null ? (baseEndTs - baseStartTs) / 60000 : null;
    const each = totalMin !== null ? totalMin / list.length : null;
    let current = baseStartTs;

    return list.map((d) => {
      const s = new Date(current);
      const e = new Date(current + (each !== null ? each * 60000 : duration * 60000));
      current = e.getTime();
      return { ...d, start: s.toISOString(), end: e.toISOString() };
    });
  };

  const handleGenerate = () => {
    if (start && isNaN(new Date(start).getTime())) {
      toast.error("La date de début n’est pas valide !");
      return;
    }
    if (end && isNaN(new Date(end).getTime())) {
      toast.error("La date de fin n’est pas valide !");
      return;
    }
    if (start && end) {
      const st = new Date(start).getTime();
      const en = new Date(end).getTime();
      if (en <= st) {
        toast.error("La date de fin doit être supérieure à la date de début !");
        return;
      }
    }
    setOrder(computeSchedule(order));
    toast.success("Dates recalculées !");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrder((prev) => {
      const oldIndex = prev.findIndex((d) => d.id === active.id);
      const newIndex = prev.findIndex((d) => d.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      const updated = computeSchedule(reordered);
      toast.success("Ordre et dates mis à jour !");
      return updated;
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* 1ère carte : liste des groupes */}
      <Card>
        <CardHeader title="Groupes actifs" />
        <CardContent>
          {defenses.map((d) => (
            <div key={d.id} className="mb-4">
              <div className="font-semibold">{d.group.name}</div>
              <div className="text-sm text-gray-600">
                Membres: {d.group.members.map((m) => m.firstName).join(", ")}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Carte de paramétrage */}
      <Card>
        <CardHeader title="Génération de l'ordre de passage" />
        <CardContent className="space-y-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start">Date et heure de début</Label>
            <Input
              id="start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="end">Date et heure de fin (optionnel)</Label>
            <Input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          {!end && (
            <div>
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
              />
            </div>
          )}
          <div className="col-span-2 pt-4">
            <Button onClick={handleGenerate}>Générer</Button>
          </div>
        </CardContent>
      </Card>

      {/* Drag & Drop pour ordonner */}
      <Card>
        <CardHeader title="Ordre de passage" />
        <CardContent>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={order.map((d) => d.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {order.map((d) => (
                  <SortableItem key={d.id} defense={d} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <div className="flex space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => generatePdf("schedule", order)}
            >
              PDF – Ordre
            </Button>
            <Button onClick={() => generatePdf("attendance", order)}>
              PDF – Émargement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}