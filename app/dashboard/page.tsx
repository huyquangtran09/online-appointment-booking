"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AppointmentCard } from "@/components/appointment-card"
import { RescheduleDialog } from "@/components/reschedule-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useAppointments } from "@/contexts/appointments-context"
import { useToast } from "@/hooks/use-toast"
import type { Appointment } from "@/lib/types"
import { Calendar, Plus, Clock, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { appointments, cancelAppointment, isLoading: appointmentsLoading } = useAppointments()
  const router = useRouter()
  const { toast } = useToast()

  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [authLoading, user, router])

  // Filter appointments for current user
  const userAppointments = useMemo(() => {
    if (!user) return []
    return appointments
      .filter((apt) => apt.citizenId === user.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [appointments, user])

  const upcomingAppointments = userAppointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status !== "canceled" && apt.status !== "done",
  )

  const pastAppointments = userAppointments.filter((apt) => new Date(apt.date) < new Date() || apt.status === "done")

  const canceledAppointments = userAppointments.filter((apt) => apt.status === "canceled")

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id)
      toast({
        title: "Đã hủy lịch hẹn",
        description: "Lịch hẹn của bạn đã được hủy thành công",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể hủy lịch hẹn, vui lòng thử lại",
      })
    }
  }

  const handleReschedule = (id: string) => {
    const apt = userAppointments.find((a) => a.id === id)
    if (apt) {
      setSelectedAppointment(apt)
      setRescheduleDialogOpen(true)
    }
  }

  const handleRescheduleSuccess = () => {
    toast({
      title: "Đổi lịch thành công",
      description: "Lịch hẹn của bạn đã được cập nhật",
    })
  }

  if (authLoading || appointmentsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Lịch hẹn của tôi</h1>
              <p className="mt-1 text-muted-foreground">Quản lý và theo dõi các lịch hẹn với cơ quan hành chính</p>
            </div>
            <Button asChild>
              <Link href="/agencies">
                <Plus className="mr-2 h-4 w-4" />
                Đặt lịch mới
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{upcomingAppointments.length}</p>
                  <p className="text-sm text-blue-700">Sắp tới</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{pastAppointments.length}</p>
                  <p className="text-sm text-green-700">Hoàn thành</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">{canceledAppointments.length}</p>
                  <p className="text-sm text-red-700">Đã hủy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">Sắp tới ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Đã qua ({pastAppointments.length})</TabsTrigger>
              <TabsTrigger value="canceled">Đã hủy ({canceledAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingAppointments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onCancel={handleCancel}
                      onReschedule={handleReschedule}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Chưa có lịch hẹn nào"
                  description="Bạn chưa có lịch hẹn sắp tới. Đặt lịch ngay để tiết kiệm thời gian!"
                  action={
                    <Button asChild>
                      <Link href="/agencies">Đặt lịch ngay</Link>
                    </Button>
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastAppointments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pastAppointments.map((apt) => (
                    <AppointmentCard key={apt.id} appointment={apt} showActions={false} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={CheckCircle2}
                  title="Chưa có lịch hẹn hoàn thành"
                  description="Các lịch hẹn đã hoàn thành sẽ hiển thị ở đây"
                />
              )}
            </TabsContent>

            <TabsContent value="canceled">
              {canceledAppointments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {canceledAppointments.map((apt) => (
                    <AppointmentCard key={apt.id} appointment={apt} showActions={false} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={XCircle}
                  title="Không có lịch hẹn đã hủy"
                  description="Các lịch hẹn đã hủy sẽ hiển thị ở đây"
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <RescheduleDialog
        appointment={selectedAppointment}
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
        onSuccess={handleRescheduleSuccess}
      />
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
