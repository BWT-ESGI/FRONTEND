import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/layout/dashboard.layout";
import FlexibleCard from "@/components/template/FlexibleCard";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

import {
  User2,
  Upload,
  PlusCircle,
  CircleCheckBig,
  ShieldAlert,
} from "lucide-react";
import FlexibleRadioGroupCard from "@/components/template/FlexibleRadioGroupCard";
import FileInput from "@/components/ui/FileInput";
import Divider from "@/components/layout/Divider";
import { parseCSV } from "@/utils/parseCSV";
import { useUsers } from "@/hooks/api/useUsers";
import UserRow from "@/components/user/UserRow";
import FlexibleAlert from "@/components/template/FlexibleAlert";

const userCreateSchema = z.object({
  method: z.enum(["manual", "file"]),
  users: z
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
    .min(1, "Au moins un utilisateur doit être ajouté"),
  file: z.instanceof(File).optional(),
});

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;

export default function UserCreatePage() {
  const { users: existingUsers } = useUsers();

  const form = useForm<UserCreateFormValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      method: "manual",
      users: [{ firstName: "", lastName: "", email: "" }],
    },
    mode: "all",
  });

  const { control, handleSubmit, setValue, trigger } = form;
  const { fields, append, remove } = useFieldArray({
    name: "users",
    control,
  });

  const usersData = useWatch({ control, name: "users" });

  const formEmails = usersData?.map((user) => user.email) || [];
  const existingEmails = existingUsers?.map((user) => user.email) || [];
  const combinedEmails = [...existingEmails, ...formEmails];
  const duplicateEmails = combinedEmails.reduce<Record<string, number>>(
    (acc, email) => {
      if (email) {
        acc[email] = (acc[email] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const method = form.watch("method");

  const onSubmit = () => {
    const usersList = form.getValues("users");
    console.log("Liste d'étudiants à envoyer :", usersList);
  };

  const modeOptions = [
    {
      value: "manual",
      label: "Manuel",
      description: "Création manuelle",
      icon: <User2 size={16} className="mb-2.5 text-muted-foreground" />,
    },
    {
      value: "file",
      label: "Fichier",
      description: "Import depuis un fichier",
      icon: <Upload size={16} className="mb-2.5 text-muted-foreground" />,
    },
  ];

  return (
    <DashboardLayout>
      <FlexibleCard
        title="Ajouter des étudiants"
        description="Choisissez une méthode pour ajouter des étudiants à l'application"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FlexibleRadioGroupCard
              options={modeOptions}
              defaultValue="manual"
              onValueChange={(value) =>
                setValue("method", value as "manual" | "file")
              }
              gridCols={3}
              className=""
            />
            <Divider className="my-4" />

            {method === "file" && (
              <div className="">
                <div className="flex flex-row items-start justify-between space-x-4">
                  <div className="flex-1">
                    <div className="w-full flex justify-center items-center">
                      <FormField
                        control={control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FileInput
                              label="Fichier CSV ou JSON"
                              accept={{
                                "text/csv": [".csv"],
                                "application/json": [".json"],
                              }}
                              maxFiles={1}
                              onChange={(files) => {
                                const selectedFile = files[0]?.file;
                                if (selectedFile) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const text = event.target?.result as string;
                                    let parsedData: any[] = [];
                                    if (
                                      selectedFile.type ===
                                        "application/json" ||
                                      selectedFile.name
                                        .toLowerCase()
                                        .endsWith(".json")
                                    ) {
                                      try {
                                        parsedData = JSON.parse(text);
                                      } catch (error) {
                                        console.error(
                                          "Erreur lors de l'analyse du JSON:",
                                          error
                                        );
                                      }
                                    } else if (
                                      selectedFile.name
                                        .toLowerCase()
                                        .endsWith(".csv")
                                    ) {
                                      parsedData = parseCSV(text);
                                    }
                                    if (Array.isArray(parsedData)) {
                                      setValue("users", parsedData, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                      trigger("users");
                                    } else {
                                      console.error(
                                        "Les données analysées ne sont pas un tableau"
                                      );
                                    }
                                  };
                                  reader.readAsText(selectedFile);
                                }
                                field.onChange(selectedFile);
                              }}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="p-4 border-l border-gray-200">
                    <h3 className="text-lg font-bold mb-2">Instructions</h3>
                    <div className="flex flex-col space-y-2">
                      <FlexibleAlert icon={<CircleCheckBig className="h-4 w-4 !text-blue-500" />} title="Format : CSV ou JSON"/>
                      <FlexibleAlert icon={<CircleCheckBig className="h-4 w-4 !text-blue-500" />} title="Poids maximum : 5MB"/>
                      <FlexibleAlert variant="warning" icon={<ShieldAlert className="h-4 w-4 !text-amber-500" />} title=" Assurez-vous que le fichier contient les colonnes requises : firstName, lastName, email."/>
                    </div>
                  </div>
                </div>
                <Divider className="my-4" />
              </div>
            )}

            <div className="space-y-4 flex flex-col w-full justify-center items-center">
              {fields.map((field, index) => {
                const currentUser = usersData[index] || {
                  firstName: "",
                  lastName: "",
                  email: "",
                };
                return (
                  <UserRow
                    key={field.id}
                    index={index}
                    control={control}
                    getFieldState={form.getFieldState}
                    formState={form.formState}
                    duplicateEmails={duplicateEmails}
                    user={currentUser}
                    remove={remove}
                  />
                );
              })}
              <Button
                type="button"
                onClick={() =>
                  append({
                    firstName: "",
                    lastName: "",
                    email: "",
                  })
                }
                className="size-fit"
                variant="outline"
              >
                <PlusCircle size={16} className="mr-2" /> Ajouter un étudiant
              </Button>
            </div>
            <Button type="submit">Créer</Button>
          </form>
        </Form>
      </FlexibleCard>
    </DashboardLayout>
  );
}
