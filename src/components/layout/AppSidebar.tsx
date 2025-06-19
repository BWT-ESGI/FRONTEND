import * as React from "react";

import { NavProjects } from "@/components/layout/NavProjects";
import { NavUser } from "@/components/layout/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebarData } from "@/hooks/useSidebarData";
import { LucideIcon } from "lucide-react";
import { APP_NAME } from "@/config";
import getLogo from "@/utils/getLogo";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, loading } = useSidebarData();
  const { state } = useSidebar();
  const logo = getLogo();

  if (loading || !data) {
    return null;
  }

  const logoSrc = state === "collapsed" ? logo.logo : logo.logoText;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center w-full py-2">
          <img
            src={logoSrc}
            alt={"Logo " + APP_NAME}
            className="w-1/2"
          />
        </div>
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