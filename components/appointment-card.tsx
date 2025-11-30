"use client"

import type { Appointment } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, QrCode, X, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { QRCodeSVG } from "qrcode.react"
import { useState } from "react"

interface AppointmentCardProps {
  appointment: Appointment
  onCancel?: (id: string) => void
  onReschedule?: (id: string) => void
  showActions?: boolean
}

const statusConfig = {
  pending: { label: "Chờ xác nhận", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
  done: { label: "Hoàn thành", variant: "default" as const, color: "bg-green-100 text-green-800" },
  canceled: { label: "Đã hủy", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
}

export function AppointmentCard({ appointment, onCancel, onReschedule, showActions = true }: AppointmentCardProps) {
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const status = statusConfig[appointment.status]
  const isPast = new Date(appointment.date) < new Date()
  const canModify = !isPast && appointment.status !== "canceled" && appointment.status !== "done"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold leading-tight">{appointment.agencyName}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{appointment.reason}</p>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(appointment.date), "dd/MM/yyyy", { locale: vi })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{appointment.timeSlot}</span>
          </div>
        </div>

        {appointment.checkedIn && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Đã check-in lúc {appointment.checkedInAt && format(new Date(appointment.checkedInAt), "HH:mm dd/MM/yyyy")}
          </div>
        )}

        {showActions && (
          <div className="flex flex-wrap gap-2 pt-2">
            {/* QR Code Dialog */}
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <QrCode className="mr-2 h-4 w-4" />
                  Xem mã QR
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Mã QR Check-in</DialogTitle>
                  <DialogDescription>Sử dụng mã QR này để check-in khi đến cơ quan</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center py-6">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <QRCodeSVG value={appointment.qrCode} size={200} level="H" includeMargin />
                  </div>
                  <p className="mt-4 font-mono text-lg font-medium">{appointment.qrCode}</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setQrDialogOpen(false)}>
                    Đóng
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {canModify && onReschedule && (
              <Button variant="outline" size="sm" onClick={() => onReschedule(appointment.id)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Đổi lịch
              </Button>
            )}

            {canModify && onCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Hủy lịch
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận hủy lịch hẹn?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Không</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onCancel(appointment.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Xác nhận hủy
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
