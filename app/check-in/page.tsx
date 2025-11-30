"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppointments } from "@/contexts/appointments-context"
import type { Appointment } from "@/lib/types"
import { QrCode, Search, CheckCircle2, XCircle, Calendar, Clock, MapPin, User, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

type CheckInState = "idle" | "loading" | "success" | "error"

export default function CheckInPage() {
  const [qrCode, setQrCode] = useState("")
  const [state, setState] = useState<CheckInState>("idle")
  const [result, setResult] = useState<{ appointment?: Appointment; error?: string } | null>(null)
  const { checkIn } = useAppointments()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!qrCode.trim()) return

    setState("loading")
    setResult(null)

    try {
      const response = await checkIn(qrCode.trim().toUpperCase())
      setResult(response)
      setState(response.success ? "success" : "error")
    } catch (error) {
      setResult({ error: "Đã xảy ra lỗi, vui lòng thử lại" })
      setState("error")
    }
  }

  const handleReset = () => {
    setQrCode("")
    setState("idle")
    setResult(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Check-in form */}
          {state === "idle" || state === "loading" ? (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Check-in lịch hẹn</CardTitle>
                <CardDescription>Nhập mã QR trên phiếu hẹn để xác nhận có mặt</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="qrCode">Mã QR</Label>
                    <div className="relative">
                      <Input
                        id="qrCode"
                        placeholder="VD: APT-XXXX-XXXX"
                        value={qrCode}
                        onChange={(e) => setQrCode(e.target.value.toUpperCase())}
                        className="h-12 font-mono text-lg uppercase"
                        disabled={state === "loading"}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Mã QR được cung cấp khi bạn đặt lịch thành công</p>
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full text-base"
                    disabled={!qrCode.trim() || state === "loading"}
                  >
                    {state === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Đang kiểm tra...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Xác nhận Check-in
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 rounded-lg bg-muted p-4">
                  <h4 className="font-medium">Hướng dẫn Check-in:</h4>
                  <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                    <li>Tìm mã QR trên email xác nhận hoặc trang lịch hẹn</li>
                    <li>Nhập mã QR vào ô phía trên</li>
                    <li>Nhấn "Xác nhận Check-in" để hoàn tất</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Success state */}
          {state === "success" && result?.appointment && (
            <Card>
              <CardContent className="pt-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700">Check-in thành công!</h2>
                  <p className="mt-2 text-muted-foreground">
                    Xin chào <strong>{result.appointment.citizenName}</strong>
                  </p>
                </div>

                <div className="mt-8 rounded-lg bg-muted p-4">
                  <h3 className="mb-4 font-semibold">Thông tin lịch hẹn</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{result.appointment.agencyName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(result.appointment.date), "EEEE, dd/MM/yyyy", { locale: vi })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{result.appointment.timeSlot}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p>{result.appointment.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  <p className="font-medium">Vui lòng chờ gọi số tại quầy tiếp nhận</p>
                  <p className="mt-1 text-green-700">Cán bộ sẽ hướng dẫn bạn làm thủ tục tiếp theo</p>
                </div>

                <Button onClick={handleReset} variant="outline" className="mt-6 w-full bg-transparent">
                  Check-in lịch hẹn khác
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Error state */}
          {state === "error" && (
            <Card>
              <CardContent className="pt-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-700">Check-in thất bại</h2>
                  <p className="mt-2 text-muted-foreground">{result?.error || "Không thể xác nhận check-in"}</p>
                </div>

                <div className="mt-8 rounded-lg bg-muted p-4">
                  <h4 className="font-medium">Có thể do:</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Mã QR không đúng hoặc không tồn tại</li>
                    <li>Lịch hẹn đã được check-in trước đó</li>
                    <li>Lịch hẹn đã bị hủy</li>
                  </ul>
                </div>

                <Button onClick={handleReset} className="mt-6 w-full">
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
