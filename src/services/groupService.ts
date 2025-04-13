import api from "../config/axios";
import { User } from "@/types/user.type";
import { Group } from "@/types/group.type";
import { Project } from "@/types/project.type";

export const fetchGroupBuilderDataByProject = async (
  projectId: string
): Promise<{ users: User[]; groups: Group[] }> => {
  const { data: project } = await api.get<Project>(`/projects/${projectId}`);
  const allStudents = project.promotion.students;
  const groups = project.groups;

  const assignedStudentIds = new Set(
    groups.flatMap((g) => g.members.map((m) => m.id))
  );

  const unassignedStudents = allStudents.filter(
    (s) => !assignedStudentIds.has(s.id)
  );

  return {
    users: unassignedStudents,
    groups,
  };
};

export const saveGroupsForProject = async (projectId: number, groups: Group[]) => {
  try {
    const payload = groups.map((group) => ({
      id: group.id,
      name: group.name,
      projectId,
      memberIds: group.members.map((member) => member.id),
    }));

    return await api.post(`/groups/save-for-project/${projectId}`, payload);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des groupes :", error);
    throw error;
  }
};

export const updateProjectConfig = async (
  projectId: number,
  payload: {
    nbStudentsMinPerGroup: number;
    nbStudentsMaxPerGroup: number;
    groupCompositionType?: "manual" | "random" | "student_choice";
    nbGroups?: number;
    deadline?: string;
  }
) => {
  return await api.patch(`/projects/${projectId}`, payload);
};