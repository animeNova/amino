"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Code,
  YoutubeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import ImageResize from 'tiptap-extension-resize-image';
import Youtube from '@tiptap/extension-youtube';
interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
  placeholder?: string
}

export default function Editor({
  onChange,
  initialContent = "",
  editable = true,
  placeholder = "Write something...",
}: EditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  // State for image dialog
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")

  // State for image dialog
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [youtubeWidth, setYoutubeWidth] = useState(300)
  const [youtubeHight, setYoutubeHight] = useState(300)

  // State for link dialog
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        progressBarColor: 'red',
        modestBranding: false,
        HTMLAttributes: {
          class: 'youtube-video mx-auto',
        },
      }),
      ImageResize.configure({
        HTMLAttributes: {
          class: 'resize-image',
          draggable: 'true',
        },
      }),
    ],
    content: initialContent,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose dark:prose-invert focus:outline-none max-w-none p-4 min-h-[200px]",
        placeholder,
      },
    },
  })

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle image insertion
  const handleImageInsert = () => {
    if (editor && imageUrl) {
      // Use the resizable image extension
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: imageAlt,
        })
        .run()

      // Reset form and close dialog
      setImageUrl("")
      setImageAlt("")
      setImageDialogOpen(false)
    }
  }

  // Handle Youtube insertion
  const handleYoutubeInsert = () => {
    if (editor && youtubeUrl) {
      // Use the resizable image extension
      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: youtubeUrl,
          height: youtubeHight,
          width:youtubeWidth
        })
        .run()

      // Reset form and close dialog
      setYoutubeUrl("")
      setYoutubeDialogOpen(false)
    }
  }

  // Handle link insertion
  const handleLinkInsert = () => {
    if (editor && linkUrl) {
      // If text is selected, turn it into a link
      if (editor.state.selection.empty && linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }

      // Reset form and close dialog
      setLinkUrl("")
      setLinkText("")
      setLinkDialogOpen(false)
    }
  }

  // Don't render on server
  if (!isMounted) {
    return <div className="h-[200px] w-full bg-muted/20" />
  }

  if (!editor) {
    return null
  }

  return (
    <>
      <div className={cn("border rounded-md overflow-hidden bg-background")}>
        {editable && (
          <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/20">
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              aria-label="Bold"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              aria-label="Italic"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("code")}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
              aria-label="Code"
            >
              <Code className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-border mx-1" />
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              aria-label="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              aria-label="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 3 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              aria-label="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-border mx-1" />
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              aria-label="Bullet List"
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              aria-label="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-border mx-1" />
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "left" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
              aria-label="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "center" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
              aria-label="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "right" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
              aria-label="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setLinkDialogOpen(true)}
              disabled={!editor.can().chain().focus().setLink({ href: "" }).run() && !editor.state.selection.empty}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setImageDialogOpen(true)}>
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setYoutubeDialogOpen(true)}>
              <YoutubeIcon className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        )}
        <ScrollArea>
        <EditorContent editor={editor} className="tiptap-editor max-h-[33rem] " />
        </ScrollArea>
 
      </div>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                placeholder="Image description"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImageInsert} disabled={!imageUrl}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Youtube Dialog */}
      <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Youtube Video</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image-url">Video URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <div>
              <Label htmlFor="image-alt">Video Width</Label>
              <Input
                id="image-alt"
                placeholder="Image description"
                value={youtubeWidth}
                type="number"
                onChange={(e) => setYoutubeWidth(Number(e.target.value))}
              />
              </div>
              <div>
              <Label htmlFor="image-alt">Video Hight</Label>
              <Input
                id="image-alt"
                placeholder="Image description"
                value={youtubeHight}
                type="number"
                onChange={(e) => setYoutubeHight(Number(e.target.value))}
              />
              </div>
          
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setYoutubeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleYoutubeInsert} disabled={!youtubeUrl}>
              Insert Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            {editor?.state.selection.empty && (
              <div className="grid gap-2">
                <Label htmlFor="link-text">Link Text</Label>
                <Input
                  id="link-text"
                  placeholder="Click here"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkInsert} disabled={!linkUrl || (editor?.state.selection.empty && !linkText)}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
