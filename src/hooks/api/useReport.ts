import { useState, useEffect, useCallback } from "react";
import { Report } from "@/types/report.type";
import { fetchRapports } from "@/services/rapportService";

export function useReport(groupId: string) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      await fetchRapports(groupId).then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setReport(data[0]);
        } else {
          setReport(null);
        }
      }
    );
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchReport();
    }
  }, [groupId, fetchReport]);

  return {
    report,
    loading,
    reload: fetchReport,
    setReport,
  } as const;
}
