import { useState, useEffect } from "react";
import { Deliverable } from "@/types/deliverable.type";
import { fetchDeliverablesByProject, createDeliverable, updateDeliverable, deleteDeliverable } from "@/services/deliverableService";
import { useProjectContext } from "@/contexts/ProjectContext";
import toast from "react-hot-toast";
import { showApiErrorToast } from "@/utils/showApiErrorToast";

export default function CreateDelivrableComponent() {
  const { project } = useProjectContext();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [form, setForm] = useState<Partial<Deliverable>>({
    name: "",
    description: "",
    deadline: "",
    allowLateSubmission: false,
    penaltyPerHourLate: 0,
    submissionType: "archive",
    maxSize: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (project?.id) {
      fetchDeliverablesByProject(project.id).then((res) => {
        setDeliverables(Array.isArray(res.data) ? res.data : []);
      });
    }
  }, [project?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    try {
      if (editingId) {
        await updateDeliverable(editingId, form);
      } else {
        // Correction : deadline doit être une string ISO, maxSize un number ou undefined
        const payload = {
          ...form,
          projectId: project.id,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
          maxSize:
            form.maxSize !== undefined && form.maxSize !== null && `${form.maxSize}` !== ""
              ? Number(form.maxSize)
              : undefined,
          penaltyPerHourLate:
            form.penaltyPerHourLate !== undefined && form.penaltyPerHourLate !== null && `${form.penaltyPerHourLate}` !== ""
              ? Number(form.penaltyPerHourLate)
              : 0,
        };
        console.log("Payload envoyé à l'API /deliverables:", payload);
        await createDeliverable(payload);
      }
      fetchDeliverablesByProject(project.id).then((res) => setDeliverables(Array.isArray(res.data) ? res.data : []));
      setForm({ name: "", description: "", deadline: "", allowLateSubmission: false, penaltyPerHourLate: 0, submissionType: "archive", maxSize: undefined });
      setEditingId(null);
      toast.success(editingId ? "Livrable modifié" : "Livrable créé");
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (d: Deliverable) => {
    setForm({ ...d });
    setEditingId(d.id);
  };

  const handleDelete = async (id: string) => {
    if (!project?.id) return;
    setLoading(true);
    try {
      await deleteDeliverable(id);
      fetchDeliverablesByProject(project.id).then((res) => setDeliverables(res.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Gestion des livrables</h2>
      <form onSubmit={handleSubmit} className="space-y-2 border rounded p-4">
        <div className="flex flex-col md:flex-row gap-2">
          <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Nom du livrable" className="border rounded px-2 py-1 flex-1" required />
          <input name="deadline" value={form.deadline || ""} onChange={handleChange} type="datetime-local" className="border rounded px-2 py-1 flex-1" required />
        </div>
        <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder="Description" className="border rounded px-2 py-1 w-full" />
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="allowLateSubmission" checked={!!form.allowLateSubmission} onChange={handleChange} /> Autoriser le rendu en retard
          </label>
          <input name="penaltyPerHourLate" value={form.penaltyPerHourLate || 0} onChange={handleChange} type="number" min={0} step={0.1} className="border rounded px-2 py-1 w-32" placeholder="Malus/heure" />
          <select name="submissionType" value={form.submissionType || "archive"} onChange={handleChange} className="border rounded px-2 py-1 w-32">
            <option value="archive">Archive</option>
            <option value="git">Git</option>
          </select>
          <input name="maxSize" value={form.maxSize || ""} onChange={handleChange} type="number" min={0} step={1} className="border rounded px-2 py-1 w-32" placeholder="Taille max (Mo)" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading}>
          {editingId ? "Modifier" : "Créer"} le livrable
        </button>
        {editingId && (
          <button type="button" className="ml-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={() => { setForm({ name: "", description: "", deadline: "", allowLateSubmission: false, penaltyPerHourLate: 0, submissionType: "archive", maxSize: undefined }); setEditingId(null); }}>
            Annuler
          </button>
        )}
      </form>
      <div>
        <h3 className="font-semibold mb-2">Livrables existants</h3>
        <ul className="space-y-2">
          {Array.isArray(deliverables) && deliverables.map((d) => (
            <li key={d.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-bold">{d.name}</div>
                <div className="text-xs text-gray-500">Deadline : {new Date(d.deadline).toLocaleString()}</div>
                <div className="text-xs text-gray-400">{d.description}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => handleEdit(d)}>Modifier</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(d.id)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}