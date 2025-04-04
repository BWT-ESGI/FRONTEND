import * as React from "react"
import {
  FolderOpenDot,
  Users,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { PromotionSwitcher } from "@/components/promotion-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    firstname: "Thomas",
    lastname: "Goillot",
    email: "tgoillot@myges.fr",
  },
  promotions: [
    {
      name: "AL 1",
      logo: Users,
      plan: "ESGI",
    },
    {
      name: "AL 2",
      logo: Users,
      plan: "ESGI",
    },
    {
      name: "Classe 3",
      logo: Users,
      plan: "PPA",
    },
  ],
  projects: [
    {
      name: "Gestion des Projets",
      url: "#",
      icon: FolderOpenDot,
    },
    {
      name: "Gestion des Promotions",
      url: "#",
      icon: Users,
    },
    {
      name: "Gestion des Utilisateurs",
      url: "/user-manager",
      icon: Users,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PromotionSwitcher promotions={data.promotions} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
