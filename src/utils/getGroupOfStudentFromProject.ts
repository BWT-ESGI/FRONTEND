import { Group } from "@/types/group.type";
import { Project } from "@/types/project.type";

export default async function getGroupOfStudentFromProject(
  project: Project | null,
  userId: string
): Promise<Group[] | null> {
  if (!project) return null;

    const filteredGroups = project.groups?.filter((group) =>
        group.members.some((member) => member.id === userId)
      );

  return filteredGroups || [] as Group[];
}