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

interface GroupBuilderProps {
  mode: "manual" | "random" | "student_choice";
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
  const { isOver, setNodeRef } = useDroppable({ id: String(group.id) });

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
            <span>{member.firstName} {member.lastName}</span>
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
  const { id: projectId } = useParams<{ id: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (projectId) {
        const { users: initialUsers, groups: initialGroups } =
          await fetchGroupBuilderDataByProject(projectId);
        setUsers(initialUsers);
        setGroups(initialGroups);
      }
    };

    loadInitialData();
  }, [projectId]);

  const handleSave = async () => {
    if (!projectId) return;

    try {
      await saveGroupsForProject(Number(projectId), groups);

      await updateProjectConfig(Number(projectId), {
        nbStudentsMinPerGroup: minSize,
        nbStudentsMaxPerGroup: maxSize,
        groupCompositionType: mode,
        nbGroups: groups.length,
        deadline: deadline?.toISOString(),
      });

      console.log("Groupes et config enregistrés !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const user = users.find((u) => u.id === active.id);
    if (!user) return;

    const targetGroup = groups.find((g) => String(g.id) === over.id);
    if (!targetGroup) return;

    const isAlreadyInGroup = targetGroup.members.some((m) => m.id === user.id);
    const isGroupFull = targetGroup.members.length >= maxSize;

    if (isAlreadyInGroup || isGroupFull) return;

    setGroups((prev) =>
      prev.map((group) =>
        group.id === targetGroup.id
          ? { ...group, members: [...group.members, user] }
          : { ...group, members: group.members.filter((m) => m.id !== user.id) }
      )
    );

    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const resetGroups = async () => {
    if (projectId) {
      const { users: initialUsers, groups: initialGroups } =
        await fetchGroupBuilderDataByProject(projectId);
      setUsers(initialUsers);
      setGroups(initialGroups);
    }
  };

  if (mode === "random") {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Le mode <strong>aléatoire</strong> est activé. Les groupes seront générés automatiquement.
      </div>
    );
  }

  return (
    <div className="w-full">
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
              Groupes (min: {minSize}, max: {maxSize})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
              {groups.map((group) => (
                <DroppableGroup
                  key={group.id}
                  group={group}
                  onRemoveUser={(user) => {
                    setGroups((prev) =>
                      prev.map((g) =>
                        g.id === group.id
                          ? {
                              ...g,
                              members: g.members.filter((m) => m.id !== user.id),
                            }
                          : g
                      )
                    );
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