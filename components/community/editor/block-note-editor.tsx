"use client";

import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { useState } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export default function Editor({
  onChange,
  initialContent,
  editable,
}: EditorProps) {
  const initialBlocks = initialContent ? JSON.parse(initialContent) : undefined;
  const [blocks, setBlocks] = useState<PartialBlock[]>(initialBlocks);
  const editor = useCreateBlockNote({ initialContent: blocks });
  const { resolvedTheme } = useTheme();

  return (
    <BlockNoteView
      editable={editable}
      editor={editor}
      theme={{
        colors: {
          editor: {
            text: "var(--foreground)",
            background: "transparent",
          },
          menu: {
            text: "var(--foreground)",
            background: "var(--background)",
          },
          tooltip: {
            text: "var(--foreground)",
            background: "var(--background)",
          },
          hovered: {
            text: "var(--foreground)",
            background: "var(--muted)",
          },
          selected: {
            text: "var(--background)",
            background: "var(--primary)",
          },
          disabled: {
            text: "var(--muted-foreground)",
            background: "var(--muted)",
          },
        },
        borderRadius: 4,
        fontFamily: "inherit",
      }}
      className=""
      onChange={() => {
        setBlocks(editor.document);
        onChange(JSON.stringify(blocks));
      }}
    />
  );
}