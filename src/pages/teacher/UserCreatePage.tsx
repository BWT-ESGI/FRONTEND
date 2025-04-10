import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/layout/dashboard.layout";
import FlexibleCard from "@/components/template/FlexibleCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  User2,
  Trash2,
  Upload,
  PlusCircle,
  XCircle as XCircleIcon,
  CircleCheckBig,
  ShieldAlert,
} from "lucide-react";
import FlexibleRadioGroupCard from "@/components/template/FlexibleRadioGroupCard";
import FileInput from "@/components/ui/FileInput";
import Divider from "@/components/layout/Divider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseCSV } from "@/utils/parseCSV";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useUsers } from "@/hooks/api/useUsers";


const userCreateSchema = z.object({
  method: z.enum(["manual", "file"]),
  users: z.array(
    z.object({
      firstName: z.string().min(2, "Le prénom est requis et doit comporter au moins 2 caractères"),
      lastName: z.string().min(2, "Le nom est requis et doit comporter au moins 2 caractères"),
      email: z.string().email("Email invalide"),
    })
  ).min(1, "Au moins un utilisateur doit être ajouté"),
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
  
  const formEmails = usersData?.map(user => user.email) || [];
  const existingEmails = existingUsers?.map(user => user.email) || [];
  const combinedEmails = [...existingEmails, ...formEmails];
  const duplicateEmails = combinedEmails.reduce<Record<string, number>>((acc, email) => {
    if (email) {
      acc[email] = (acc[email] || 0) + 1;
    }
    return acc;
  }, {});
  
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
                      <Alert className="bg-blue-500/10 dark:bg-blue-600/30 border-none">
                        <CircleCheckBig className="h-4 w-4 !text-blue-500" />
                        <AlertTitle>Format : CSV ou JSON</AlertTitle>
                      </Alert>
                      <Alert className="bg-blue-500/10 dark:bg-blue-600/30 border-none">
                        <CircleCheckBig className="h-4 w-4 !text-blue-500" />
                        <AlertTitle>Poids maximum : 5MB</AlertTitle>
                      </Alert>
                      <Alert className="bg-amber-500/10 dark:bg-amber-600/30 border-none">
                        <ShieldAlert className="h-4 w-4 !text-amber-500" />
                        <AlertTitle>
                          Assurez-vous que le fichier contient les colonnes
                          requises : firstName, lastName, email.
                        </AlertTitle>
                      </Alert>
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

                const firstNameState = form.getFieldState(
                  `users.${index}.firstName`,
                  form.formState
                );
                const lastNameState = form.getFieldState(
                  `users.${index}.lastName`,
                  form.formState
                );
                const emailState = form.getFieldState(
                  `users.${index}.email`,
                  form.formState
                );

                const errorsForRow: string[] = [];
                if (firstNameState.error) {
                  errorsForRow.push(`Prénom: ${firstNameState.error.message}`);
                }
                if (lastNameState.error) {
                  errorsForRow.push(`Nom: ${lastNameState.error.message}`);
                }
                if (emailState.error) {
                  errorsForRow.push(`Email: ${emailState.error.message}`);
                }

                const currentEmail = currentUser.email;
                const isDuplicate =
                  currentEmail && duplicateEmails[currentEmail] > 1;
                if (isDuplicate) {
                  errorsForRow.push("L'email existe déjà");
                }

                const isRowEmpty =
                  !currentUser.firstName &&
                  !currentUser.lastName &&
                  !currentUser.email;

                const tooltipMessage =
                  errorsForRow.length > 0
                    ? errorsForRow.join(" | ")
                    : isRowEmpty
                    ? "Ligne vide"
                    : isDuplicate
                    ? "Email déjà utilisé"
                    : "";

                const icon =
                  errorsForRow.length > 0 ? (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  ) : isRowEmpty ? (
                    <User2 className="h-5 w-5 text-muted-foreground" />
                  ) : isDuplicate ? (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <CircleCheckBig className="h-5 w-5 text-green-500" />
                  );

                return (
                  <div
                    key={field.id}
                    className={`w-full flex items-center space-x-4 p-2 border rounded ${
                      errorsForRow.length ? "border-red-500" : "border-border"
                    }`}
                  >
                    <Tooltip>
                      <TooltipTrigger>{icon}</TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{tooltipMessage}</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="flex-1">
                      <FormField
                        control={control}
                        name={`users.${index}.firstName`}
                        render={({ field }) => (
                          <FormItem className="flex items-center m-0">
                            <Input
                              placeholder="Prénom"
                              {...field}
                              className="w-full"
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={control}
                        name={`users.${index}.lastName`}
                        render={({ field }) => (
                          <FormItem className="flex items-center m-0">
                            <Input
                              placeholder="Nom"
                              {...field}
                              className="w-full"
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={control}
                        name={`users.${index}.email`}
                        render={({ field }) => (
                          <FormItem className="flex items-center m-0">
                            <Input
                              placeholder="Email"
                              {...field}
                              className="w-full"
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
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
