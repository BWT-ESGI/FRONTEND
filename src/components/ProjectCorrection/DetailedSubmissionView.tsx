import { Button } from "@/components/ui/button";
import { fetchRuleResultsBySubmission } from "@/services/ruleResultService";
import { downloadSubmission } from "@/services/submissionService";
import { Archive, CheckCircle, Github, SquareArrowOutUpRight, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DetailedSubmissionView({
  submission,
  deliverable,
}: {
  submission: any;
  deliverable: any;
}) {
  const [ruleResults, setRuleResults] = useState<any[]>([]);
  useEffect(() => {
    fetchRuleResultsBySubmission(submission.id)
      .then((res) => setRuleResults(res.data || []))
      .catch((err) => {
        if (err?.response?.status === 404)
          setRuleResults([]);
        else console.error(err);
      });
  }, [submission.id]);
  return (
      <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-white/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {deliverable.submissionType === "git" ? (
              <Github className="w-5 h-5 text-gray-700" />
            ) : (
              <Archive className="w-5 h-5 text-gray-700" />
            )}
            <span className="font-semibold text-lg">{deliverable.name}</span>
            {submission.isLate && (
              <span className="text-xs text-orange-600 font-bold ml-2">
                Rendu en retard
              </span>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {deliverable.submissionType === "git" && submission.gitRepoUrl ? (
              <Button>
                <a
                  href={submission.gitRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <SquareArrowOutUpRight className="mr-2" />
                  Voir le dépôt GitHub
                </a>
              </Button>
            ) : (
              submission.archiveObjectName && (
                <Button
                  onClick={async () => {
                    const res = await downloadSubmission(submission.id);
                    const url = window.URL.createObjectURL(
                      new Blob([res.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                      "download",
                      submission.filename || "livrable.zip"
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode?.removeChild(link);
                  }}
                >
                  Télécharger l'archive
                </Button>
              )
            )}
          </div>
        </div>
        <div className="mt-2">
          <span className="font-semibold text-base">
            Résultats des règles automatiques :
          </span>
          {ruleResults.length === 0 ? (
            <div className="text-xs text-gray-500 mt-1">
              Aucune règle vérifiée ou résultat non disponible.
            </div>
          ) : (
            <ul className="mt-2 space-y-1">
              {ruleResults.map((r) => (
                <li key={r.id} className="flex items-center gap-2 text-sm">
                  {r.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={
                      r.passed ? "text-green-700" : "text-red-700 font-semibold"
                    }
                  >
                    {r.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
  );
}
