import { useEffect, useState } from "react";
import { Deliverable, Submission } from "@/types/deliverable.type";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import {
  fetchSubmissionsByGroup,
  uploadSubmission,
  downloadSubmission,
  deleteSubmission,
  uploadGitSubmission,
} from "@/services/submissionService";
import { fetchRulesByDeliverable } from "@/services/ruleService";
import { fetchRuleResultsBySubmission } from "@/services/ruleResultService";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Circle,
  UploadCloud,
  Info,
  X,
  Trash2,
  Github,
  Archive,
} from "lucide-react";
import FlexibleAlert from "../template/FlexibleAlert";
import JSZip from "jszip";
import FileInput from "@/components/ui/FileInput";
import { Button } from "@/components/ui/button";
import { FlexibleBadge } from "@/components/template/FlexibleBadge";

interface StudentDeliverableTimelineProps {
  projectId: string;
  groupId: string;
}

export default function StudentDeliverableTimeline({
  projectId,
  groupId,
}: StudentDeliverableTimelineProps) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File | null>
  >({});
  const [loading, setLoading] = useState(false);
  const [rulesByDeliverable, setRulesByDeliverable] = useState<
    Record<string, any[]>
  >({});
  const [gitLinks, setGitLinks] = useState<Record<string, string>>({});
  const [ruleResultsBySubmission, setRuleResultsBySubmission] = useState<
    Record<string, any[]>
  >({});

  useEffect(() => {
    if (!projectId || !groupId) return;
    setLoading(true);
    Promise.all([
      fetchDeliverablesByProject(projectId),
      fetchSubmissionsByGroup(groupId),
    ])
      .then(async ([dRes, sRes]) => {
        const deliverables = Array.isArray(dRes.data) ? dRes.data : [];
        setDeliverables(deliverables);
        const submissions = Array.isArray(sRes.data) ? sRes.data : [];
        setSubmissions(submissions);
        deliverables.forEach((d) => {
          fetchRulesByDeliverable(d.id).then((rules) => {
            setRulesByDeliverable((prev) => ({
              ...prev,
              [d.id]: Array.isArray(rules) ? rules : [],
            }));
          });
        });
        // Récupérer les RuleResults pour chaque submission
        for (const s of submissions) {
          fetchRuleResultsBySubmission(s.id).then((res) => {
            const results = Array.isArray(res.data) ? res.data : [];
            setRuleResultsBySubmission((prev) => ({
              ...prev,
              [s.id]: results,
            }));
          });
        }
      })
      .catch(() =>
        toast.error("Erreur lors du chargement des livrables ou rendus")
      )
      .finally(() => setLoading(false));
  }, [projectId, groupId]);

  const handleFileChange = (deliverableId: string, file: File | null) => {
    setSelectedFiles((prev) => ({ ...prev, [deliverableId]: file }));
  };

  // Vérifie la présence des fichiers requis dans l'archive (pour FILE_EXISTS)
  const checkRequiredFilesInArchive = async (
    file: File,
    requiredFiles: string[]
  ): Promise<string[]> => {
    try {
      const zip = await JSZip.loadAsync(file);
      const entries = Object.keys(zip.files).map((e) =>
        e.split("/").pop()?.toLowerCase()
      );
      const missing = requiredFiles.filter(
        (req) => !entries.includes(req.toLowerCase())
      );
      return missing;
    } catch {
      return requiredFiles; // Si erreur, on considère tout manquant
    }
  };

  const handleUpload = async (deliverableId: string) => {
    const file = selectedFiles[deliverableId];
    const deliverable = deliverables.find((d) => d.id === deliverableId);
    if (!file) return toast.error("Aucun fichier sélectionné");
    if (
      deliverable?.submissionType === "archive" &&
      deliverable.maxSize &&
      file.size > deliverable.maxSize * 1024 * 1024
    ) {
      return toast.error(
        `Le fichier dépasse la taille maximale autorisée (${deliverable.maxSize} Mo)`
      );
    }
    // Vérification des règles FILE_EXISTS côté front
    const rules = rulesByDeliverable[deliverableId] || [];
    const requiredFiles = rules
      .filter((r: any) => r.type === "FILE_EXISTS")
      .map((r: any) => r.config.file);
    if (requiredFiles.length > 0) {
      const missing = await checkRequiredFilesInArchive(file, requiredFiles);
      if (missing.length > 0) {
        if (
          !window.confirm(
            `Attention : le fichier requis suivant est manquant dans l'archive : ${missing.join(
              ", "
            )}. Voulez-vous quand même déposer ?`
          )
        ) {
          return;
        }
      }
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("deliverableId", deliverableId);
    formData.append("groupId", groupId);
    try {
      await uploadSubmission(formData);
      toast.success("Livrable déposé avec succès");
      fetchSubmissionsByGroup(groupId).then((res) => {
        const subs = Array.isArray(res.data) ? res.data : [];
        setSubmissions(subs);
        // Récupérer les RuleResults pour la nouvelle soumission
        const newSubmission = subs.find(
          (s) => s.deliverableId === deliverableId
        );
        if (newSubmission) refreshRuleResults(newSubmission.id);
      });
      setSelectedFiles((prev) => ({ ...prev, [deliverableId]: null }));
    } catch (e: any) {
      toast.error("Erreur lors de l'upload du livrable");
    } finally {
      setLoading(false);
    }
  };

  const handleGitLinkChange = (deliverableId: string, value: string) => {
    setGitLinks((prev) => ({ ...prev, [deliverableId]: value }));
  };

  const handleGitUpload = async (deliverableId: string) => {
    const gitRepoUrl = gitLinks[deliverableId];
    if (!gitRepoUrl)
      return toast.error("Veuillez renseigner le lien du dépôt GitHub public");
    // Validation simple du lien GitHub public
    if (!/^https:\/\/(www\.)?github\.com\/.+\/.+/.test(gitRepoUrl)) {
      return toast.error("Le lien doit être une URL GitHub publique valide");
    }
    setLoading(true);
    try {
      await uploadGitSubmission({ deliverableId, groupId, gitRepoUrl });
      toast.success("Lien GitHub déposé avec succès");
      fetchSubmissionsByGroup(groupId).then((res) => {
        const subs = Array.isArray(res.data) ? res.data : [];
        setSubmissions(subs);
        // Récupérer les RuleResults pour la nouvelle soumission
        const newSubmission = subs.find(
          (s) => s.deliverableId === deliverableId
        );
        if (newSubmission) refreshRuleResults(newSubmission.id);
      });
      setGitLinks((prev) => ({ ...prev, [deliverableId]: "" }));
    } catch (e: any) {
      const errorMsg =
        e?.response?.data?.message ||
        e?.message ||
        "Erreur lors de l'envoi du lien GitHub";
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(" ") : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (submissionId: string, filename?: string) => {
    try {
      const res = await downloadSubmission(submissionId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || "livrable.zip");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const refreshRuleResults = async (submissionId: string) => {
    const res = await fetchRuleResultsBySubmission(submissionId);
    const results = Array.isArray(res.data) ? res.data : [];
    setRuleResultsBySubmission((prev) => ({
      ...prev,
      [submissionId]: results,
    }));
  };

  if (loading)
    return <div className="text-center text-gray-500">Chargement...</div>;
  if (!deliverables.length)
    return (
      <FlexibleAlert
        title="Aucun livrable à rendre pour ce projet."
        icon={<Info className="!text-blue-500 text-center" />}
        variant="info"
      />
    );

  // Tri par deadline
  const sortedDeliverables = [...deliverables].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <div className="w-full flex flex-col items-center p-4">
      <ol className="relative border-l-2 border-gray-200 dark:border-neutral-700 w-full max-w-none">
        {sortedDeliverables.map((d) => {
          const submission = submissions.find((s) => s.deliverableId === d.id);
          const isDone = !!submission;
          const isLate =
            submission &&
            new Date(submission.submittedAt) > new Date(d.deadline);
          const selectedFile = selectedFiles[d.id];
          let conformityBadge = null;
          if (submission && ruleResultsBySubmission[submission.id]) {
            const results = ruleResultsBySubmission[submission.id];
            if (results.length > 0) {
              const allPassed = results.every((r: any) => r.passed);
              conformityBadge = allPassed ? (
                <FlexibleBadge status="active" label="Conforme" noDot />
              ) : (
                <FlexibleBadge status="inactive" label="Non conforme" noDot />
              );
            }
          }
          return (
            <li
              key={d.id}
              className="mb-14 pl-8 flex flex-col gap-2 relative w-full"
            >
              {/* Timeline point + titre/infos */}
              <div
                className="flex items-center gap-3 w-full"
                style={{ position: "relative" }}
              >
                <span className="absolute left-[-45px] top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-white dark:ring-neutral-900 bg-white dark:bg-neutral-800 z-10 border-2 border-gray-200 dark:border-neutral-700">
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </span>
                <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                  <span className="font-bold text-lg md:text-xl text-primary-700 flex items-center gap-2">
                    {/* Icône selon le type de rendu */}
                    {d.submissionType === "git" ? (
                      <span title="Rendu GitHub">
                        <Github className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      </span>
                    ) : (
                      <span title="Rendu archive">
                        <Archive className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      {d.name}
                      <span className="pt-1 text-xs text-red-600 font-semibold flex items-center">
                        {new Date(d.deadline).toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              {/* Carte de rendu */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-sm p-6 mt-4 w-full">
                <div className="flex-1 min-w-0">
                  {/* Description en priorité, italique */}
                  {d.description && (
                    <div className="italic text-base md:text-lg text-gray-800 dark:text-gray-100 mb-4 font-medium">
                      {d.description}
                    </div>
                  )}
                  {/* Règles de rendu */}
                  <div className="mb-4 p-3 rounded bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800">
                    <span className="font-semibold text-base block mb-1">
                      Règles à respecter :
                    </span>
                    <ul className="list-disc ml-5 mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {rulesByDeliverable[d.id] &&
                      rulesByDeliverable[d.id].length > 0 ? (
                        rulesByDeliverable[d.id].map((rule: any) => (
                          <li key={rule.id} className="mb-1">
                            <span className="font-bold">
                              {rule.type === "FILE_EXISTS"
                                ? "Fichier requis"
                                : rule.type === "DIR_STRUCTURE"
                                ? "Structure"
                                : "Contenu"}{" "}
                              :
                            </span>{" "}
                            {rule.type === "FILE_EXISTS"
                              ? rule.config.file
                              : rule.type === "DIR_STRUCTURE"
                              ? (rule.config.structure || []).join(", ")
                              : rule.type === "CONTENT_REGEX"
                              ? `${rule.config.file} doit contenir ${
                                  rule.config.matcher?.type === "regex"
                                    ? "Regex"
                                    : "Texte"
                                } : ${rule.config.matcher?.value}`
                              : ""}
                          </li>
                        ))
                      ) : (
                        <li>Aucune règle définie.</li>
                      )}
                    </ul>
                  </div>
                  {/* Infos techniques en bas, séparées */}
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-neutral-700 text-xs md:text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
                    <div className="flex flex-wrap gap-2">
                      <FlexibleBadge
                        status={
                          d.submissionType === "git" ? "custom" : "manual"
                        }
                        label={
                          d.submissionType === "git" ? "Dépôt Git" : "Archive"
                        }
                        noDot
                      />
                      {d.submissionType === "archive" && d.maxSize && (
                        <FlexibleBadge
                          status="custom"
                          label={`Taille max : ${d.maxSize} Mo`}
                          noDot
                        />
                      )}
                      <FlexibleBadge
                        status={d.allowLateSubmission ? "active" : "inactive"}
                        label={
                          d.allowLateSubmission
                            ? "Retard autorisé"
                            : "Retard interdit"
                        }
                        noDot
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end min-w-[220px] w-full md:w-auto">
                  {isDone ? (
                    <>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                                                ${
                                                  isLate
                                                    ? "bg-orange-100 text-orange-700 border border-orange-300"
                                                    : "bg-green-100 text-green-700 border border-green-300"
                                                }
                                            `}
                      >
                        {isLate ? (
                          <>
                            <X className="w-4 h-4 text-orange-500" /> Rendu en
                            retard
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                            Déjà rendu
                          </>
                        )}
                      </span>
                        {conformityBadge}
                      <div className="flex gap-2 items-center">
                        {d.submissionType === "git" ? (
                          <Button
                            asChild
                            variant="default"
                            className="px-3 py-1 font-semibold flex items-center gap-1 shadow-md transition-all"
                          >
                            <a
                              href={submission?.gitRepoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Voir le dépôt
                            </a>
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            className="px-3 py-1"
                            onClick={() =>
                              handleDownload(submission.id, submission.filename)
                            }
                          >
                            Télécharger
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          className="flex items-center gap-1"
                          onClick={async () => {
                            if (!window.confirm("Supprimer ce rendu ?")) return;
                            setLoading(true);
                            try {
                              await deleteSubmission(submission.id);
                              toast.success("Rendu supprimé");
                              fetchSubmissionsByGroup(groupId).then((res) =>
                                setSubmissions(
                                  Array.isArray(res.data) ? res.data : []
                                )
                              );
                            } catch {
                              toast.error("Erreur lors de la suppression");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={loading}
                          title="Supprimer le rendu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      {d.submissionType === "git" ? (
                        <>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-sm"
                            placeholder="Lien du dépôt GitHub public"
                            value={gitLinks[d.id] || ""}
                            onChange={(e) =>
                              handleGitLinkChange(d.id, e.target.value)
                            }
                            disabled={loading}
                          />
                          <Button
                            className="flex items-center justify-center gap-1"
                            onClick={() => handleGitUpload(d.id)}
                            disabled={loading || !gitLinks[d.id]}
                          >
                            <UploadCloud className="inline w-4 h-4 mr-1" />{" "}
                            Déposer le lien
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-2 items-center w-full">
                            <FileInput
                              label="Choisir un fichier"
                              accept={{
                                "application/zip": [".zip"],
                                "application/x-rar-compressed": [".rar"],
                                "application/x-7z-compressed": [".7z"],
                                "application/x-tar": [".tar"],
                                "application/x-gzip": [".gz"],
                              }}
                              maxFiles={1}
                              onChange={(files) =>
                                handleFileChange(d.id, files[0]?.file || null)
                              }
                            />
                          </div>
                          <Button
                            className="px-3 py-1 flex items-center justify-center gap-1"
                            onClick={() => handleUpload(d.id)}
                            disabled={loading || !selectedFile}
                          >
                            <UploadCloud className="inline w-4 h-4 mr-1" />{" "}
                            Déposer
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
