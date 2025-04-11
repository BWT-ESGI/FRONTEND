import DashboardLayout from "@/layout/dashboard.layout";
import FlexibleCard from "@/components/template/FlexibleCard";
import { FlexibleCircularProgress } from "@/components/template/FlexibleCircularProgress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Promotion } from "@/types/promotion.type";
import { usePromotions } from "@/hooks/api/usePromotions";
import { PromotionManagerPageSkeleton } from "./PromotionManagerPageSkeleton";
import { FlexibleSearchBar } from "@/components/template/FlexibleSearchBar";
import { Plus } from "lucide-react";
import PromotionFormModal from "@/components/promotion/PromotionFormModal";
import { useState } from "react";

export default function PromotionManagerPage() {
  const { promotions, loading, refetch } = usePromotions();
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
    refetch();
  };

  return (
    <DashboardLayout>
      <PromotionFormModal open={openModal} onClose={handleClose} />
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpenModal(true)} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une promotion
        </Button>
      </div>
      <div className="pt-0 p-4">
        {loading ? (
          <PromotionManagerPageSkeleton />
        ) : (
          <FlexibleSearchBar<Promotion>
            data={promotions}
            placeholder="Rechercher une promotion..."
            rightChildren={
              <Link to="/gestion-promotions/ajouter">
                <Button className="cursor-pointer">Créer une promotion</Button>
              </Link>
            }
            render={(filteredPromotions) => (
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {filteredPromotions.map((promotion) => (
                  <FlexibleCard
                    key={promotion.id}
                    title={promotion.name}
                    description={`Enseignant: ${promotion.teacher.firstName} ${promotion.teacher.lastName}`}
                    childrenFooter={
                      <div className="flex justify-end mt-8">
                        <Link to={`/gestion-promotions/${promotion.id}`}>
                          <Button className="cursor-pointer">
                            Voir les détails
                          </Button>
                        </Link>
                      </div>
                    }
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
                        <p className="mt-2 text-sm font-medium">
                          Nombre d'étudiants
                        </p>
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
                        <p className="mt-2 text-sm font-medium">
                          Nombre de projets
                        </p>
                      </div>
                    </div>
                  </FlexibleCard>
                ))}
              </div>
            )}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
