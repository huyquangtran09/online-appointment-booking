"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useAppointments } from "@/contexts/appointments-context"
import { mockAgencies, generateTimeSlots } from "@/lib/mock-data"
import { ArrowLeft, ArrowRight, MapPin, Phone, Clock, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { vi } from "date-fns/locale"
import { format, addDays, getDay } from "date-fns"

type BookingStep = "date" | "time" | "info" | "confirm"

export default function BookingPage() {
  const params = useParams()
  const agencyId = params.agencyId as string
  const agency = mockAgencies.find((a) => a.id === agencyId)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { createAppointment, getBookedSlots } = useAppointments()

  const [step, setStep] = useState<BookingStep>("date")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })

  // Update form data when user logs in
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      })
    }
  }, [user])

  // Generate available time slots
  const timeSlots = useMemo(() => {
    if (!agency || !selectedDate) return []
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const bookedSlots = getBookedSlots(agency.id, dateStr)
    return generateTimeSlots(agency, dateStr, bookedSlots)
  }, [agency, selectedDate, getBookedSlots])

  // Disable non-working days
  const isDateDisabled = (date: Date) => {
    if (!agency) return true
    const day = getDay(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Past dates
    if (date < today) return true

    // Non-working days
    if (!agency.workingDays.includes(day)) return true

    // More than 30 days in future
    if (date > addDays(today, 30)) return true

    return false
  }

  const handleSubmit = async () => {
    if (!agency || !selectedDate || !selectedTime || !user) return

    setIsSubmitting(true)

    try {
      const appointment = await createAppointment({
        citizenId: user.id,
        citizenName: formData.name,
        citizenPhone: formData.phone,
        citizenEmail: formData.email,
        agencyId: agency.id,
        agencyName: agency.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: selectedTime,
        reason,
      })

      toast({
        title: "Đặt lịch thành công!",
        description: `Mã QR của bạn: ${appointment.qrCode}`,
      })

      router.push(`/booking/success?id=${appointment.id}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể đặt lịch, vui lòng thử lại",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!agency) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Không tìm thấy cơ quan</h1>
            <Button asChild className="mt-4">
              <Link href="/agencies">Quay lại danh sách</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const steps = [
    { id: "date", label: "Chọn ngày" },
    { id: "time", label: "Chọn giờ" },
    { id: "info", label: "Thông tin" },
    { id: "confirm", label: "Xác nhận" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Back button */}
          <Link
            href="/agencies"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách cơ quan
          </Link>

          {/* Agency info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{agency.name}</CardTitle>
              <CardDescription>{agency.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{agency.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{agency.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {agency.workingHours.start} - {agency.workingHours.end}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                        index < currentStepIndex
                          ? "bg-primary text-primary-foreground"
                          : index === currentStepIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentStepIndex ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                    </div>
                    <span className="mt-2 text-xs font-medium">{s.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-0.5 flex-1 ${index < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <Card>
            <CardContent className="p-6">
              {/* Date selection */}
              {step === "date" && (
                <div className="flex flex-col items-center">
                  <h2 className="mb-6 text-xl font-semibold">Chọn ngày hẹn</h2>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    locale={vi}
                    className="rounded-md border"
                  />
                  <div className="mt-6 flex gap-4">
                    <Button onClick={() => setStep("time")} disabled={!selectedDate}>
                      Tiếp tục
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Time selection */}
              {step === "time" && (
                <div>
                  <h2 className="mb-2 text-xl font-semibold">Chọn giờ hẹn</h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Ngày đã chọn: {selectedDate && format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                  </p>

                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className="h-12"
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>

                  {timeSlots.length === 0 && (
                    <p className="text-center text-muted-foreground">Không có khung giờ nào khả dụng cho ngày này</p>
                  )}

                  <div className="mt-6 flex gap-4">
                    <Button variant="outline" onClick={() => setStep("date")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại
                    </Button>
                    <Button onClick={() => setStep("info")} disabled={!selectedTime}>
                      Tiếp tục
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Info form */}
              {step === "info" && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold">Thông tin liên hệ</h2>

                  {!user && (
                    <div className="mb-6 rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">
                        <Link href="/login" className="font-medium text-primary hover:underline">
                          Đăng nhập
                        </Link>{" "}
                        để tự động điền thông tin và quản lý lịch hẹn dễ dàng hơn.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0901234567"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Lý do / Nội dung công việc *</Label>
                      <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Mô tả nội dung công việc bạn cần giải quyết..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button variant="outline" onClick={() => setStep("time")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại
                    </Button>
                    <Button
                      onClick={() => setStep("confirm")}
                      disabled={!formData.name || !formData.phone || !formData.email || !reason}
                    >
                      Tiếp tục
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirmation */}
              {step === "confirm" && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold">Xác nhận thông tin</h2>

                  <div className="space-y-6">
                    <div className="rounded-lg bg-muted p-4">
                      <h3 className="mb-3 font-medium">Thông tin lịch hẹn</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Cơ quan:</dt>
                          <dd className="font-medium">{agency.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Ngày:</dt>
                          <dd className="font-medium">
                            {selectedDate && format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Giờ:</dt>
                          <dd className="font-medium">{selectedTime}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Địa chỉ:</dt>
                          <dd className="font-medium text-right">{agency.address}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <h3 className="mb-3 font-medium">Thông tin liên hệ</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Họ tên:</dt>
                          <dd className="font-medium">{formData.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Điện thoại:</dt>
                          <dd className="font-medium">{formData.phone}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Email:</dt>
                          <dd className="font-medium">{formData.email}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <h3 className="mb-2 font-medium">Nội dung công việc</h3>
                      <p className="text-sm">{reason}</p>
                    </div>

                    {!user && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Lưu ý:</strong> Bạn chưa đăng nhập. Vui lòng{" "}
                          <Link href="/login" className="font-medium text-primary hover:underline">
                            đăng nhập
                          </Link>{" "}
                          để có thể quản lý và theo dõi lịch hẹn.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button variant="outline" onClick={() => setStep("info")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !user} className="flex-1">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Xác nhận đặt lịch
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
