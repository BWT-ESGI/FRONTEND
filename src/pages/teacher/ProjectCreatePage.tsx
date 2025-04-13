import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/layout/dashboard.layout";
import FlexibleCard from "@/components/template/FlexibleCard";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const projectCreateSchema = z.object({
  name: z.string().min(2, "Le nom de la project est requis"),
  method: z.enum(["manual", "file"]),
  students: z
    .array(
      z.object({
        firstName: z
          .string()
          .min(
            2,
            "Le prénom est requis et doit comporter au moins 2 caractères"
          ),
        lastName: z
          .string()
          .min(2, "Le nom est requis et doit comporter au moins 2 caractères"),
        email: z.string().email("Email invalide"),
      })
    )
    .min(1, "Au moins un étudiant doit être ajouté"),
  file: z.instanceof(File).optional(),
});

export type projectCreateFormValues = z.infer<typeof projectCreateSchema>;

export default function ProjectCreatePage() {
  const form = useForm<projectCreateFormValues>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      name: "",
      method: "manual",
    },
    mode: "all",
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: projectCreateFormValues) => {
    console.log("Création de la projet :", data);
  };

  return (
    <DashboardLayout>
      <FlexibleCard
        title="Créer un projet"
        description="Créer un nouveau projet en remplissant le formulaire ci-dessous."
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Input placeholder="Nom du project" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Créer le project</Button>
          </form>
        </Form>
      </FlexibleCard>
    </DashboardLayout>
  );
}
