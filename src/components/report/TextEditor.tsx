import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/theme-provider";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from '@tiptap/extension-heading'
import { AlignJustify, AlignLeft, AlignRight, Baseline, Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";

import {
  fetchRapportContent,
  saveRapportContent,
} from "@/services/rapportService";
import { Button } from "../ui/button";

interface TextEditorProps {
  rapportId: string;
}

export default function TextEditor({ rapportId }: TextEditorProps) {
  const { theme } = useTheme();
  const [submittedContent, setSubmittedContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2],
      }),
    ],
    content: "<p>Chargement...</p>",
    autofocus: true,
    editorProps: {
      attributes: {
        class:
          "prose prose-xl prose-zinc max-w-none min-h-[200px] p-4 border rounded " +
          "dark:prose-invert [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6"
      },
    },
  });


  useEffect(() => {
    const loadContent = async () => {
      try {
        const html = await fetchRapportContent(rapportId);
        editor?.commands.setContent(html || "<p></p>");
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };

    if (editor && rapportId) {
      loadContent();
    }
  }, [rapportId, editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const html = editor?.getHTML();

    if (!html || html.trim() === "<p></p>") {
      alert("Le contenu ne peut pas être vide.");
      return;
    }

    try {
      await saveRapportContent(rapportId, html);
      setSubmittedContent(html);
      console.log("Contenu sauvegardé !");
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    }
  };

  const isDark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const getButtonClass = (active: boolean) =>
    `flex items-center justify-center px-3 py-1 rounded-md transition ${
      active ? "bg-blue-100 dark:bg-blue-700 text-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  if (!editor) return null;

  return (
    <>
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 mb-4 gap-2 overflow-x-auto">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getButtonClass(editor.isActive("bold"))}
        title="Gras"
      >
        <Bold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={getButtonClass(editor.isActive("italic"))}
        title="Italique"
      >
        <Italic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={getButtonClass(editor.isActive("underline"))}
        title="Souligné"
      >
        <Baseline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={getButtonClass(editor.isActive("strike"))}
        title="Barré"
      >
        <Strikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getButtonClass(editor.isActive("bulletList"))}
        title="Liste à puces"
      >
        <List />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getButtonClass(editor.isActive("orderedList"))}
        title="Liste numérotée"
      >
        <ListOrdered />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={getButtonClass(editor.isActive({ textAlign: "left" }))}
        title="Aligner à gauche"
      >
        <AlignRight className="transform rotate-180" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={getButtonClass(editor.isActive({ textAlign: "center" }))}
        title="Centrer"
      >
        <AlignJustify className="transform rotate-0" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={getButtonClass(editor.isActive({ textAlign: "right" }))}
        title="Aligner à droite"
      >
        <AlignLeft className="transform rotate-0 scale-x-[-1]" />
      </button>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit}>
          <EditorContent
            editor={editor}
            className={`min-h-[250px] p-4 bg-gray-50 dark:bg-gray-900 rounded-md focus:outline-none`}
          />
          <Button type="submit" className="mt-4 px-6 py-2">
            Enregistrer
          </Button>
        </form>
    </div>

      {submittedContent && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-inner p-4">
          <hr className="my-4" />
          <h4 className="font-semibold text-sm">Aperçu :</h4>
          <div className={`prose max-w-none mt-2 ${isDark ? "prose-invert" : ""}`} dangerouslySetInnerHTML={{ __html: submittedContent }} />
        </div>
      )}
    </>
  );
}