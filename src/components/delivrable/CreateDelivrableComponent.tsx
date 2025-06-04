import { useState, useEffect } from "react";
import { Deliverable } from "@/types/deliverable.type";
import { fetchDeliverablesByProject, createDeliverable, updateDeliverable, deleteDeliverable } from "@/services/deliverableService";
import { useProjectContext } from "@/contexts/ProjectContext";
import toast from "react-hot-toast";
import { showApiErrorToast } from "@/utils/showApiErrorToast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FlexibleCard from "../template/FlexibleCard";
import RuleList from '../rules/RuleList';
import RuleForm from "../rules/RuleForm";
import { fetchRulesByDeliverable } from '@/services/ruleService';

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
  const [editingRulesFor, setEditingRulesFor] = useState<string | null>(null);
  const [rulesByDeliverable, setRulesByDeliverable] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (project?.id) {
      fetchDeliverablesByProject(project.id).then((res) => {
        const deliverables = Array.isArray(res.data) ? res.data : [];
        setDeliverables(deliverables);
        // Charger les règles pour chaque livrable
        deliverables.forEach((d) => {
          fetchRulesByDeliverable(d.id).then((rules) => {
            setRulesByDeliverable(prev => ({ ...prev, [d.id]: Array.isArray(rules) ? rules : [] }));
          });
        });
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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FlexibleCard
          title="Gestion des livrables"
          childrenFooter={(
            <>
              <Button type="submit" disabled={loading}>
                {editingId ? "Modifier" : "Créer"} le livrable
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={() => { setForm({ name: "", description: "", deadline: "", allowLateSubmission: false, penaltyPerHourLate: 0, submissionType: "archive", maxSize: undefined }); setEditingId(null); }}>
                  Annuler
                </Button>
              )}
            </>
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du livrable</Label>
              <Input id="name" name="name" value={form.name || ""} onChange={handleChange} placeholder="Nom du livrable" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" value={form.deadline || ""} onChange={handleChange} type="datetime-local" required />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={form.description || ""} onChange={handleChange} placeholder="Description" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id="allowLateSubmission" name="allowLateSubmission" checked={!!form.allowLateSubmission} onCheckedChange={v => handleChange({ target: { name: "allowLateSubmission", checked: v, type: "checkbox" } } as any)} />
                <Label htmlFor="allowLateSubmission">Autoriser le rendu en retard</Label>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="penaltyPerHourLate">Malus/heure</Label>
              <Input id="penaltyPerHourLate" name="penaltyPerHourLate" value={form.penaltyPerHourLate || 0} onChange={handleChange} type="number" min={0} step={0.1} placeholder="Malus/heure" />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="submissionType">Type de rendu</Label>
              <Select name="submissionType" value={form.submissionType || "archive"} onValueChange={value => handleChange({ target: { name: "submissionType", value, type: "select-one" } } as any)}>
                <SelectTrigger id="submissionType">
                  <SelectValue placeholder="Type de rendu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="archive">Archive</SelectItem>
                  <SelectItem value="git">Git</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="maxSize">Taille max (Mo)</Label>
              <Input id="maxSize" name="maxSize" value={form.maxSize || ""} onChange={handleChange} type="number" min={0} step={1} placeholder="Taille max (Mo)" />
            </div>
          </div>
        </FlexibleCard>
      </form>
      <FlexibleCard title="Livrables existants">
        <ul className="space-y-2">
          {Array.isArray(deliverables) && deliverables.map((d) => (
            <li key={d.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-muted/30">
              <div className="flex-1">
                <div className="font-bold text-lg">{d.name}</div>
                <div className="text-xs text-muted-foreground">Deadline : {new Date(d.deadline).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{d.description}</div>
                <div className="mt-2">
                  {/* Résumé des règles */}
                  {rulesByDeliverable[d.id] && rulesByDeliverable[d.id].length > 0 ? (
                    <div className="text-xs text-green-700 mb-1">
                      {rulesByDeliverable[d.id].length} règle{rulesByDeliverable[d.id].length > 1 ? 's' : ''} définie{rulesByDeliverable[d.id].length > 1 ? 's' : ''} :
                      {rulesByDeliverable[d.id].map((rule, idx) => (
                        <span key={rule.id} className="ml-2">
                          {rule.type === 'FILE_EXISTS' && 'Fichier'}
                          {rule.type === 'DIR_STRUCTURE' && 'Arborescence'}
                          {rule.type === 'CONTENT_REGEX' && 'Contenu'}
                          {idx < rulesByDeliverable[d.id].length - 1 && ','}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-red-600 mb-1">Aucune règle définie.</div>
                  )}
                  {/* Fin résumé règles */}
                  <RuleList deliverableId={d.id} />
                  {editingRulesFor === d.id ? (
                    <div className="mt-2">
                      <RuleForm deliverableId={d.id} onRuleCreated={() => setEditingRulesFor(null)} />
                      <Button size="sm" variant="secondary" className="mt-2" onClick={() => setEditingRulesFor(null)}>Fermer</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => setEditingRulesFor(d.id)}>Gérer les règles</Button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(d)}>Modifier</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(d.id)}>Supprimer</Button>
              </div>
            </li>
          ))}
        </ul>
      </FlexibleCard>
    </div>
  );
}