import api from "@/config/axios";
import { Project } from "@/types/project.type";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

interface UpdateProjectParams {
  projectId: string;
  body: Partial<Project>;
}
  

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ projectId, body }: UpdateProjectParams) => {
      const { data } = await api.patch<Project>(`/projects/${projectId}`, body);
      return data;
    },
    {
      onMutate: async ({ projectId, body }) => {
        await queryClient.cancelQueries(["project", projectId]);
        const previousProject = queryClient.getQueryData<Project>(["project", projectId]);
        queryClient.setQueryData(["project", projectId], {
          ...previousProject,
          ...body,
        });
        return { previousProject };
      },
      onSuccess: (updatedProject, variables) => {
        queryClient.setQueryData(
          ["project", variables.projectId],
          updatedProject
        );
        toast.success("Le projet a été mis à jour avec succès !");
      },
      onError: (error, variables, context) => {
        if (context?.previousProject) {
          queryClient.setQueryData(["project", variables.projectId], context.previousProject);
        }
        console.error("Erreur lors de la mise à jour du projet :", error);
        toast.error("Erreur lors de la mise à jour du projet.");
      },
    }
  );
}