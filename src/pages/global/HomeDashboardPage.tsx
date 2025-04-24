import DashboardLayout from "@/layout/dashboard.layout";
import FlexibleCard from "@/components/template/FlexibleCard";
import { APP_NAME } from "@/config";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import getLogo from "@/utils/getLogo";

export default function HomeDashboardPage() {

  const words = [
    APP_NAME,
    " ",
  ];

  return (
    <DashboardLayout>
      <FlexibleCard title="" className="w-full h-full">
        <div className="flex flex-col justify-center items-center mb-4 w-full h-full">
          <img
            src={getLogo().logo}
            alt="Logo"
            className="w-32 h-32 mb-4"
          />
          <h1 className="text-2xl font-bold">Bienvenue sur</h1>
            <TextGenerateEffect words={words.join("")} />
        </div>
      </FlexibleCard>
    </DashboardLayout>
  );
}
