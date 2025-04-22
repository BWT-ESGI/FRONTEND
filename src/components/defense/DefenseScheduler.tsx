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

import { fetchGroupsWithMembers } from "@/services/groupService";
import { generatePdf } from "@/services/pdfService";
import { Group } from "@/types/group.type";
import { User } from "@/types/user.type";
import FlexibleAlert from "../template/FlexibleAlert";
import { Info } from "lucide-react";
import { useProjectContext } from "@/contexts/ProjectContext";

function SortableItem({
  group,
}: {
  group: Group;
}) {
  const defense = group.defense[0]; // on suppose 1 seul passage par groupe
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: group.id.toString() });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white rounded-2xl shadow"
    >
      <div className="font-bold text-lg">{group.name}</div>
      {defense && (
        <div className="text-sm mb-2">
          {new Date(defense.start).toLocaleString()} —{" "}
          {new Date(defense.end).toLocaleString()}
        </div>
      )}
      <div className="text-xs text-gray-600">
        Membres : {group.members.map((m: User) => m.firstName).join(", ")}
      </div>
    </li>
  );
}

export default function SoutenanceScheduler() {
  const { project } = useProjectContext();
  const [groups, setGroups] = useState<Group[]>([]);
  const [order, setOrder] = useState<Group[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [duration, setDuration] = useState(30);

  if (!project) return null;

  useEffect(() => {
    fetchGroupsWithMembers(project.id.toString())
      .then((all) => {
        const withMembers = all.filter((g) => g.members.length > 0);
        setGroups(withMembers);
        setOrder(withMembers); // ordre initial = tel quel
      })
      .catch(console.error);
  }, [project.id]);

  // Si aucun groupe avec membres, afficher message d'avertissement
  if (groups.length === 0) {
    return (
        <FlexibleAlert title="Aucun groupe avec des membres n’est pour l’instant généré. Veuillez d’abord créer et peupler des groupes." icon={<Info className="!text-blue-500 text-center" />} variant="info" />
    );
  }

  // Calcule start/end dynamiques d'après l'ordre
  const computeSchedule = (grps: Group[]) => {
    if (!start) return grps;
    const items = grps.map((g) => ({ id: g.id.toString(), name: g.name }));
    const s = new Date(start).getTime();
    const e = end ? new Date(end).getTime() : null;
    const totalMin = e ? (e - s) / 60000 : null;
    const each = totalMin ? totalMin / items.length : null;

    let current = s;
    return grps.map((g) => {
      const st = new Date(current);
      const en = new Date(current + (each ?? duration * 60000));
      current = en.getTime();
      return {
        ...g,
        defense: [
          {
            ...g.defense[0],
            start: st.toISOString(),
            end: en.toISOString(),
          },
        ],
      };
    });
  };

  const handleGenerate = () => {
    if (!start) {
      alert("Veuillez saisir une date de début valide !");
      return;
    }
    if (end && isNaN(new Date(end).getTime())) {
      alert("La date de fin n’est pas valide !");
      return;
    }
    const scheduled = computeSchedule(order);
    setOrder(scheduled);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => {
        const oldIndex = prev.findIndex((g) => g.id.toString() === active.id);
        const newIndex = prev.findIndex((g) => g.id.toString() === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        return computeSchedule(reordered);
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader title="Sélection des groupes actifs" />
        <CardContent>
          {groups.map((g) => (
            <div key={g.id} className="mb-4">
              <div className="font-semibold">{g.name}</div>
              <div className="text-sm text-gray-600">
                Membres : {g.members.map((m) => m.firstName).join(", ")}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader title="Ordre de passage" />
        <CardContent>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={order.map((g) => g.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {order.map((g) => (
                  <SortableItem key={g.id} group={g} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <div className="flex space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                generatePdf(
                  "schedule",
                  order.map((g) => g.defense[0])
                )
              }
            >
              PDF – Ordre
            </Button>
            <Button
              onClick={() =>
                generatePdf(
                  "attendance",
                  order.map((g) => g.defense[0])
                )
              }
            >
              PDF – Émargement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}