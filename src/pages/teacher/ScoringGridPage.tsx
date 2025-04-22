import GradingRubricForm from "@/components/project/GradingRubricForm";
import DashboardLayout from "@/layout/dashboard.layout";

export default function ScoringGridPage() {
    return (
      <DashboardLayout>
        <GradingRubricForm />
      </DashboardLayout>
    );
}