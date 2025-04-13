import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/theme-provider";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from '@tiptap/extension-heading'

import {
  fetchRapportContent,
  saveRapportContent,
} from "@/services/rapportService";

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
    `btn ${active ? "text-blue-500 font-semibold" : ""}`;

  if (!editor) return null;

  return (
    <>
    <div className={`control-group border p-4 rounded ${isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}`}>
      <div className="button-group flex flex-wrap gap-2 mb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={getButtonClass(editor.isActive("bold"))}>Gras</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonClass(editor.isActive("italic"))}>Italique</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={getButtonClass(editor.isActive("underline"))}>Souligné</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={getButtonClass(editor.isActive("strike"))}>Barré</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={getButtonClass(editor.isActive("bulletList"))}>Liste</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={getButtonClass(editor.isActive("orderedList"))}>Liste num.</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={getButtonClass(editor.isActive("heading", { level: 1 }))}>Titre 1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getButtonClass(editor.isActive("heading", { level: 2 }))}>Titre 2</button>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={getButtonClass(editor.isActive({ textAlign: "left" }))}>←</button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={getButtonClass(editor.isActive({ textAlign: "center" }))}>↔</button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={getButtonClass(editor.isActive({ textAlign: "right" }))}>→</button>
      </div>
    </div>

    <form onSubmit={handleSubmit}>
        <EditorContent
          editor={editor}
          className={`min-h-[200px] border rounded p-4 ${isDark ? "bg-zinc-800 text-white" : "bg-white text-black"}`}
        />
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </form>

      {submittedContent && (
        <>
          <hr className="my-4" />
          <h4 className="font-semibold text-sm">Aperçu :</h4>
          <div className={`prose max-w-none mt-2 ${isDark ? "prose-invert" : ""}`} dangerouslySetInnerHTML={{ __html: submittedContent }} />
        </>
      )}
    </>
  );
}