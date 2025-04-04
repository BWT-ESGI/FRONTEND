import FlexibleCard from "@/components/FlexibleCard";
import FlexibleTable from "@/components/FlexibleTable";
import DashboardLayout from "@/layout/dashboard.layout";
import { ColumnDef } from "@tanstack/react-table";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const userData: User[] = [
  { id: "1", name: "Alice Smith", email: "alice@example.com", role: "admin" },
  { id: "2", name: "Bob Jones", email: "bob@example.com", role: "editor" },
  { id: "3", name: "Carol Lee", email: "carol@example.com", role: "viewer" },
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
                <FlexibleCard title="Gestion des utilisateurs" description="Gérer les utilisateurs de l'application">
                    <FlexibleTable<User> data={userData} columns={userColumns} />
                </FlexibleCard>
            </div>
        </DashboardLayout>
    )
}
