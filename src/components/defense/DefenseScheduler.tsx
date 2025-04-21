import { useEffect, useState, useMemo } from "react";
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

import { PassageGroup, fetchDefenses } from "@/services/defenseService";
import { fetchGroupsWithMembers } from "@/services/groupService";
import { generatePdf } from "@/services/pdfService";
import { Project } from "@/types/project.type";
import { Group } from "@/types/group.type";
import { User } from "@/types/user.type";

interface Props {
  project: Project;
}

function SortableItem({
  item,
  members,
}: {
  item: PassageGroup;
  members: User[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white rounded-2xl shadow"
    >
      <div className="font-bold text-lg">{item.name}</div>
      <div className="text-sm mb-2">
        {new Date(item.start).toLocaleString()} — {new Date(item.end).toLocaleString()}
      </div>
      <div className="text-xs text-gray-600">
        Membres : {members.map(m => m.firstName).join(', ')}
      </div>
    </li>
  );
}

export default function SoutenanceScheduler({ project }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [order, setOrder] = useState<PassageGroup[]>([]);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [duration, setDuration] = useState<number>(30);

  // Charger les groupes avec membres
  useEffect(() => {
    fetchGroupsWithMembers(project.id.toString())
      .then(allGroups => setGroups(allGroups.filter(g => g.members?.length > 0)))
      .catch(console.error);
  }, [project.id]);

  // Charger l'ordre existant (si applicable)
  useEffect(() => {
    fetchDefenses(project.id.toString())
      .then(setOrder)
      .catch(console.error);
  }, [project.id]);

  // Si aucun groupe avec membres, afficher message d'avertissement
  if (groups.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader title="Aucun groupe disponible" />
          <CardContent>
            <p className="text-sm">
              Aucun groupe avec des membres n’est pour l’instant généré. Veuillez d’abord créer et peupler des groupes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const generateByDuration = (
    startIso: string,
    dur: number,
    items: Array<{ id: string; name: string }>
  ): PassageGroup[] => {
    const result: PassageGroup[] = [];
    let current = new Date(startIso);
    items.forEach((g) => {
      const s = new Date(current);
      const e = new Date(current.getTime() + dur * 60000);
      result.push({ id: g.id, name: g.name, start: s.toISOString(), end: e.toISOString() });
      current = e;
    });
    return result;
  };

  const generateByRange = (
    startIso: string,
    endIso: string,
    items: Array<{ id: string; name: string }>
  ): PassageGroup[] => {
    const result: PassageGroup[] = [];
    const sDate = new Date(startIso);
    const eDate = new Date(endIso);
    const totalMin = (eDate.getTime() - sDate.getTime()) / 60000;
    const each = totalMin / items.length;
    let current = sDate;
    items.forEach((g) => {
      const s = new Date(current);
      const e = new Date(current.getTime() + each * 60000);
      result.push({ id: g.id, name: g.name, start: s.toISOString(), end: e.toISOString() });
      current = e;
    });
    return result;
  };

  const handleGenerate = () => {
    if (!start) {
      alert("Veuillez saisir une date de début valide !");
      return;
    }
    if (end && new Date(end).toString() === "Invalid Date") {
      alert("La date de fin n’est pas valide !");
      return;
    }
    const items = groups.map((g) => ({ id: g.id.toString(), name: g.name }));
    const res = end
      ? generateByRange(start, end, items)
      : generateByDuration(start, duration, items);
    setOrder(res);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        const items = reordered.map((g) => ({ id: g.id, name: g.name }));
        return end
          ? generateByRange(start, end, items)
          : generateByDuration(start, duration, items);
      });
    }
  };

  // Map pour retrouver facilement les membres par groupe
  const membersByGroup = useMemo(
    () => new Map(groups.map(g => [g.id.toString(), g.members])),
    [groups]
  );

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader title="Sélection des groupes actifs" />
        <CardContent>
          {groups.map(g => (
            <div key={g.id} className="mb-4">
              <div className="font-semibold">{g.name}</div>
              <div className="text-sm text-gray-600">
                Membres : {g.members.map(m => m.firstName).join(', ')}
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

      {order.length > 0 && (
        <Card>
          <CardHeader title="Ordre de passage" />
          <CardContent>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={order.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-2">
                  {order.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      members={membersByGroup.get(item.id) || []}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            <div className="flex space-x-4 mt-4">
              <Button variant="outline" onClick={() => generatePdf("schedule", order)}>
                PDF - Ordre
              </Button>
              <Button onClick={() => generatePdf("attendance", order)}>
                PDF - Émargement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
