import { useState, useEffect } from "react";
import { FolderOpenDot, Users } from "lucide-react";

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

  useEffect(() => {
      setData({
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
            url: "/list-projets",
            icon: FolderOpenDot,
          },
          {
            name: "Gestion des Promotions",
            url: "/gestion-promotions",
            icon: Users,
          },
          {
            name: "Gestion des Utilisateurs",
            url: "/gestion-utilisateurs",
            icon: Users,
          },
        ],
      });
      setLoading(false);
  }, []);

  return { data, loading };
}
