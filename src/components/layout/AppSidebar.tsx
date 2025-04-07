import * as React from "react";

import { NavProjects } from "@/components/layout/NavProjects";
import { NavUser } from "@/components/layout/NavUser";
import { PromotionSwitcher } from "@/components/utils/PromotionSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebarData } from "@/hooks/useSidebarData";
import { LucideIcon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, loading } = useSidebarData();

  if (loading || !data) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PromotionSwitcher promotions={data.promotions} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects.map(project => ({
          ...project,
          icon: project.icon as LucideIcon,
        }))} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}