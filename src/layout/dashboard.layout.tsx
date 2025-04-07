import { AppSidebar } from "@/components/layout/AppSidebar";
import { AutoBreadcrumb } from "@/components/utils/AutoBreadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AutoBreadcrumb items={useBreadcrumb()} />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
