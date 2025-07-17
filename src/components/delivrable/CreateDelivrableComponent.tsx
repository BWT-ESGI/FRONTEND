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
import { getCriteriaSets, CriteriaSet } from "@/services/criteriaSetService";
import { Archive, Github } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "../ui/drawer";

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
  const [criteriaSets, setCriteriaSets] = useState<CriteriaSet[]>([]);
  const [criteriaSetId, setCriteriaSetId] = useState<string | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Pour forcer le refresh de RuleList
  const [ruleListRefreshKey, setRuleListRefreshKey] = useState(0);

  useEffect(() => {
    if (project?.id) {
      fetchDeliverablesByProject(project.id).then((res) => {
        setDeliverables(Array.isArray(res.data) ? res.data : []);
      });
    }
  }, [project?.id]);

  useEffect(() => {
    getCriteriaSets('deliverable').then(setCriteriaSets).catch(() => { });
  }, []);

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

  // Ajout d'un handler dédié pour la checkbox
  const handleAllowLateSubmissionChange = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      allowLateSubmission: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    try {
      if (editingId) {
        await updateDeliverable(editingId, { ...form, criteriaSetId });
      } else {
        const payload = {
          ...form,
          projectId: project.id,
          deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
          maxSize:
            form.submissionType === "archive" && form.maxSize !== undefined && form.maxSize !== null && `${form.maxSize}` !== ""
              ? Number(form.maxSize)
              : undefined,
          penaltyPerHourLate:
            form.penaltyPerHourLate !== undefined && form.penaltyPerHourLate !== null && `${form.penaltyPerHourLate}` !== ""
              ? Number(form.penaltyPerHourLate)
              : 0,
          criteriaSetId,
        };
        await createDeliverable(payload);
      }
      fetchDeliverablesByProject(project.id).then((res) => setDeliverables(Array.isArray(res.data) ? res.data : []));
      setForm({ name: "", description: "", deadline: "", allowLateSubmission: false, penaltyPerHourLate: 0, submissionType: "archive", maxSize: undefined });
      setEditingId(null);
      setCriteriaSetId(undefined);
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
    setCriteriaSetId(d.criteriaSetId);
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
          childrenFooter={
            <>
              <Button type="submit" disabled={loading}>
                {editingId ? "Modifier" : "Créer"} le livrable
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setForm({
                      name: "",
                      description: "",
                      deadline: "",
                      allowLateSubmission: false,
                      penaltyPerHourLate: 0,
                      submissionType: "archive",
                      maxSize: undefined,
                    });
                    setEditingId(null);
                  }}
                >
                  Annuler
                </Button>
              )}
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du livrable</Label>
              <Input
                id="name"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Nom du livrable"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                value={form.deadline || ""}
                onChange={handleChange}
                type="datetime-local"
                required
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="criteriaSetId">Grille de notation</Label>
            <select
              id="criteriaSetId"
              name="criteriaSetId"
              className="border rounded px-2 py-1 w-full"
              value={criteriaSetId || ""}
              onChange={(e) => setCriteriaSetId(e.target.value || undefined)}
            >
              <option value="">Aucune</option>
              {criteriaSets.map((cs) => (
                <option key={cs.id} value={cs.id}>
                  {cs.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="allowLateSubmission"
                  name="allowLateSubmission"
                  checked={!!form.allowLateSubmission}
                  onCheckedChange={handleAllowLateSubmissionChange}
                />
                <Label htmlFor="allowLateSubmission">
                  Autoriser le rendu en retard
                </Label>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="penaltyPerHourLate">Malus/heure</Label>
              <Input
                id="penaltyPerHourLate"
                name="penaltyPerHourLate"
                value={form.penaltyPerHourLate || 0}
                onChange={handleChange}
                type="number"
                min={0}
                step={0.1}
                placeholder="Malus/heure"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="submissionType">Type de rendu</Label>
              <Select
                name="submissionType"
                value={form.submissionType || "archive"}
                onValueChange={(value) =>
                  handleChange({
                    target: {
                      name: "submissionType",
                      value,
                      type: "select-one",
                    },
                  } as any)
                }
              >
                <SelectTrigger id="submissionType">
                  <SelectValue placeholder="Type de rendu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="archive">Archive</SelectItem>
                  <SelectItem value="git">Git</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.submissionType === "archive" && (
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="maxSize">Taille max (Mo)</Label>
                <Input
                  id="maxSize"
                  name="maxSize"
                  value={form.maxSize || ""}
                  onChange={handleChange}
                  type="number"
                  min={0}
                  step={1}
                  placeholder="Taille max (Mo)"
                />
              </div>
            )}
          </div>
        </FlexibleCard>
      </form>
      <div className="w-full">
        <ul className="grid grid-cols-2 gap-4">
          {Array.isArray(deliverables) &&
            deliverables
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.deadline).getTime() -
                  new Date(b.deadline).getTime()
              )
              .map((d) => (
                <li
                  key={d.id}
                  className="bg-card text-card-foreground border rounded-lg shadow-md p-4 flex flex-col gap-4 max-w-full w-full mx-auto min-w-[0]"
                >
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="font-bold text-lg text-primary-700 flex items-center gap-2 break-words">
                      {d.submissionType === "git" ? (
                        <Github className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      ) : (
                        <Archive className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      )}
                      <span>{d.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 break-words">
                      Deadline : {new Date(d.deadline).toLocaleString()}
                    </div>
                    {d.description && (
                      <div className="text-sm text-muted-foreground mb-1 break-words">
                        {d.description}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 w-full"
                      onClick={() => {
                        setEditingRulesFor(d.id);
                        setIsDialogOpen(true);
                      }}
                    >
                      Gérer les règles
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 min-w-[90px]"
                      onClick={() => handleEdit(d)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 min-w-[90px]"
                      onClick={() => handleDelete(d.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </li>
              ))}
        </ul>
      </div>

      {/* Drawer pour gérer les règles */}
      <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DrawerContent
          className="flex flex-col h-[90vh]"
          aria-describedby="drawer-description"
        >
          <DrawerHeader>
            <DrawerTitle>Gérer les règles</DrawerTitle>
          </DrawerHeader>
          <p id="drawer-description" className="sr-only">
            Utilisez cette interface pour gérer les règles associées au livrable. Vous pouvez consulter la liste des règles existantes et en ajouter de nouvelles.
          </p>
          {editingRulesFor && (
            <div className="flex flex-1 overflow-y-auto">
              {/* Liste des règles */}
              <div className="w-1/2 border-r p-4 overflow-y-auto pb-6">
                <h2 className="text-lg font-bold mb-4">Liste des règles</h2>
                <RuleList deliverableId={editingRulesFor} key={editingRulesFor + '-' + ruleListRefreshKey} />
              </div>

              {/* Formulaire pour ajouter des règles */}
              <div className="w-1/2 p-4">
                <h2 className="text-lg font-bold mb-4">Ajouter une règle</h2>
                <RuleForm
                  deliverableId={editingRulesFor}
                  onRuleCreated={() => {
                    setRuleListRefreshKey((k) => k + 1);
                    if (project?.id) {
                      fetchDeliverablesByProject(project.id).then((res) => {
                        setDeliverables(Array.isArray(res.data) ? res.data : []);
                      });
                    }
                  }}
                />
              </div>
            </div>
          )}
          <DrawerFooter className="mt-auto">
            <Button
              size="sm"
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => setIsDialogOpen(false)}
            >
              Fermer
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}