"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useAppointments } from "@/contexts/appointments-context"
import { useToast } from "@/hooks/use-toast"
import type { AppointmentStatus } from "@/lib/types"
import { Calendar, Clock, CheckCircle2, XCircle, Search, MoreHorizontal, BarChart3, RefreshCw } from "lucide-react"
import { format } from "date-fns"

const statusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  done: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
  canceled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const {
    appointments,
    updateAppointmentStatus,
    getStatistics,
    isLoading: appointmentsLoading,
    resetToMockData,
  } = useAppointments()
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [authLoading, user, router])

  const stats = getStatistics()

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        const matchesSearch =
          searchQuery === "" ||
          apt.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.citizenPhone.includes(searchQuery) ||
          apt.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.qrCode.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || apt.status === statusFilter

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const aptDate = new Date(apt.date)
        aptDate.setHours(0, 0, 0, 0)

        let matchesDate = true
        if (dateFilter === "today") {
          matchesDate = aptDate.getTime() === today.getTime()
        } else if (dateFilter === "upcoming") {
          matchesDate = aptDate >= today
        } else if (dateFilter === "past") {
          matchesDate = aptDate < today
        }

        return matchesSearch && matchesStatus && matchesDate
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [appointments, searchQuery, statusFilter, dateFilter])

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus)
      toast({
        title: "Cập nhật thành công",
        description: `Trạng thái lịch hẹn đã được cập nhật thành "${statusConfig[newStatus].label}"`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
      })
    }
  }

  const handleResetData = () => {
    resetToMockData()
    toast({
      title: "Đã reset dữ liệu",
      description: "Dữ liệu demo đã được tải lại với 12 lịch hẹn từ 5 người dùng khác nhau",
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

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Bảng điều khiển quản trị</h1>
              <p className="mt-1 text-muted-foreground">Quản lý và theo dõi tất cả lịch hẹn trong hệ thống</p>
            </div>
            <Button variant="outline" onClick={handleResetData} className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Reset dữ liệu Demo
            </Button>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Tổng lịch hẹn</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.confirmed}</p>
                    <p className="text-sm text-muted-foreground">Đã xác nhận</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.done}</p>
                    <p className="text-sm text-muted-foreground">Hoàn thành</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.canceled}</p>
                    <p className="text-sm text-muted-foreground">Đã hủy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, SĐT, mã QR..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="done">Hoàn thành</SelectItem>
                    <SelectItem value="canceled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="upcoming">Sắp tới</SelectItem>
                    <SelectItem value="past">Đã qua</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách lịch hẹn</CardTitle>
              <CardDescription>Hiển thị {filteredAppointments.length} lịch hẹn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã QR</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Cơ quan</TableHead>
                      <TableHead>Ngày hẹn</TableHead>
                      <TableHead>Giờ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-mono text-sm">{apt.qrCode}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{apt.citizenName}</p>
                              <p className="text-sm text-muted-foreground">{apt.citizenPhone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{apt.agencyName}</TableCell>
                          <TableCell>{format(new Date(apt.date), "dd/MM/yyyy")}</TableCell>
                          <TableCell>{apt.timeSlot}</TableCell>
                          <TableCell>
                            <Badge className={statusConfig[apt.status].color}>{statusConfig[apt.status].label}</Badge>
                          </TableCell>
                          <TableCell>
                            {apt.checkedIn ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Đã check-in
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(apt.id, "pending")}
                                  disabled={apt.status === "pending"}
                                >
                                  Đánh dấu Chờ xác nhận
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(apt.id, "confirmed")}
                                  disabled={apt.status === "confirmed"}
                                >
                                  Đánh dấu Đã xác nhận
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(apt.id, "done")}
                                  disabled={apt.status === "done"}
                                >
                                  Đánh dấu Hoàn thành
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(apt.id, "canceled")}
                                  disabled={apt.status === "canceled"}
                                  className="text-destructive"
                                >
                                  Đánh dấu Đã hủy
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Calendar className="h-8 w-8 mb-2" />
                            <p>Không tìm thấy lịch hẹn nào</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
