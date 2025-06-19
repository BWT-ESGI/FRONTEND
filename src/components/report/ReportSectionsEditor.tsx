import { Button } from "@/components/ui/button";
import { Section } from "@/types/sections.type";
import { useProjectContext } from "@/contexts/ProjectContext";
import { updateProject } from "@/services/projectService";
import toast from "react-hot-toast";
import { useState } from "react";

interface ReportSectionsEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export function ReportSectionsEditor({ sections, onChange }: ReportSectionsEditorProps) {
  const { project, setProject } = useProjectContext();
  const [saving, setSaving] = useState(false);

  // Ajouter une section vierge
  const addSection = () =>
  onChange([
    ...sections,
    {
      title: "",
      content: "",
      order: sections.length,
    },
  ]);

  // Mettre à jour une section existante
  const updateSection = (idx: number, key: keyof Section, value: string) => {
    onChange(sections.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  };

  // Supprimer une section
  const removeSection = (idx: number) =>
    onChange(sections.filter((_, i) => i !== idx));

  // Monter ou descendre une section
  const moveSection = (from: number, to: number) => {
    if (to < 0 || to >= sections.length) return;
    const copy = [...sections];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    onChange(copy);
  };

  const handleSaveSections = async () => {
    if (!project) return;
    setSaving(true);
    try {
      await updateProject(project.id, { sections });
      setProject({ ...project, sections });
      toast.success("Sections sauvegardées avec succès !");
    } catch (e) {
      toast.error("Erreur lors de la sauvegarde des sections");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 mt-4">
      {sections.map((section, idx) => (
        <div key={section.id ?? idx} className="bg-gray-50 border p-4 rounded relative">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Titre de la section"
              className="border rounded px-2 py-1 flex-1"
              value={section.title}
              onChange={e => updateSection(idx, "title", e.target.value)}
            />
            <button
              type="button"
              onClick={() => moveSection(idx, idx - 1)}
              disabled={idx === 0}
              title="Remonter"
              className="px-2"
            >↑</button>
            <button
              type="button"
              onClick={() => moveSection(idx, idx + 1)}
              disabled={idx === sections.length - 1}
              title="Descendre"
              className="px-2"
            >↓</button>
            <button
              type="button"
              onClick={() => removeSection(idx)}
              className="text-red-500 font-bold px-2"
              title="Supprimer"
            >×</button>
          </div>
          <textarea
            placeholder="Contenu de la section"
            className="border rounded px-2 py-1 w-full min-h-[80px]"
            value={section.content}
            onChange={e => updateSection(idx, "content", e.target.value)}
          />
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addSection}
        >
          + Ajouter une section
        </button>
        <Button onClick={handleSaveSections} className="ml-4" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}