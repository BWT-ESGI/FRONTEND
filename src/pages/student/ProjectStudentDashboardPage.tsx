import DashboardLayout from "@/layout/dashboard.layout";
import { useProject } from "@/hooks/api/useProject";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import { useParams } from "react-router-dom";
import FlexibleCard from "@/components/template/FlexibleCard";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

export default function ProjectStudentDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useProject(id || "");

  const [daysLeft, setDaysLeft] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!project?.endAt) return;
    const updateDaysLeft = () => {
      const remainingDays = Math.max(
        0,
        Math.ceil(
          (new Date(project.endAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      );
      setDaysLeft(remainingDays);
    };

    updateDaysLeft();
    const interval = setInterval(updateDaysLeft, 1000);
    return () => clearInterval(interval);
  }, [project?.endAt]);

  useEffect(() => {
    if (daysLeft <= 0) return;
    setDisplayCount(0);
    const interval = setInterval(() => {
      setDisplayCount(prev => {
        if (prev + 1 >= daysLeft) {
          clearInterval(interval);
          return daysLeft;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [daysLeft]);

  if (loading) return <FallBackPageSkeleton />;

  console.log("Project", project);

  //fake defense date + hours
  const fakeDefenseDate = new Date();
  fakeDefenseDate.setDate(fakeDefenseDate.getDate() + 1);
  fakeDefenseDate.setHours(14, 0, 0, 0);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FlexibleCard
          title="Jours restants"
          childrenFooter={
            project && project.endAt && daysLeft > 0 ? (
              <div className="flex items-center">
                <p className="text-sm text-gray-500">
                  Fin le:{" "}
                  {new Date(project.endAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              </div>
            ) : (
              <p className="text-center text-sm text-red-500">
                La date limite est dépassée
              </p>
            )
          }
        >
          <div className="flex justify-center items-center h-full">
            {project && project.endAt && (
              <h1 className="text-6xl font-bold">
                {daysLeft > 0 ? (
                  displayCount
                ) : (
                  <AlertCircle className="text-red-500" size={48} />
                )}
              </h1>
            )}
          </div>
        </FlexibleCard>
        <FlexibleCard title="Soutenance">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl font-bold">
              {fakeDefenseDate.toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}{" "}
              à{" "}
              {fakeDefenseDate.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </FlexibleCard>
      </div>
    </DashboardLayout>
  );
}
