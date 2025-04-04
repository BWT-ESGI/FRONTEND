import { AppSidebar } from "@/components/AppSidebar"
import { AutoBreadcrumb } from "@/components/AutoBreadcrumb"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useBreadcrumb } from "@/hooks/useBreadcrumb"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AutoBreadcrumb items={useBreadcrumb()} />

                {children}
               
            </SidebarInset>
        </SidebarProvider>
    )
}
