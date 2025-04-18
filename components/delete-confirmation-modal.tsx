"use client"

import { useState } from "react"
import { AlertTriangle, Loader2, Trash } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationModalProps {
  title?: string
  description?: string
  itemName?: string
  itemType?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  variant?: "default" | "destructive"
  confirmText?: string
  cancelText?: string
  isDeleting?: boolean
}

export function DeleteConfirmationModal({
  title,
  description,
  itemName,
  itemType = "item",
  open,
  onOpenChange,
  onConfirm,
  variant = "destructive",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDeleting: externalIsDeleting,
}: DeleteConfirmationModalProps) {
  const [internalIsDeleting, setInternalIsDeleting] = useState(false)
  const isDeleting = externalIsDeleting !== undefined ? externalIsDeleting : internalIsDeleting

  const defaultTitle = itemName ? `Delete ${itemName}` : `Delete ${itemType}`
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : `Are you sure you want to delete this ${itemType}? This action cannot be undone.`

  const handleConfirm = async () => {
    try {
      setInternalIsDeleting(true)
      await onConfirm()
    } finally {
      setInternalIsDeleting(false)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>{title || defaultTitle}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">{description || defaultDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{cancelText}</AlertDialogCancel>
          <Button variant={variant} onClick={handleConfirm} disabled={isDeleting} className="gap-2">
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash className="h-4 w-4" />
                <span>{confirmText}</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
