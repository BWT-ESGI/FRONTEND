import { useEffect, useState } from "react";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import { fetchSubmissionsByGroup, uploadSubmission, downloadSubmission } from "@/services/submissionService";
import { fetchRulesByDeliverable } from '@/services/ruleService';
import { Deliverable, Submission } from "@/types/deliverable.type";
import toast from "react-hot-toast";
import { FileTree } from '@/components/ui/filetree';

interface DelivrableComponentProps {
  projectId: string;
  groupId: string;
}

export default function DelivrableComponent({ projectId, groupId }: DelivrableComponentProps) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(false);
  const [rulesByDeliverable, setRulesByDeliverable] = useState<Record<string, any[]>>({});

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
        // Charger les règles pour chaque livrable
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
    if (!file) return toast.error("Aucun fichier sélectionné");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); // <-- Correction ici
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

  if (!projectId || !groupId) {
    return <div className="text-center text-gray-500">Aucun groupe ou projet trouvé.</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-500">Chargement...</div>;
  }

  if (!deliverables.length) {
    return <div className="text-center text-gray-500">Aucun livrable à rendre pour ce projet.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Livrables à rendre</h2>
      {deliverables.map((d) => {
        const submission = submissions.find((s) => s.deliverableId === d.id);
        return (
          <div key={d.id} className="border rounded p-4 mb-4 flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-semibold">{d.name}</div>
                <div className="text-sm text-gray-500">{d.description}</div>
                <div className="text-xs text-gray-400">Deadline : {new Date(d.deadline).toLocaleString()}</div>
                {/* Résumé des règles */}
                {rulesByDeliverable[d.id] && rulesByDeliverable[d.id].length > 0 ? (
                  <div className="mt-2 space-y-2">
                    <div className="text-xs text-green-700 font-semibold">
                      {rulesByDeliverable[d.id].length} règle{rulesByDeliverable[d.id].length > 1 ? 's' : ''} définie{rulesByDeliverable[d.id].length > 1 ? 's' : ''}
                    </div>
                    <div className="flex flex-col gap-2">
                      {rulesByDeliverable[d.id].map((rule) => (
                        <div key={rule.id} className="rounded border-l-4 p-2 bg-green-50 border-green-400 shadow-sm">
                          {rule.type === 'FILE_EXISTS' && (
                            <div>
                              <span className="font-bold text-blue-700">Fichier requis :</span>
                              <span className="ml-2 font-mono text-blue-900">{rule.config.file}</span>
                            </div>
                          )}
                          {rule.type === 'DIR_STRUCTURE' && (
                            <div>
                              <span className="font-bold text-yellow-700">Arborescence attendue :</span>
                              <div className="ml-2 mt-1">
                                <FileTree nodes={convertPathsToFileTree(rule.config.structure)} />
                              </div>
                            </div>
                          )}
                          {rule.type === 'CONTENT_REGEX' && (
                            <div>
                              <span className="font-bold text-green-700">Fichier :</span>
                              <span className="ml-2 font-mono text-green-900">{rule.config.file}</span>
                              <br />
                              <span className="font-bold text-green-700">Doit contenir :</span>
                              <span className="ml-2 font-mono text-green-900">{rule.config.matcher?.type === 'regex' ? 'Regex' : 'Texte'} : {rule.config.matcher?.value}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-600 mb-1">Aucune règle définie.</div>
                )}
                {/* Fin résumé règles */}
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-center">
                {submission ? (
                  <>
                    <span className="text-green-600 font-medium">Déjà rendu</span>
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => handleDownload(submission.id, submission.filename)}
                    >
                      Télécharger
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(d.id, e.target.files?.[0] || null)}
                      disabled={loading}
                    />
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      onClick={() => handleUpload(d.id)}
                      disabled={loading || !selectedFiles[d.id]}
                    >
                      {loading ? "Envoi..." : "Déposer"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Fonction utilitaire pour convertir une liste de chemins en FileTreeNode[]
type FileTreeNode = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileTreeNode[];
};
function convertPathsToFileTree(paths: string[] = []): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  for (const path of paths) {
    const parts = path.split('/').filter(Boolean);
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const isLast = i === parts.length - 1;
      const isFolder = path.endsWith('/') && isLast;
      const name = parts[i];
      let node = current.find(n => n.name === name && n.type === (isLast ? (isFolder ? 'folder' : 'file') : 'folder'));
      if (!node) {
        node = {
          id: `${name}-${i}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          type: isLast ? (isFolder ? 'folder' : 'file') : 'folder',
          children: isLast && !isFolder ? undefined : [],
        };
        current.push(node);
      }
      if (node.type === 'folder' && node.children) {
        current = node.children;
      }
    }
  }
  return root;
}
