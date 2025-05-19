import { useEffect, useState } from "react";
import { fetchDeliverablesByProject } from "@/services/deliverableService";
import { fetchSubmissionsByGroup, uploadSubmission, downloadSubmission } from "@/services/submissionService";
import { Deliverable, Submission } from "@/types/deliverable.type";
import toast from "react-hot-toast";

interface DelivrableComponentProps {
  projectId: string;
  groupId: string;
}

export default function DelivrableComponent({ projectId, groupId }: DelivrableComponentProps) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId || !groupId) return;
    setLoading(true);
    Promise.all([
      fetchDeliverablesByProject(projectId),
      fetchSubmissionsByGroup(groupId),
    ])
      .then(([dRes, sRes]) => {
        setDeliverables(Array.isArray(dRes.data) ? dRes.data : []);
        setSubmissions(Array.isArray(sRes.data) ? sRes.data : []);
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
    formData.append("archive", file);
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
