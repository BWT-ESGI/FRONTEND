import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { CircleHelp, ExternalLink, School } from "lucide-react";
import Divider from "@/components/layout/Divider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef } from "react";


export default function AskSchoolModal() {
  const schools = [
    { id: 1, name: "ESGI" },
    { id: 2, name: "Epitech" },
    { id: 3, name: "PPA" },
    { id: 4, name: "Epita" },
    { id: 5, name: "IIM" },
    { id: 6, name: "ESIEA" },
    { id: 7, name: "ESILV" },
    { id: 8, name: "Ecole de l'Air" },
    { id: 9, name: "Ecole Navale" },
    { id: 10, name: "Ecole Polytechnique" },
    { id: 11, name: "Ecole des Ponts" },
    { id: 12, name: "Ecole Centrale" },
    { id: 13, name: "Ecole des Mines" },
    { id: 14, name: "Ecole Normale Supérieure" },
    { id: 15, name: "Ecole Supérieure de Physique et de Chimie" },
    { id: 16, name: "Ecole Supérieure de Biotechnologie" },
    { id: 17, name: "Ecole Supérieure de Chimie" },
    { id: 18, name: "Ecole Supérieure de Génie Electrique" },
    { id: 19, name: "Ecole Supérieure de Génie Mécanique" },
    { id: 20, name: "Ecole Supérieure de Génie Civil" },
    { id: 21, name: "Ecole Supérieure de Génie des Systèmes" },
    { id: 22, name: "Ecole Supérieure de Génie des Matériaux" },
    { id: 23, name: "Ecole Supérieure de Génie des Télécommunications" },
    { id: 24, name: "Ecole Supérieure de Génie des Transports" },
    { id: 25, name: "Ecole Supérieure de Génie des Réseaux" },
    { id: 26, name: "Ecole Supérieure de Génie des Logiciels" },
    { id: 27, name: "Ecole Supérieure de Génie des Systèmes d'Information" },
    { id: 28, name: "Ecole Supérieure de Génie des Systèmes Embarqués" },
    { id: 29, name: "Ecole Supérieure de Génie des Systèmes Intelligents" },
    { id: 30, name: "Ecole Supérieure de Génie des Systèmes Complexes" },
  ];

  const continueButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
            <School className="mr-2 h-4 w-4" />
            Votre école
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogHeader className="pb-4">
          <AlertDialogTitle>
            <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-blue-100">
              <CircleHelp className="h-6 w-6 text-blue-100" />
            </div>
            Où enseignez-vous ?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-[15px]">
              Nous avons détecté que vous n'avez pas encore renseigné votre
              école. Merci de choisir votre école dans la liste ci-dessous.
              <Divider className="my-4" />
              <Select
                defaultValue="ecole1"
                onValueChange={(value) => {
                  console.log(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une école" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={`ecole${school.id}`}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="border-t -mx-6 -mb-6 px-6 py-5">
          <Button
            variant="link"
            className="-ml-3 mr-auto text-muted-foreground"
          >
            Pourquoi choisir une école ? <ExternalLink />
          </Button>
          <AlertDialogAction
            ref={continueButtonRef}
            className={buttonVariants()}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
