import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleTable from "@/components/template/FlexibleTable";
import DashboardLayout from "@/layout/dashboard.layout";
import { User } from "@/types/user.type";
import { useUsers } from "@/hooks/api/useUsers";
import UserManagerPageSkeleton from "./UserManagerPageSkeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { deleteUser } from "@/services/userService";
import { useState } from "react";

export default function UserManagerPage() {
  const { users, loading } = useUsers();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (loading) {
    return (
      <UserManagerPageSkeleton />
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <FlexibleCard
          title="Gestion des utilisateurs"
          description="Gérer les utilisateurs de l'application"
          childrenRightEnd={
            <Link to={"/gestion-utilisateurs/create"}>
              <Button>
                Ajouter un utilisateur
              </Button>
            </Link>
          }
        >
          <FlexibleTable<User> data={users} columns={[
            {
              accessorKey: "id",
              header: "ID",
              size: 50,
            },
            {
              accessorKey: "firstName",
              header: "Prénom",
            },
            {
              accessorKey: "lastName",
              header: "Nom",
            },
            {
              accessorKey: "username",
              header: "Nom d'utilisateur",
            },
            {
              accessorKey: "email",
              header: "Email",
            },
            {
              accessorKey: "role",
              header: "Rôle",
            },
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deletingId === row.original.id}
                  onClick={async () => {
                    if (!window.confirm("Supprimer cet utilisateur ?")) return;
                    setDeletingId(row.original.id);
                    try {
                      await deleteUser(row.original.id);
                      window.location.reload(); // Ou re-fetch users si hook
                    } finally {
                      setDeletingId(null);
                    }
                  }}
                >
                  Supprimer
                </Button>
              ),
            },
          ]} />
        </FlexibleCard>
      </div>
    </DashboardLayout>
  );
}
