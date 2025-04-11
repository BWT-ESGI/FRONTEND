import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/layout/dashboard.layout";
import FlexibleCard from "@/components/template/FlexibleCard";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";


const promotionCreateSchema = z.object({
  name: z.string().min(2, "Le nom de la promotion est requis"),
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

export type PromotionCreateFormValues = z.infer<typeof promotionCreateSchema>;

export default function PromotionCreatePage() {
  const form = useForm<PromotionCreateFormValues>({
    resolver: zodResolver(promotionCreateSchema),
    defaultValues: {
      name: "",
      method: "manual",
    },
    mode: "all",
  });

  const { control, handleSubmit} = form;

  const onSubmit = (data: PromotionCreateFormValues) => {
    console.log("Création de la promotion :", data);
  };

  return (
    <DashboardLayout>
      <FlexibleCard
        title="Créer une promotion"
        description="Créer une nouvelle promotion en remplissant le formulaire ci-dessous."
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Input placeholder="Nom de la promotion" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Créer la promotion</Button>
          </form>
        </Form>
      </FlexibleCard>
    </DashboardLayout>
  );
}
