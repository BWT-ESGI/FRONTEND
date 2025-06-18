import { useState, useEffect } from "react";
import { FolderOpenDot, Table, Users, Notebook } from "lucide-react";
import getUserInfoFromLocalStorage from "@/utils/getUserInfoFromLocalStorage";
import isStudent from "@/utils/isStudent";

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

  const baseNavData = [
    {
      name: "Projets",
      url: { isStudent: "/students/projets", isTeacher: "/projets" }[isStudent() ? "isStudent" : "isTeacher"],
      icon: FolderOpenDot,
    },
    {
      name: "Promotions",
      url: "/promotions",
      icon: Users,
    },
    // N’ajoute "Notes" que si l’utilisateur est étudiant
    ...(isStudent()
      ? [
          {
            name: "Notes",
            url: "/notes",
            icon: Notebook,
          },
        ]
      : []),
  ];

  const teacherNavData = [
    {
      name: "Utilisateurs",
      url: "/gestion-utilisateurs",
      icon: Users,
    },
    {
      name: "Grille de notation",
      url: "/grille-notation",
      icon: Table,
    }
  ];

  const navData = isStudent() ? baseNavData : [...baseNavData, ...teacherNavData];



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
        projects: navData,
      });
      setLoading(false);
  }, []);

  return { data, loading };
}
