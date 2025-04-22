import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleTable from "@/components/template/FlexibleTable";
import DashboardLayout from "@/layout/dashboard.layout";
import { User } from "@/types/user.type";
import { useUsers } from "@/hooks/api/useUsers";
import UserManagerPageSkeleton from "./UserManagerPageSkeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function UserManagerPage() {
  const { users, loading } = useUsers();

  if (loading) {
    return (
      <UserManagerPageSkeleton/>
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
          ]} />
        </FlexibleCard>
      </div>
    </DashboardLayout>
  );
}
