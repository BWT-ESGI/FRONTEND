// src/components/group/GroupBuilder.tsx
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchGroupBuilderDataByProject,
  saveGroupsForProject,
  updateProjectConfig,
} from "@/services/groupService";
import { User } from "@/types/user.type";
import { Group } from "@/types/group.type";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Shuffle } from "lucide-react";
import { useProjectContext } from "@/contexts/ProjectContext";

export default function GroupBuilder() {
  const { project } = useProjectContext();
  const { id: projectId } = useParams<{ id: string }>();

  const mode = project?.groupCompositionType ?? "manual";
  const minSize = project?.nbStudentsMinPerGroup ?? 0;
  const maxSize = project?.nbStudentsMaxPerGroup ?? 0;
  const deadline = project?.deadline;

  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [initialUsers, setInitialUsers] = useState<User[]>([]);
  const [initialGroups, setInitialGroups] = useState<Group[]>([]);

  useEffect(() => {
    (async () => {
      if (!projectId) return;
      const data = await fetchGroupBuilderDataByProject(projectId);
      setUsers(data.users);
      setGroups(data.groups);
      setInitialUsers(data.users);
      setInitialGroups(data.groups);
    })();
  }, [projectId]);

  const resetGroups = () => {
    const assignedMembers = initialGroups.flatMap(g => g.members);
    setUsers([...initialUsers, ...assignedMembers]);
    setGroups(initialGroups.map(g => ({ ...g, members: [] })));
  };

  const handleGenerateRandom = () => {
    // Vérification des bornes
    if (minSize <= 0 || maxSize <= 0) {
      toast.error("Veuillez définir des tailles minimales et maximales correctes.");
      return;
    }
    if (minSize > maxSize) {
      toast.error("La taille minimale ne peut pas être supérieure à la taille maximale.");
      return;
    }
  
    // Mélange aléatoire de tous les utilisateurs
    const all = [...initialUsers, ...initialGroups.flatMap(g => g.members)];
    const shuffled = all.sort(() => Math.random() - 0.5);
  
    // Prépare les groupes vides
    const newGroups = initialGroups.map(g => ({ ...g, members: [] as User[] }));
  
    let idx = 0;
    // 1) Attribution du minimum à chaque groupe
    for (let g of newGroups) {
      for (let i = 0; i < minSize && idx < shuffled.length; i++) {
        g.members.push(shuffled[idx++]);
      }
    }
  
    // 2) Répartition du reste sans dépasser maxSize
    while (idx < shuffled.length) {
      let somethingAssigned = false;
      for (let g of newGroups) {
        if (idx >= shuffled.length) break;
        if (g.members.length < maxSize) {
          g.members.push(shuffled[idx++]);
          somethingAssigned = true;
        }
      }
      if (!somethingAssigned) break;
    }
  
    setGroups(newGroups);
    setUsers([]);
  };

  const handleSave = async () => {
    if (!projectId) return;
    try {
      await saveGroupsForProject(projectId, groups);
      await updateProjectConfig(projectId, {
        nbStudentsMinPerGroup: minSize,
        nbStudentsMaxPerGroup: maxSize,
        groupCompositionType: mode,
        nbGroups: groups.length,
        deadline: deadline?.toISOString(),
      });
      toast.success("Groupes et configuration enregistrés !");
    } catch {
      toast.error("Erreur lors de l'enregistrement des groupes.");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (mode !== "manual") return;

    if (minSize <= 0 || maxSize <= 0) {
      toast.error("Veuillez définir le nombre mini/maxi d'étudiants par groupe avant de déplacer.");
      return;
    }

    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const user = users.find(u => u.id === active.id);
    const targetGroup = groups.find(g => g.id === over.id);
    if (!user || !targetGroup || targetGroup.members.length >= maxSize) return;

    setGroups(prev =>
      prev.map(g =>
        g.id === targetGroup.id
          ? { ...g, members: [...g.members, user] }
          : { ...g, members: g.members.filter(m => m.id !== user.id) }
      )
    );
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const DraggableUser = ({ user }: { user: User }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({ id: user.id });
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={cn(
          "p-2 border rounded cursor-move bg-white dark:bg-muted",
          isDragging && "opacity-50"
        )}
        style={{
          transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        }}
      >
        {user.firstName} {user.lastName}
      </div>
    );
  };

  const DroppableGroup = ({
    group,
    onRemoveUser,
  }: {
    group: Group;
    onRemoveUser: (user: User) => void;
  }) => {
    const { isOver, setNodeRef } = useDroppable({ id: group.id });
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "w-full min-h-[220px] border rounded p-5 text-base bg-muted transition-colors duration-200",
          isOver ? "bg-blue-100 dark:bg-blue-900/30" : ""
        )}
      >
        <h4 className="font-semibold mb-3">{group.name}</h4>
        <div className="space-y-2">
          {group.members.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between text-sm text-muted-foreground border px-3 py-1 rounded bg-white dark:bg-background"
            >
              <span>
                {member.firstName} {member.lastName}
              </span>
              <button
                onClick={() => onRemoveUser(member)}
                className="text-red-500 hover:text-red-700"
                title="Retirer du groupe"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4 ">
        {mode === "random" && (
          <Button onClick={handleGenerateRandom} variant="outline">
            <Shuffle className="inline-block mr-2" /> Générer aléatoirement
          </Button>
        )}
        <Button onClick={resetGroups} variant="outline">
          Réinitialiser
        </Button>
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-6 grid-cols-[minmax(250px,1fr)_minmax(0,3fr)]">
          <div className="pr-4">
            <h3 className="text-lg font-bold mb-3">Étudiants disponibles</h3>
            <div className="space-y-2">
              {users.map((user) => (
                <DraggableUser key={user.id} user={user} />
              ))}
            </div>
          </div>
          <div className="space-y-4 w-full">
            <h3 className="text-lg font-bold">
              Groupes (min : {minSize}, max : {maxSize})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
              {groups.map((g) => (
                <DroppableGroup
                  key={g.id}
                  group={g}
                  onRemoveUser={(member) => {
                    setGroups((prev) =>
                      prev.map((gr) =>
                        gr.id === g.id
                          ? {
                              ...gr,
                              members: gr.members.filter(
                                (m) => m.id !== member.id
                              ),
                            }
                          : gr
                      )
                    );
                    setUsers((prev) => [...prev, member]);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </DndContext>

      <div className="flex justify-center space-x-4 mt-6">
        {mode === "random" && (
          <Button onClick={handleGenerateRandom} variant="outline">
            <Shuffle className="inline-block mr-2" /> Générer aléatoirement
          </Button>
        )}
        <Button onClick={resetGroups} variant="outline">
          Réinitialiser
        </Button>
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
    </div>
  );
}
