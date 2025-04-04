import * as React from "react"
import {
  BookOpen,
  Bot,
  FolderOpenDot,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
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
  navMain: [
    {
      title: "Projets",
      url: "#",
      icon: Bot,
    },
    {
      title: "Promotions",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Projet Annuel",
      url: "#",
      icon: FolderOpenDot,
    },
    {
      name: "JEE",
      url: "#",
      icon: FolderOpenDot,
    },
    {
      name: "Design Patterns",
      url: "#",
      icon: FolderOpenDot,
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
