import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleTable from "@/components/template/FlexibleTable";
import DashboardLayout from "@/layout/dashboard.layout";
import { User } from "@/types/user.type";
import { useUsers } from "@/hooks/api/useUsers";
import UserManagerPageSkeleton from "./UserManagerPageSkeleton";

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
        >
          <FlexibleTable<User> data={users} />
        </FlexibleCard>
      </div>
    </DashboardLayout>
  );
}
