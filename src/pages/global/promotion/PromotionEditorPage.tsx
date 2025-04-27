import { Link, useNavigate, useParams } from "react-router-dom";
import { FlexibleCircularProgress } from "@/components/template/FlexibleCircularProgress";
import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleTable from "@/components/template/FlexibleTable";
import DashboardLayout from "@/layout/dashboard.layout";
import { User } from "@/types/user.type";
import { usePromotion } from "@/hooks/api/usePromotion";
import PromotionEditorPageSkeleton from "./PromotionEditorPageSkeleton";
import NotFoundPage from "../NotFoundPage";
import { Project } from "@/types/project.type";
import { Button, buttonVariants } from "@/components/ui/button";
import ProjectFormModal from "@/components/promotion/ProjectFormModal";
import { useState } from "react";
import { deletePromotionById } from "@/services/promotionService";
import isStudent from "@/utils/isStudent";
import { FloatingDock } from "@/components/ui/floating-dock";
import { FolderUp, GraduationCap, Info, OctagonAlert, Trash, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import toast from "react-hot-toast";

export default function PromotionEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { promotion, loading, refetch } = usePromotion(id ?? "");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
    refetch();
  };

  const handleDeletePromotion = async () => {
    if (!id) return;

    try {
      await deletePromotionById(id);
      navigate("/promotions");
      toast.success("Promotion supprimée avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la promotion. Vérifiez que vous avez supprimé tous les projets et étudiants associés.");
      console.error("Erreur lors de la suppression :", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PromotionEditorPageSkeleton />
      </DashboardLayout>
    );
  }

  if (!promotion) {
    return <NotFoundPage />;
  }

  const tabs = [
    {
      title: "Créer un Projets",
      icon: <FolderUp className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setOpenModal(true),
    },
    {
      title: "Modifier la liste des étudiants",
      icon: <GraduationCap className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => navigate(`/promotions/${promotion.id}/ajouter-etudiant`),
    },
    { 
      title: "Supprimer la promotion",
      icon: <X className="h-full w-full text-red-500" />,
      onClick: () => setOpenDeleteModal(true),
    },
  ];

  return (
    <DashboardLayout>
      <ProjectFormModal
        open={openModal}
        onClose={handleCloseModal}
        promotionId={promotion.id.toString()}
      />
      {!isStudent() && (
        <div className="flex w-full justify-center">
          <FloatingDock items={tabs} desktopClassName="w-full" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <FlexibleCard
            key={promotion.id}
            title={promotion.name}
            description={`Enseignant: ${promotion.teacher.firstName} ${promotion.teacher.lastName}`}
          >
            <div className="max-w-xs mx-auto w-full flex items-center">
              <div className="flex flex-col items-center justify-center w-full">
                <FlexibleCircularProgress
                  value={promotion.students.length}
                  size={120}
                  strokeWidth={10}
                  showLabel
                  labelClassName="text-xl font-bold"
                  progressClassName="stroke-green-500"
                />
                <p className="mt-2 text-sm font-medium">Nombre d'étudiants</p>
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <FlexibleCircularProgress
                  value={promotion.projects.length}
                  size={120}
                  strokeWidth={10}
                  showLabel
                  labelClassName="text-xl font-bold"
                  progressClassName="stroke-orange-500"
                />
                <p className="mt-2 text-sm font-medium">Nombre de projets</p>
              </div>
            </div>
          </FlexibleCard>
        </div>

        <FlexibleCard
          title="Projets de la promotion"
          description="Gérer les projets de la promotion"
          childrenRightEnd={
            isStudent() ? undefined : (
              <Button size="sm" onClick={() => setOpenModal(true)}>
                Créer un projet
              </Button>
            )
          }
        >
          <FlexibleTable<Project>
            data={promotion.projects}
            columns={[
              {
                accessorKey: "name",
                header: "Nom",
              },
              {
                accessorKey: "description",
                header: "Description",
              },
              {
                accessorKey: "createdAt",
                header: "Créer le",
              },
              {
                accessorKey: "deadline",
                header: "Se termine le",
              },
            ]}
          />
        </FlexibleCard>

        <FlexibleCard
          title="Etudiants de la promotion"
          description="Gérer les étudiants de la promotion"
          childrenRightEnd={
            isStudent() ? undefined : (
              <Button size="sm">
                <Link to={`/promotions/${promotion.id}/ajouter-etudiant`}>
                  Modifier la liste des étudiants
                </Link>
              </Button>
            )
          }
        >
          <FlexibleTable<User>
            data={promotion.students}
            columns={[
              {
                accessorKey: "firstName",
                header: "Prénom",
              },
              {
                accessorKey: "lastName",
                header: "Nom de famille",
              },
              {
                accessorKey: "username",
                header: "Nom d'utilisateur",
              },
              {
                accessorKey: "email",
                header: "Email",
              },
            ]}
          />
        </FlexibleCard>
      </div>
       <AlertDialog onOpenChange={setOpenDeleteModal} open={openDeleteModal}>
            <AlertDialogTrigger asChild>
                <div />
            </AlertDialogTrigger>
            <AlertDialogContent className="overflow-hidden">
                <AlertDialogHeader className="pb-4">
                    <AlertDialogTitle>
                        <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                            <OctagonAlert className="h-5 w-5 text-destructive" />
                        </div>
                        Êtes-vous sûr de vouloir supprimer cette promotion ?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[15px] flex flex-col gap-2">
                      <FlexibleAlert variant="warning" icon={<Info className="h-4 w-4 text-neutral-500" />} title="Assurer vous de supprimer tout les éléments associés à cette promotion avant de la supprimer."/>
                      <FlexibleAlert variant="error" icon={<X className="text-destructive" />} title="Cette action est irréversible. Vous ne pourrez pas récupérer cette promotion une fois supprimée."/>
                        
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="border-t -mx-6 -mb-6 px-6 py-5">
                    <AlertDialogCancel  onClick={() => setOpenDeleteModal(false)}>
                        <X /> Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={async () => { await handleDeletePromotion(); setOpenDeleteModal(false); }}
                    >
                        <Trash />
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </DashboardLayout>
  );
}