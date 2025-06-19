import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import HardBreak from "@tiptap/extension-hard-break";
import {
  AlignJustify, AlignLeft, AlignRight, Baseline, Bold, Heading1, Heading2, Italic,
  List, ListOrdered, Pilcrow, Strikethrough
} from "lucide-react";
import { Button } from "../ui/button";
import FlexibleCard from "../template/FlexibleCard";
import toast from "react-hot-toast";

import {
  fetchRapportSections,
  saveRapportSections,
} from "@/services/rapportService";
import { Section } from "@/types/sections.type";

interface TextEditorProps {
  rapportId: string;
  projectSections: Section[];
  readOnly?: boolean;
}

const CustomHardBreak = HardBreak.extend({
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.chain().focus().setHardBreak().run(),
    };
  },
});

export default function TextEditor({
  rapportId,
  projectSections,
  readOnly
}: TextEditorProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState(0);

  // L'éditeur Tiptap
  const editor = useEditor({
    extensions: [
      CustomHardBreak,
      TextStyle,
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Chargement...</p>",
    autofocus: true,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class:
          "prose prose-xl prose-zinc max-w-none min-h-[400px] p-4 outline-none focus:outline-none focus-visible:outline-none" +
          " dark:prose-invert [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6",
      },
    },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const rapportSections: Section[] = await fetchRapportSections(rapportId) || [];

        // Fusionner les sections du projet et celles déjà dans le rapport (priorité au contenu déjà saisi)
        let mergedSections = projectSections.map((projSec) => {
          const found = rapportSections.find(
            (sec) =>
              (typeof sec.order !== "undefined" && sec.order === projSec.order) ||
              (sec.title && sec.title === projSec.title)
          );
          return found
            ? { ...projSec, ...found }
            : { ...projSec, content: "" }; // Ajoute section manquante
        });

        // Ajouter d'éventuelles sections personnalisées déjà saisies dans le rapport mais non dans le projet
        rapportSections.forEach(sec => {
          if (!mergedSections.find(ms => ms.order === sec.order || ms.title === sec.title)) {
            mergedSections.push(sec);
          }
        });

        // Tri par ordre pour la tradition !
        mergedSections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setSections(mergedSections);

        // Premier affichage
        if (editor && mergedSections.length) {
          editor.commands.setContent(mergedSections[0].content || "<p></p>");
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des sections du rapport.");
      }
    };
    if (rapportId && projectSections && editor) loadSections();
    // eslint-disable-next-line
  }, [rapportId, projectSections, editor]);

  // Mettre à jour l'éditeur quand on change d'onglet de section
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(sections[activeSection]?.content || "<p></p>");
    // eslint-disable-next-line
  }, [activeSection, editor]);

  // Sauvegarder le contenu courant dans le state sections
  const handleSectionContentChange = () => {
    if (!editor) return;
    setSections(sections =>
      sections.map((s, i) =>
        i === activeSection ? { ...s, content: editor.getHTML() } : s
      )
    );
  };

  // Changer de section
  const handleSectionSwitch = (idx: number) => {
    if (!editor) return;
    setSections(sections =>
      sections.map((s, i) =>
        i === activeSection ? { ...s, content: editor.getHTML() } : s
      )
    );
    setActiveSection(idx);
    setTimeout(() => {
      editor.commands.setContent(sections[idx]?.content || "<p></p>");
    }, 0);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSectionContentChange();
    try {
      await saveRapportSections(rapportId, sections);
      toast.success("Toutes les sections du rapport ont été sauvegardées !");
    } catch {
      toast.error("Erreur lors de la sauvegarde des sections.");
    }
  };

  const getButtonClass = (active: boolean) =>
    `flex items-center justify-center px-3 py-1 rounded-md transition ${
      active ? "bg-gray-100 dark:bg-gray-700 text-white-600" : "hover:bg-gray-300 dark:hover:bg-gray-700"
    }`;

  if (!editor) return null;

  if (!sections || !sections.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <span>
          Le professeur n’a pas encore activé les rapports pour ce projet.<br />
          Merci de patienter jusqu’à la publication des consignes.
        </span>
      </div>
    );
  }


  return (
    <>
      {!readOnly && (
        <FlexibleCard className="mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={getButtonClass(editor.isActive("paragraph"))}
              title="Paragraphe"
            >
              <Pilcrow className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={getButtonClass(editor.isActive("heading", { level: 1 }))}
              title="Titre 1"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={getButtonClass(editor.isActive("heading", { level: 2 }))}
              title="Titre 2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={getButtonClass(editor.isActive("bold"))}
              title="Gras"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={getButtonClass(editor.isActive("italic"))}
              title="Italique"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={getButtonClass(editor.isActive("underline"))}
              title="Souligné"
            >
              <Baseline className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={getButtonClass(editor.isActive("strike"))}
              title="Barré"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={getButtonClass(editor.isActive("bulletList"))}
              title="Liste à puces"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={getButtonClass(editor.isActive("orderedList"))}
              title="Liste numérotée"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={getButtonClass(editor.isActive({ textAlign: "left" }))}
              title="Aligner à gauche"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={getButtonClass(editor.isActive({ textAlign: "center" }))}
              title="Centrer"
            >
              <AlignJustify className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={getButtonClass(editor.isActive({ textAlign: "right" }))}
              title="Aligner à droite"
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>
        </FlexibleCard>
      )}

      <FlexibleCard className="flex flex-col">
        <div className="flex gap-2 mb-3 flex-wrap">
          {sections.map((s, i) => (
            <Button
              key={s.id ?? i}
              onClick={() => handleSectionSwitch(i)}
              variant={i === activeSection ? "default" : "outline"}
              type="button"
              className="px-3 py-1"
            >
              {s.title || `Section ${i + 1}`}
            </Button>
          ))}
        </div>
        <form onSubmit={handleSaveAll} className="flex flex-col flex-1">
          <EditorContent
            editor={editor}
            className="flex-1 p-4 min-h-[300px]"
            onBlur={handleSectionContentChange}
          />
          <Button type="submit" className="mt-4 px-6 py-2 self-start w-auto">
            Enregistrer toutes les sections
          </Button>
        </form>
      </FlexibleCard>
    </>
  );
}