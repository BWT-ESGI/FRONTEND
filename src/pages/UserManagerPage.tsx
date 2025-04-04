import { AppSidebar } from "@/components/app-sidebar"
import { AutoBreadcrumb } from "@/components/header-breadcrumb"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useBreadcrumb } from "@/hooks/useBreadcrumb"

export default function UserManagerPage() {

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AutoBreadcrumb items={useBreadcrumb()} />

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
