import DashboardLayout from "@/layout/dashboard.layout";
import FlexibleCard from "@/components/template/FlexibleCard";
import { APP_NAME } from "@/config";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default function HomeDashboardPage() {

  const words = [
    APP_NAME,
    " ",
  ];

  return (
    <DashboardLayout>
      <FlexibleCard title="" className="w-full h-full">
        <div className="flex flex-col justify-center items-center mb-4 w-full h-full">
          <h1 className="text-2xl font-bold">Bienvenue sur</h1>
            <TextGenerateEffect words={words.join("")} />
        </div>
      </FlexibleCard>
    </DashboardLayout>
  );
}
