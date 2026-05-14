"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Download, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/hooks/useAppStore";
import { asBlob } from "html-docx-js-typescript";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-t-xl sticky top-0 z-10">
      <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
        <Button
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0 font-bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0 italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('strike') ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0 line-through"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export function DocumentEditor() {
  const [saveStatus, setSaveStatus] = useState("Saved locally");
  const [isExporting, setIsExporting] = useState(false);

  // Initialize editor with extensions
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: `
      <h2>Welcome to your new document!</h2>
      <p>This is a rich text editor built for high performance and clean styling.</p>
      <ul>
        <li>Auto-saves locally to your browser</li>
        <li>Exports cleanly to DOCX and PDF</li>
        <li>Fully responsive and dark-mode compatible</li>
      </ul>
      <p>Start typing to see the auto-save in action...</p>
    `,
    editorProps: {
      attributes: {
        className: 'prose prose-sm sm:prose-base dark:prose-invert prose-violet mx-auto focus:outline-none min-h-[500px] bg-white dark:bg-slate-950 p-8 md:p-12 rounded-b-xl shadow-inner max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus("Saving...");
      // Mock autosave logic
      const timer = setTimeout(() => {
        localStorage.setItem('aayudocs_draft', editor.getHTML());
        setSaveStatus("Saved locally");
      }, 1500);
      return () => clearTimeout(timer);
    },
  });

  // Load drafted content on mount
  useEffect(() => {
    if (editor) {
      const savedContent = localStorage.getItem('aayudocs_draft');
      if (savedContent) {
        editor.commands.setContent(savedContent);
      }
    }
  }, [editor]);

  const handleExportDocx = async () => {
    if (!editor) return;
    setIsExporting(true);
    try {
      const html = editor.getHTML();
      // Generate clean HTML structure for html-docx-js
      const docHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>AayuDocs Export</title>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;
      
      const blob = await asBlob(docHtml);
      const url = URL.createObjectURL(blob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Document.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export DOCX failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!editor) return;
    setIsExporting(true);
    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.createElement('div');
      element.innerHTML = editor.getHTML();
      // Apply base styling for PDF output
      element.style.padding = '40px';
      element.style.fontFamily = 'Helvetica, Arial, sans-serif';
      element.style.fontSize = '14px';
      element.style.lineHeight = '1.6';
      element.style.color = '#000000';
      
      // We append it temporarily off-screen so html2pdf can parse it better
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      document.body.appendChild(element);

      const opt = {
        margin:       10,
        filename:     'Document.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt as any).from(element).save();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Export PDF failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-4">
      {/* Editor Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
          <span className={`inline-block h-2 w-2 rounded-full ${saveStatus === "Saving..." ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></span>
          <span>{saveStatus}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="bg-white dark:bg-slate-800"
            onClick={handleExportDocx}
            disabled={isExporting}
          >
            <FileText className="mr-2 h-4 w-4 text-blue-600" />
            Export DOCX
          </Button>
          <Button 
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="flex-1" />
      </div>
    </div>
  );
}
