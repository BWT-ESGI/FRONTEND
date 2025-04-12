import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectDashboardTabs = ({ activeTab, setActiveTab }: any) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList>
        <TabsTrigger value="overview">Résumé</TabsTrigger>
        <TabsTrigger value="groups">Groupes</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProjectDashboardTabs;
}