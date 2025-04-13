import React from "react";
import {
  Trash2,
  XCircle as XCircleIcon,
  CircleCheckBig,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserRowProps {
  index: number;
  control: any;
  getFieldState: (name: any, formState: any) => any;
  formState: any;
  duplicateEmails: Record<string, number>;
  user: { firstName: string; lastName: string; email: string };
  remove: (index: number) => void;
}

const UserRow: React.FC<UserRowProps> = ({
  index,
  control,
  getFieldState,
  formState,
  duplicateEmails,
  user,
  remove,
}) => {
  const firstNameState = getFieldState(`users.${index}.firstName`, formState);
  const lastNameState = getFieldState(`users.${index}.lastName`, formState);
  const emailState = getFieldState(`users.${index}.email`, formState);

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

  const currentEmail = user.email;
  const isDuplicate = currentEmail && duplicateEmails[currentEmail] > 1;
  if (isDuplicate) {
    errorsForRow.push("L'email existe déjà");
  }

  const isRowEmpty = !user.firstName && !user.lastName && !user.email;

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
              <Input placeholder="Prénom" {...field} className="w-full" />
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
              <Input placeholder="Nom" {...field} className="w-full" />
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
              <Input placeholder="Email" {...field} className="w-full" />
            </FormItem>
          )}
        />
      </div>
      <Button type="button" variant="destructive" onClick={() => remove(index)}>
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

export default UserRow;
