"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface EmailPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  emailData: {
    to: string
    subject: string
    html: string
  } | null
}

export function EmailPreviewDialog({ open, onOpenChange, emailData }: EmailPreviewDialogProps) {
  if (!emailData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Xem trước Email (Chế độ Demo)
          </DialogTitle>
          <DialogDescription>
            Email sẽ được gửi đến <strong>{emailData.to}</strong> khi có RESEND_API_KEY
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto border rounded-lg bg-white">
          <div className="border-b bg-muted/50 px-4 py-2 text-sm">
            <p>
              <strong>To:</strong> {emailData.to}
            </p>
            <p>
              <strong>Subject:</strong> {emailData.subject}
            </p>
          </div>
          <iframe srcDoc={emailData.html} title="Email Preview" className="w-full h-[500px] border-0" />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
