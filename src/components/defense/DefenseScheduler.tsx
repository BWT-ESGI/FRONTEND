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

import toast from "react-hot-toast";
import { generatePdf } from "@/services/pdfService";
import {
  fetchActiveDefensesByProject,
  updateDefense,
} from "@/services/defenseService";
import { getCriteriaSets, CriteriaSet } from "@/services/criteriaSetService";
import { useProjectContext } from "@/contexts/ProjectContext";
import { Defense } from "@/types/defense.type";
import { User } from "@/types/user.type";
import FlexibleCard from "../template/FlexibleCard";
import { FileSpreadsheet, TriangleAlert } from "lucide-react";
import FlexibleAlert from "../template/FlexibleAlert";
import { updateProject } from "@/services/projectService";

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
      className="p-4 rounded-2xl shadow"
    >
      <div className="font-bold text-lg">{defense.group.name}</div>
      <div className="text-sm mb-2">
        {new Date(defense.start).toLocaleString()} —{" "}
        {new Date(defense.end).toLocaleString()}
      </div>
      <div className="text-xs text-gray-600">
        Membres:{" "}
        {defense.group.members.map((m: User) => m.firstName).join(", ")}
      </div>
    </li>
  );
}

export default function DefenseScheduler() {
  const { project, setProject } = useProjectContext();
  const [defenses, setDefenses] = useState<Defense[]>([]);
  const [order, setOrder] = useState<Defense[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [duration, setDuration] = useState(30);
  const [criteriaSets, setCriteriaSets] = useState<CriteriaSet[]>([]);
  const [defenseCriteriaSetId, setDefenseCriteriaSetId] = useState<string | undefined>(project?.defenseCriteriaSetId);

  if (!project) return null;

  // 1) Charger les défenses actives pour ce projet
  useEffect(() => {
    fetchActiveDefensesByProject(project.id)
      .then((data) => {
        setDefenses(data);
        setOrder(data);

        if (data.length > 0) {
          // Préremplir les inputs à partir des dates existantes
          const first = new Date(data[0].start);
          const last = new Date(data[data.length - 1].end);
          setStart(first.toISOString().slice(0, 16));
          setEnd(last.toISOString().slice(0, 16));

          // Calculer duration si besoin
          const totalMin = (last.getTime() - first.getTime()) / 60000;
          setDuration(Math.round(totalMin / data.length));
        }
      })
      .catch(console.error);
  }, [project.id]);

  useEffect(() => {
    getCriteriaSets().then(setCriteriaSets).catch(() => {});
  }, []);

  if (defenses.length === 0) {
    return (
      <FlexibleAlert title="Aucun groupe disponible. Veuillez d’abord créer et peupler des groupes avant de créer des soutenances" variant="error" icon={<TriangleAlert />}/>
    );
  }

  const computeSchedule = (list: Defense[]): Defense[] => {
    const baseStartTs = start
      ? new Date(start).getTime()
      : new Date(list[0].start).getTime();
    const baseEndTs = end ? new Date(end).getTime() : null;
    const totalMin =
      baseEndTs !== null ? (baseEndTs - baseStartTs) / 60000 : null;
    const each = totalMin !== null ? totalMin / list.length : null;
    let current = baseStartTs;

    return list.map((d) => {
      const s = new Date(current);
      const e = new Date(
        current + (each !== null ? each * 60000 : duration * 60000)
      );
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
      return computeSchedule(arrayMove(prev, oldIndex, newIndex));
    });
  };

  const handleSave = async () => {
    try {
      const updated = await Promise.all(
        order.map((d) => updateDefense(d.id, { start: d.start, end: d.end }))
      );
      const merged = updated.map((u) => {
        const orig = order.find((d) => d.id === u.id)!;
        return { ...u, group: orig.group };
      });
      setOrder(merged);
      setDefenses(merged);
      toast.success("Dates et ordre enregistrés !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement des soutenances.");
    }
  };

  const handleSaveCriteriaSet = async () => {
    if (!project) return;
    try {
      await updateProject(project.id, { defenseCriteriaSetId });
      setProject({ ...project, defenseCriteriaSetId });
      toast.success("Grille de notation des soutenances sauvegardée");
    } catch (e) {
      toast.error("Erreur lors de la sauvegarde de la grille de soutenance");
    }
  };

  return (
    <div className="space-y-4">
      <FlexibleCard title="Grille de notation des soutenances" className="mt-4">
        <div className="mb-4">
          <select
            className="border rounded px-2 py-1 w-full"
            value={defenseCriteriaSetId || ""}
            onChange={(e) =>
              setDefenseCriteriaSetId(e.target.value || undefined)
            }
          >
            <option value="">Aucune</option>
            {criteriaSets
              .filter((cs) => cs.type === "defense")
              .map((cs) => (
                <option key={cs.id} value={cs.id}>
                  {cs.title}
                </option>
              ))}
          </select>
          <Button className="mt-2" onClick={handleSaveCriteriaSet}>
            Sauvegarder la grille
          </Button>
        </div>
      </FlexibleCard>
      
      <FlexibleCard
        title="Génération de l'ordre de passage"
        childrenFooter={
          <div className="flex">
            <Button onClick={handleGenerate}>Générer</Button>
          </div>
        }
      >
        <div className="space-y-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start">Date et heure de début</Label>
            <Input
              id="start"
              type="datetime-local"
              className="mt-2"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="end">Date et heure de fin</Label>
            <Input
              id="end"
              type="datetime-local"
              className="mt-2"
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
        </div>
      </FlexibleCard>

      <FlexibleCard title="Ordre de passage">
        <div>
          <div className="flex space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => generatePdf("schedule", order)}
            >
              <FileSpreadsheet className="h-4 w-4" />
              PDF – Ordre
            </Button>
            <Button onClick={() => generatePdf("attendance", order)}>
              <FileSpreadsheet className="h-4 w-4" />
              PDF – Émargement
            </Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
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
              <FileSpreadsheet className="h-4 w-4" />
              PDF – Ordre
            </Button>
            <Button onClick={() => generatePdf("attendance", order)}>
              <FileSpreadsheet className="h-4 w-4" />
              PDF – Émargement
            </Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </FlexibleCard>
    </div>
  );
}
