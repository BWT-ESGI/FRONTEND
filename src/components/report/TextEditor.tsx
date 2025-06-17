import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import HardBreak from "@tiptap/extension-hard-break";
import { AlignJustify, AlignLeft, AlignRight, Baseline, Bold, Heading1, Heading2, Italic, List, ListOrdered, Pilcrow, Strikethrough } from "lucide-react";

import {
  fetchRapportContent,
  saveRapportContent,
} from "@/services/rapportService";
import { Button } from "../ui/button";
import FlexibleCard from "../template/FlexibleCard";
import toast from "react-hot-toast";

const CustomHardBreak = HardBreak.extend({
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.chain().focus().setHardBreak().run(),
    };
  },
});

interface TextEditorProps {
  rapportId: string;
  readOnly?: boolean;
}

export default function TextEditor({ rapportId, readOnly }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      CustomHardBreak,
      TextStyle,
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p>Chargement...</p>",
    autofocus: true,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class:
          "prose prose-xl prose-zinc max-w-none min-h-[400px] p-4 outline-none focus:outline-none focus-visible:outline-none" +
          "dark:prose-invert [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6",
      },
    },
  });

  useEffect(() => {
    if (!editor || !rapportId) return;
    const loadContent = async () => {
      try {
        const html = await fetchRapportContent(rapportId);
        editor?.commands.setContent(html || "<p></p>");
      } catch (error) {
        console.error("Erreur de chargement :", error);
        toast.error("Erreur lors du chargement du contenu.");
      }
    };

    loadContent();
  }, [rapportId, editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const html = editor?.getHTML();

    if (!html || html.trim() === "<p></p>") {
      toast.error("Le contenu ne peut pas être vide.");
      return;
    }

    try {
      await saveRapportContent(rapportId, html);
      toast.success("Contenu sauvegardé !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du contenu.");
      console.error("Erreur de sauvegarde :", error);
    }
  };

  const getButtonClass = (active: boolean) =>
    `flex items-center justify-center px-3 py-1 rounded-md transition ${
      active ? "bg-gray-100 dark:bg-gray-700 text-white-600" : "hover:bg-gray-300 dark:hover:bg-gray-700"
    }`;

  if (!editor) return null;

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
        {readOnly ? (
          <EditorContent
            editor={editor}
            className="flex-1 p-4 min-h-[500px] bg-gray-50 dark:bg-gray-900/30 rounded-md"
          />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <EditorContent
              editor={editor}
              className="flex-1 p-4 min-h-[500px]"
            />
            <Button type="submit" className="mt-4 px-6 py-2 self-start w-auto">
              Enregistrer
            </Button>
          </form>
        )}
      </FlexibleCard>
    </>
  );
}