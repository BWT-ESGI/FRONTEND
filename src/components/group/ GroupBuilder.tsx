// src/components/group/GroupBuilder.tsx
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { ArrowDown, ArrowUp, OctagonX, Shuffle } from "lucide-react";
import { useProjectContext } from "@/contexts/ProjectContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Divider from "../layout/Divider";
import FlexibleAlert from "../template/FlexibleAlert";

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

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeUser = users.find(u => u.id === activeId);

  const totalSlots = groups.length * maxSize;
  const assignedCount = initialGroups.reduce((sum, g) => sum + g.members.length, 0);
  const totalStudents = initialUsers.length + assignedCount;

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
    if (minSize <= 0 || maxSize <= 0) {
      toast.error("Veuillez définir des tailles minimales et maximales correctes.");
      return;
    }
    if (minSize > maxSize) {
      toast.error("La taille minimale ne peut pas être supérieure à la taille maximale.");
      return;
    }
  
    const all = [...initialUsers, ...initialGroups.flatMap(g => g.members)];
    const shuffled = all.sort(() => Math.random() - 0.5);
  
    const newGroups = initialGroups.map(g => ({ ...g, members: [] as User[] }));
  
    let idx = 0;
    for (let g of newGroups) {
      for (let i = 0; i < minSize && idx < shuffled.length; i++) {
        g.members.push(shuffled[idx++]);
      }
    }
  
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
    setActiveId(null);
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
          "flex flex-row items-center p-2 border rounded-lg shadow-sm cursor-move bg-white dark:bg-muted gap-2",
          isDragging && "opacity-50"
        )}
        style={{
          transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        }}
      >
        <Avatar className="h-6 w-6 rounded-md">
          <AvatarFallback className="rounded text-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm">
          {user.firstName} {user.lastName}
        </p>
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
          "w-full min-h-[220px] border rounded p-5 text-base transition-colors duration-200",
          isOver ? "bg-blue-100 dark:bg-blue-900/30" : ""
        )}
      >
        <h4 className="font-semibold mb-3">{group.name}</h4>
        <div className="space-y-1">
          {group.members.map((member) => (
            <div
              key={member.id}
              className="flex flex-row items-center p-2 border rounded-lg shadow-sm cursor-move bg-white dark:bg-muted gap-2"
            >
              <Avatar className="h-6 w-6 rounded-md">
                <AvatarFallback className="rounded text-sm">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">
                {member.firstName} {member.lastName}
              </p>
              <button
                onClick={() => onRemoveUser(member)}
                className="text-red-500 hover:text-red-700 ml-auto"
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
      {totalStudents > totalSlots && (
        <FlexibleAlert
          variant="error"
          title={`Il y a ${totalStudents} étudiants au total, mais seulement ${totalSlots} places disponibles dans les groupes.`}
          icon={<OctagonX className="!text-red-500 text-center" />}
        />
      )}
      <div className="flex justify-center space-x-4 ">
        {mode === "random" && (
          <Button onClick={handleGenerateRandom} variant="outline">
            <Shuffle className="inline-block mr-2" /> Générer aléatoirement
          </Button>
        )}
        <Button onClick={resetGroups} variant="outline">
          Réinitialiser
        </Button>
        <Button onClick={() => handleSave()}>Enregistrer</Button>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        autoScroll={{
          threshold: { x: 0, y: 0.1 },
          layoutShiftCompensation: false,
        }}
        onDragStart={(event: DragStartEvent) =>
          setActiveId(event.active.id as string)
        }
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <DragOverlay>
          {activeUser ? <DraggableUser user={activeUser} /> : null}
        </DragOverlay>
        <div className="grid gap-6 grid-cols-[minmax(250px,1fr)_minmax(0,3fr)]">
          <div className="pr-4">
            <h3 className="text-lg font-bold mb-3">Étudiants disponibles</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Nombre d'étudiants: {users.length}
            </p>
            <Divider className="my-2 mt-0" />
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {users.map((user) => (
                <DraggableUser key={user.id} user={user} />
              ))}
            </div>
          </div>
          <div className="space-y-4 w-full">
            <h3 className="text-lg font-bold">
              Groupes{" "}
              <ArrowDown className="text-red-500 inline-block text-xs" />{" "}
              {minSize} Minimum -{" "}
              <ArrowUp className="text-green-500 inline-block text-xs" />{" "}
              {maxSize} Maximum
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
        <Button onClick={() => handleSave()}>Enregistrer</Button>
      </div>
    </div>
  );
}
