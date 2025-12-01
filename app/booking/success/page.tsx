"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppointments } from "@/contexts/appointments-context"
import { useAuth } from "@/contexts/auth-context"
import type { Appointment } from "@/lib/types"
import { CheckCircle2, Calendar, Clock, MapPin, ArrowRight, Mail, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { QRCodeSVG } from "qrcode.react"
import { EmailPreviewDialog } from "@/components/email-preview-dialog"
import { useToast } from "@/hooks/use-toast"

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("id")
  const { appointments } = useAppointments()
  const { user } = useAuth()
  const { toast } = useToast()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailPreview, setEmailPreview] = useState<{
    to: string
    subject: string
    html: string
  } | null>(null)
  const [showEmailPreview, setShowEmailPreview] = useState(false)

  useEffect(() => {
    if (appointmentId) {
      const found = appointments.find((a) => a.id === appointmentId)
      if (found) {
        setAppointment(found)
      }
    }
  }, [appointmentId, appointments])

  useEffect(() => {
    if (appointment && user && !emailSent) {
      sendConfirmationEmail()
    }
  }, [appointment, user])

  const sendConfirmationEmail = async () => {
    if (!appointment || !user || sendingEmail) return

    setSendingEmail(true)
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          appointment: {
            citizenName: appointment.citizenName,
            agencyName: appointment.agencyName,
            date: format(new Date(appointment.date), "EEEE, dd/MM/yyyy", { locale: vi }),
            timeSlot: appointment.timeSlot,
            reason: appointment.reason,
            qrCode: appointment.qrCode,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setEmailSent(true)
        if (data.mock && data.preview) {
          // Store preview for viewing
          setEmailPreview(data.preview)
          toast({
            title: "Email đã được tạo (Demo)",
            description: "Click 'Xem email' để xem nội dung email sẽ được gửi",
          })
        } else {
          toast({
            title: "Email đã được gửi",
            description: `Thông tin lịch hẹn đã được gửi đến ${user.email}`,
          })
        }
      }
    } catch (error) {
      console.error("Failed to send email:", error)
    } finally {
      setSendingEmail(false)
    }
  }

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

            <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
              {sendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang gửi email xác nhận...</span>
                </>
              ) : emailSent ? (
                <>
                  <Mail className="h-4 w-4 text-green-600" />
                  <span>Email xác nhận đã được gửi đến {user?.email}</span>
                </>
              ) : (
                <span>Thông tin xác nhận sẽ được gửi đến email của bạn</span>
              )}
            </div>

            {emailPreview && (
              <Button variant="link" size="sm" className="mt-1 text-primary" onClick={() => setShowEmailPreview(true)}>
                <Mail className="mr-1 h-4 w-4" />
                Xem email đã gửi
              </Button>
            )}

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

      <EmailPreviewDialog open={showEmailPreview} onOpenChange={setShowEmailPreview} emailData={emailPreview} />
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
