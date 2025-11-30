"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppointments } from "@/contexts/appointments-context"
import type { Appointment } from "@/lib/types"
import { CheckCircle2, Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { QRCodeSVG } from "qrcode.react"

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("id")
  const { appointments } = useAppointments()
  const [appointment, setAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    if (appointmentId) {
      const found = appointments.find((a) => a.id === appointmentId)
      if (found) {
        setAppointment(found)
      }
    }
  }, [appointmentId, appointments])

  if (!appointment) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Không tìm thấy lịch hẹn</h1>
            <Button asChild className="mt-4">
              <Link href="/agencies">Đặt lịch mới</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">Đặt lịch thành công!</h1>
            <p className="mt-2 text-muted-foreground">Thông tin xác nhận đã được gửi đến email của bạn</p>

            {/* QR Code */}
            <div className="mx-auto my-8 flex flex-col items-center">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <QRCodeSVG value={appointment.qrCode} size={180} level="H" includeMargin />
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                Mã QR: <span className="font-mono text-foreground">{appointment.qrCode}</span>
              </p>
            </div>

            {/* Appointment details */}
            <div className="rounded-lg bg-muted p-4 text-left">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{appointment.agencyName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(appointment.date), "EEEE, dd/MM/yyyy", { locale: vi })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.timeSlot}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-left text-sm">
              <p className="font-medium text-foreground">Lưu ý:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Vui lòng đến trước giờ hẹn 10-15 phút</li>
                <li>Mang theo CMND/CCCD và mã QR</li>
                <li>Check-in bằng mã QR khi đến cơ quan</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/dashboard">Xem lịch hẹn</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/agencies">
                  Đặt lịch mới
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  )
}
