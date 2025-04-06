import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleTable from "@/components/template/FlexibleTable";
import DashboardLayout from "@/layout/dashboard.layout";
import { User } from "@/types/user.type";
import { ColumnDef } from "@tanstack/react-table";

const userData: User[] = [
  { id: "1", name: "Alice Smith", email: "alice@example.com", role: "student" },
  { id: "2", name: "Bob Jones", email: "bob@example.com", role: "student" },
  { id: "3", name: "Carol Lee", email: "carol@example.com", role: "student" },
];

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) =>
      info.getValue() === "student" ? "Student" : info.getValue(),
  },
];

export default function UserManagerPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <FlexibleCard
          title="Gestion des utilisateurs"
          description="Gérer les utilisateurs de l'application"
        >
          <FlexibleTable<User> data={userData} columns={userColumns} />
        </FlexibleCard>
      </div>
    </DashboardLayout>
  );
}
