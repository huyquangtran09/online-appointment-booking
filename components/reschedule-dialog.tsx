"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useAppointments } from "@/contexts/appointments-context"
import { mockAgencies, generateTimeSlots } from "@/lib/mock-data"
import type { Appointment } from "@/lib/types"
import { format, addDays, getDay } from "date-fns"
import { vi } from "date-fns/locale"
import { Loader2 } from "lucide-react"

interface RescheduleDialogProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RescheduleDialog({ appointment, open, onOpenChange, onSuccess }: RescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { rescheduleAppointment, getBookedSlots } = useAppointments()

  const agency = appointment ? mockAgencies.find((a) => a.id === appointment.agencyId) : null

  const timeSlots = useMemo(() => {
    if (!agency || !selectedDate) return []
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const bookedSlots = getBookedSlots(agency.id, dateStr)
    return generateTimeSlots(agency, dateStr, bookedSlots)
  }, [agency, selectedDate, getBookedSlots])

  const isDateDisabled = (date: Date) => {
    if (!agency) return true
    const day = getDay(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date < today) return true
    if (!agency.workingDays.includes(day)) return true
    if (date > addDays(today, 30)) return true

    return false
  }

  const handleSubmit = async () => {
    if (!appointment || !selectedDate || !selectedTime) return

    setIsSubmitting(true)
    try {
      await rescheduleAppointment(appointment.id, format(selectedDate, "yyyy-MM-dd"), selectedTime)
      onSuccess()
      onOpenChange(false)
      setSelectedDate(undefined)
      setSelectedTime(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedDate(undefined)
    setSelectedTime(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Đổi lịch hẹn</DialogTitle>
          <DialogDescription>Chọn ngày và giờ mới cho lịch hẹn của bạn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date picker */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Chọn ngày mới</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                setSelectedTime(null)
              }}
              disabled={isDateDisabled}
              locale={vi}
              className="rounded-md border"
            />
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <h4 className="mb-3 text-sm font-medium">Chọn giờ - {format(selectedDate, "dd/MM/yyyy")}</h4>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedDate || !selectedTime || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xác nhận đổi lịch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
