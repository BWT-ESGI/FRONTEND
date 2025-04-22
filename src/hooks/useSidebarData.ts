import { useState, useEffect } from "react";
import { FolderOpenDot, Users } from "lucide-react";
import getUserInfoFromLocalStorage from "@/utils/getUserInfoFromLocalStorage";

interface SidebarData {
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
  promotions: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  projects: {
    name: string;
    url: string;
    icon: React.ElementType;
  }[];
}

export function useSidebarData() {
  const [data, setData] = useState<SidebarData | null>(null);
  const [loading, setLoading] = useState(true);

  const userInfo = getUserInfoFromLocalStorage();

  useEffect(() => {
      setData({
        user: {
          firstname: userInfo?.userFirstname || "Not",
          lastname: userInfo?.userLastname || "Found",
          email: userInfo?.userEmail || "Not Found",
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
            name: "Projets",
            url: "/projets",
            icon: FolderOpenDot,
          },
          {
            name: "Promotions",
            url: "/promotions",
            icon: Users,
          },
          {
            name: "Utilisateurs",
            url: "/gestion-utilisateurs",
            icon: Users,
          },
        ],
      });
      setLoading(false);
  }, []);

  return { data, loading };
}
