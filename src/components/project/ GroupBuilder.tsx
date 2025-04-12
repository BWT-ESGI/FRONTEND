import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchMockGroupBuilderData, User, Group } from "@/services/groupService";
import { useEffect } from "react";

interface GroupBuilderProps {
  mode: "manual" | "random" | "free";
  minSize: number;
  maxSize: number;
  deadline?: Date;
}

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
      {user.name}
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
        {group.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between text-sm text-muted-foreground border px-3 py-1 rounded bg-white dark:bg-background"
          >
            <span>{member.name}</span>
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

export default function GroupBuilder({
  mode,
  minSize,
  maxSize,
  deadline,
}: GroupBuilderProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  useEffect(() => {
    const loadInitialData = async () => {
      const { users, groups } = await fetchMockGroupBuilderData();
      setUsers(users);
      setGroups(groups);
    };
  
    loadInitialData();
  }, []);

  const handleSave = () => {
    console.log({
      mode,
      minSize,
      maxSize,
      deadline,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const user = users.find((u) => u.id === active.id);
    if (!user) return;
  
    // Vérifier si le groupe existe et n'est pas plein
    const targetGroup = groups.find((g) => g.id === over.id);
    if (!targetGroup) return;
  
    const isAlreadyInGroup = targetGroup.members.some((m) => m.id === user.id);
    const isGroupFull = targetGroup.members.length >= maxSize;
  
    if (isAlreadyInGroup || isGroupFull) return;
  
    // Mettre à jour les groupes
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === over.id) {
          return {
            ...group,
            members: [...group.members, user],
          };
        } else {
          return {
            ...group,
            members: group.members.filter((m) => m.id !== user.id),
          };
        }
      })
    );
  
    // Supprimer l'étudiant de la liste des utilisateurs disponibles
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const resetGroups = async () => {
    const { users: initialUsers, groups: initialGroups } = await fetchMockGroupBuilderData();
  
    setUsers(initialUsers);
    setGroups(initialGroups);
  };

  if (mode === "random") {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Le mode <strong>aléatoire</strong> est activé. Les groupes seront
        générés automatiquement.
      </div>
    );
  }

  return (
    <div className="w-full">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-6 grid-cols-[minmax(250px,1fr)_minmax(0,3fr)]">
          {/* Colonne Étudiants */}
          <div className="pr-4">
            <h3 className="text-lg font-bold mb-3">Étudiants disponibles</h3>
            <div className="space-y-2">
              {users.map((user) => (
                <DraggableUser key={user.id} user={user} />
              ))}
            </div>
          </div>

          {/* Colonne Groupes */}
          <div className="space-y-4 w-full">
            <h3 className="text-lg font-bold">
              Groupes (min: {minSize}, max: {maxSize})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
              {groups.map((group) => (
                <DroppableGroup
                  key={group.id}
                  group={group}
                  onRemoveUser={(user) => {
                    // Supprimer du groupe
                    setGroups((prev) =>
                      prev.map((g) =>
                        g.id === group.id
                          ? {
                              ...g,
                              members: g.members.filter(
                                (m) => m.id !== user.id
                              ),
                            }
                          : g
                      )
                    );

                    // Ajouter à la liste des utilisateurs
                    setUsers((prev) => [...prev, user]);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </DndContext>

      <div className="mt-6 flex justify-center gap-x-4">
        <Button onClick={resetGroups} variant="outline">
          Réinitialiser les groupes
        </Button>
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
    </div>
  );
}
