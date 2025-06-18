import { useEffect, useState } from "react";
import { Deliverable, Submission } from "@/types/deliverable.type";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import { fetchSubmissionsByGroup, uploadSubmission, downloadSubmission, deleteSubmission, uploadGitSubmission } from "@/services/submissionService";
import { fetchRulesByDeliverable } from '@/services/ruleService';
import toast from "react-hot-toast";
import { CheckCircle, Circle, UploadCloud, Info, X, Trash2, Github, Archive } from "lucide-react";
import FlexibleAlert from "../template/FlexibleAlert";

interface StudentDeliverableTimelineProps {
    projectId: string;
    groupId: string;
}

export default function StudentDeliverableTimeline({ projectId, groupId }: StudentDeliverableTimelineProps) {
    const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
    const [loading, setLoading] = useState(false);
    const [rulesByDeliverable, setRulesByDeliverable] = useState<Record<string, any[]>>({});
    const [gitLinks, setGitLinks] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!projectId || !groupId) return;
        setLoading(true);
        Promise.all([
            fetchDeliverablesByProject(projectId),
            fetchSubmissionsByGroup(groupId),
        ])
            .then(([dRes, sRes]) => {
                const deliverables = Array.isArray(dRes.data) ? dRes.data : [];
                setDeliverables(deliverables);
                setSubmissions(Array.isArray(sRes.data) ? sRes.data : []);
                deliverables.forEach((d) => {
                    fetchRulesByDeliverable(d.id).then((rules) => {
                        setRulesByDeliverable(prev => ({ ...prev, [d.id]: Array.isArray(rules) ? rules : [] }));
                    });
                });
            })
            .catch(() => toast.error("Erreur lors du chargement des livrables ou rendus"))
            .finally(() => setLoading(false));
    }, [projectId, groupId]);

    const handleFileChange = (deliverableId: string, file: File | null) => {
        setSelectedFiles((prev) => ({ ...prev, [deliverableId]: file }));
    };

    const handleUpload = async (deliverableId: string) => {
        const file = selectedFiles[deliverableId];
        const deliverable = deliverables.find(d => d.id === deliverableId);
        if (!file) return toast.error("Aucun fichier sélectionné");
        if (deliverable?.submissionType === 'archive' && deliverable.maxSize && file.size > deliverable.maxSize * 1024 * 1024) {
            return toast.error(`Le fichier dépasse la taille maximale autorisée (${deliverable.maxSize} Mo)`);
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("deliverableId", deliverableId);
        formData.append("groupId", groupId);
        try {
            await uploadSubmission(formData);
            toast.success("Livrable déposé avec succès");
            fetchSubmissionsByGroup(groupId).then((res) => setSubmissions(Array.isArray(res.data) ? res.data : []));
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
        if (!gitRepoUrl) return toast.error("Veuillez renseigner le lien du dépôt GitHub public");
        // Validation simple du lien GitHub public
        if (!/^https:\/\/(www\.)?github\.com\/.+\/.+/.test(gitRepoUrl)) {
            return toast.error("Le lien doit être une URL GitHub publique valide");
        }
        setLoading(true);
        try {
            await uploadGitSubmission({ deliverableId, groupId, gitRepoUrl });
            toast.success("Lien GitHub déposé avec succès");
            fetchSubmissionsByGroup(groupId).then((res) => setSubmissions(Array.isArray(res.data) ? res.data : []));
            setGitLinks((prev) => ({ ...prev, [deliverableId]: "" }));
        } catch (e: any) {
            toast.error("Erreur lors de l'envoi du lien GitHub");
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

    if (loading) return <div className="text-center text-gray-500">Chargement...</div>;
    if (!deliverables.length) return <FlexibleAlert title="Aucun livrable à rendre pour ce projet." icon={<Info className="!text-blue-500 text-center" />} variant="info" />;

    // Tri par deadline
    const sortedDeliverables = [...deliverables].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return (
        <div className="w-full flex flex-col items-center">
            <ol className="relative border-l-2 border-gray-200 dark:border-neutral-700">
                {sortedDeliverables.map((d) => {
                    const submission = submissions.find((s) => s.deliverableId === d.id);
                    const isDone = !!submission;
                    const isLate = submission && new Date(submission.submittedAt) > new Date(d.deadline);
                    const selectedFile = selectedFiles[d.id];
                    return (
                        <li key={d.id} className="mb-14 pl-8 flex flex-col gap-2 relative">
                            {/* Timeline point + titre/infos */}
                            <div className="flex items-center gap-3" style={{ position: 'relative' }}>
                                <span className="absolute left-[-45px] top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-white dark:ring-neutral-900 bg-white dark:bg-neutral-800 z-10 border-2 border-gray-200 dark:border-neutral-700">
                                    {isDone ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                                </span>
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <span className="font-bold text-lg md:text-xl text-primary-700 flex items-center gap-2">
                                        {/* Icône selon le type de rendu */}
                                        {d.submissionType === 'git' ? (
                                            <Github className="w-5 h-5 text-gray-700 dark:text-gray-200" title="Rendu GitHub" />
                                        ) : (
                                            <Archive className="w-5 h-5 text-gray-700 dark:text-gray-200" title="Rendu archive" />
                                        )}
                                        {d.name}
                                    </span>
                                    <span className="text-xs text-red-500 font-semibold whitespace-nowrap md:ml-4">
                                        Deadline : {new Date(d.deadline).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            {/* Carte de rendu */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-sm p-6 mt-8">
                                <div className="flex-1 min-w-0">
                                    {/* Description en priorité, italique */}
                                    {d.description && (
                                        <div className="italic text-base md:text-lg text-gray-800 dark:text-gray-100 mb-4 font-medium">
                                            {d.description}
                                        </div>
                                    )}
                                    {/* Règles de rendu */}
                                    <div className="mb-4 p-3 rounded bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800">
                                        <span className="font-semibold text-base block mb-1">Règles à respecter :</span>
                                        <ul className="list-disc ml-5 mt-1 text-sm text-gray-700 dark:text-gray-300">
                                            {rulesByDeliverable[d.id] && rulesByDeliverable[d.id].length > 0 ? (
                                                rulesByDeliverable[d.id].map((rule: any) => (
                                                    <li key={rule.id} className="mb-1">
                                                        <span className="font-bold">{rule.type === 'FILE_EXISTS' ? 'Fichier requis' : rule.type === 'DIR_STRUCTURE' ? 'Structure' : 'Contenu'} :</span> {rule.type === 'FILE_EXISTS' ? rule.config.file : rule.type === 'DIR_STRUCTURE' ? (rule.config.structure || []).join(', ') : rule.type === 'CONTENT_REGEX' ? `${rule.config.file} doit contenir ${rule.config.matcher?.type === 'regex' ? 'Regex' : 'Texte'} : ${rule.config.matcher?.value}` : ''}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>Aucune règle définie.</li>
                                            )}
                                        </ul>
                                    </div>
                                    {/* Infos techniques en bas, séparées */}
                                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-neutral-700 text-xs md:text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
                                        <span>Type : {d.submissionType === 'git' ? 'Dépôt Git' : 'Archive'}</span>
                                        {d.submissionType === 'archive' && d.maxSize && (
                                            <span>Taille max : {d.maxSize} Mo</span>
                                        )}
                                        <span>{d.allowLateSubmission ? 'Retard autorisé' : 'Retard interdit'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end min-w-[220px]">
                                    {isDone ? (
                                        <>
                                            <span className={`text-sm font-semibold ${isLate ? 'text-orange-500' : 'text-green-600'}`}>{isLate ? 'Rendu en retard' : 'Déjà rendu'}</span>
                                            <div className="flex gap-2 items-center">
                                                <button
                                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    onClick={() => handleDownload(submission.id, submission.filename)}
                                                >
                                                    Télécharger
                                                </button>
                                                <button
                                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-red-100 flex items-center gap-1"
                                                    onClick={async () => {
                                                        if (!window.confirm('Supprimer ce rendu ?')) return;
                                                        setLoading(true);
                                                        try {
                                                            await deleteSubmission(submission.id);
                                                            toast.success('Rendu supprimé');
                                                            fetchSubmissionsByGroup(groupId).then((res) => setSubmissions(Array.isArray(res.data) ? res.data : []));
                                                        } catch {
                                                            toast.error('Erreur lors de la suppression');
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                    disabled={loading}
                                                    title="Supprimer le rendu"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-2 w-full">
                                            {d.submissionType === 'git' ? (
                                                <>
                                                    <input
                                                        type="url"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-sm"
                                                        placeholder="Lien du dépôt GitHub public"
                                                        value={gitLinks[d.id] || ""}
                                                        onChange={e => handleGitLinkChange(d.id, e.target.value)}
                                                        disabled={loading}
                                                    />
                                                    <button
                                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-1 shadow-md transition-all"
                                                        onClick={() => handleGitUpload(d.id)}
                                                        disabled={loading || !gitLinks[d.id]}
                                                    >
                                                        <UploadCloud className="inline w-4 h-4 mr-1" /> Déposer le lien
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex gap-2 items-center w-full">
                                                        <button
                                                            type="button"
                                                            className="w-full px-3 py-1 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded hover:bg-gray-200 dark:hover:bg-neutral-700 text-sm font-medium transition-colors"
                                                            onClick={() => {
                                                                const input = document.createElement('input');
                                                                input.type = 'file';
                                                                input.accept = '.zip,.rar,.7z,.tar,.gz';
                                                                input.onchange = (e: any) => handleFileChange(d.id, e.target.files?.[0] || null);
                                                                input.click();
                                                            }}
                                                            disabled={loading}
                                                        >
                                                            Choisir un fichier
                                                        </button>
                                                        {selectedFile && (
                                                            <span className="flex items-center gap-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded px-2 py-1 text-xs">
                                                                {selectedFile.name}
                                                                <button
                                                                    type="button"
                                                                    className="ml-1 text-red-500 hover:text-red-700"
                                                                    onClick={() => handleFileChange(d.id, null)}
                                                                    aria-label="Retirer le fichier"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-1 shadow-md transition-all"
                                                        onClick={() => handleUpload(d.id)}
                                                        disabled={loading || !selectedFile}
                                                    >
                                                        <UploadCloud className="inline w-4 h-4 mr-1" /> Déposer
                                                    </button>
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
