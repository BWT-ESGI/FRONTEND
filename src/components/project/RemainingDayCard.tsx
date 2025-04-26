import React, { useState, useEffect } from "react";
import FlexibleCard from "@/components/template/FlexibleCard";
import { AlertCircle } from "lucide-react";

interface RemainingDaysCardProps {
  endAt?: Date;
}

const RemainingDaysCard: React.FC<RemainingDaysCardProps> = ({ endAt }) => {
  const now = new Date();
  const endDate = endAt ? new Date(endAt) : new Date(0);
  const remainingDays = Math.max(
    Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );

  const [displayCount, setDisplayCount] = useState<number>(0);

  useEffect(() => {
    if (remainingDays <= 0) return;
    setDisplayCount(0);
    const interval = setInterval(() => {
      setDisplayCount((prev) => {
        if (prev < remainingDays) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 20);
    return () => clearInterval(interval);
  }, [remainingDays]);

  return (
    <FlexibleCard
      title="Jours restants"
      childrenFooter={
        !endAt ? (
          <p className="text-center text-sm text-gray-500">
            Date limite non définie
          </p>
        ) : remainingDays > 0 ? (
          <div className="flex items-center">
            <p className="text-sm text-gray-500">
              Fin le:{" "}
              {endDate.toLocaleDateString("fr-FR", {
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
        {!endAt ? (
          <AlertCircle className="text-gray-500" size={100} />
        ) :
          remainingDays > 0 ? (
          <div className="flex align-center">
            <h1 className={`text-9xl font-bold underline decoration-3 underline-offset-4 ${
              remainingDays <= 2 ? "text-red-500" : ""}`}>
              {displayCount}
            </h1>
            <p className="text-xs text-gray-500 self-end pl-4">/jours</p>
          </div>
        ) : (
          <AlertCircle className="text-red-500" size={100} />
        )}
      </div>
    </FlexibleCard>
  );
};

export default RemainingDaysCard;
