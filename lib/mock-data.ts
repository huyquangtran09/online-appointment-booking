import type { Agency, Appointment, User } from "./types"

// Mock agencies data
export const mockAgencies: Agency[] = [
  {
    id: "agency-1",
    name: "UBND Quận 1",
    address: "47 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM",
    phone: "028 3829 5389",
    email: "ubndq1@tphcm.gov.vn",
    description: "Ủy ban nhân dân Quận 1 - Thành phố Hồ Chí Minh",
    services: ["Đăng ký hộ khẩu", "Cấp CMND/CCCD", "Đăng ký kinh doanh", "Xác nhận tạm trú"],
    workingHours: { start: "07:30", end: "17:00" },
    workingDays: [1, 2, 3, 4, 5],
  },
  {
    id: "agency-2",
    name: "Sở Tư pháp TP.HCM",
    address: "141-143 Pasteur, Quận 3, TP.HCM",
    phone: "028 3829 7052",
    email: "sotuphap@tphcm.gov.vn",
    description: "Sở Tư pháp Thành phố Hồ Chí Minh",
    services: ["Công chứng", "Hợp pháp hóa lãnh sự", "Đăng ký kết hôn", "Cấp phiếu lý lịch tư pháp"],
    workingHours: { start: "07:30", end: "16:30" },
    workingDays: [1, 2, 3, 4, 5],
  },
  {
    id: "agency-3",
    name: "Sở Kế hoạch và Đầu tư",
    address: "32 Lê Thánh Tôn, Quận 1, TP.HCM",
    phone: "028 3829 6264",
    email: "skhdt@tphcm.gov.vn",
    description: "Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh",
    services: ["Đăng ký doanh nghiệp", "Cấp giấy phép đầu tư", "Tư vấn đầu tư", "Thay đổi đăng ký kinh doanh"],
    workingHours: { start: "08:00", end: "17:00" },
    workingDays: [1, 2, 3, 4, 5],
  },
  {
    id: "agency-4",
    name: "UBND Quận 3",
    address: "86 Lê Văn Sỹ, Phường 11, Quận 3, TP.HCM",
    phone: "028 3932 0666",
    email: "ubndq3@tphcm.gov.vn",
    description: "Ủy ban nhân dân Quận 3 - Thành phố Hồ Chí Minh",
    services: ["Đăng ký hộ khẩu", "Cấp CMND/CCCD", "Xác nhận tạm trú", "Chứng thực bản sao"],
    workingHours: { start: "07:30", end: "17:00" },
    workingDays: [1, 2, 3, 4, 5],
  },
  {
    id: "agency-5",
    name: "Sở Lao động - Thương binh và Xã hội",
    address: "159 Pasteur, Quận 3, TP.HCM",
    phone: "028 3829 7799",
    email: "sldtbxh@tphcm.gov.vn",
    description: "Sở Lao động - Thương binh và Xã hội TP.HCM",
    services: ["Bảo hiểm thất nghiệp", "Giải quyết chế độ", "Cấp giấy phép lao động", "Tư vấn việc làm"],
    workingHours: { start: "07:30", end: "16:30" },
    workingDays: [1, 2, 3, 4, 5],
  },
  {
    id: "agency-6",
    name: "Công an Quận 1",
    address: "123 Nguyễn Du, Quận 1, TP.HCM",
    phone: "028 3822 5577",
    email: "caq1@tphcm.gov.vn",
    description: "Công an Quận 1 - Thành phố Hồ Chí Minh",
    services: ["Cấp CCCD", "Đăng ký tạm trú", "Khai báo tạm vắng", "Xác nhận nhân thân"],
    workingHours: { start: "07:00", end: "17:00" },
    workingDays: [1, 2, 3, 4, 5, 6],
  },
]

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "nguyenvana@gmail.com",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    role: "citizen",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "user-2",
    email: "tranthib@gmail.com",
    name: "Trần Thị B",
    phone: "0912345678",
    role: "citizen",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "user-3",
    email: "levanc@gmail.com",
    name: "Lê Văn C",
    phone: "0923456789",
    role: "citizen",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "user-4",
    email: "phamthid@gmail.com",
    name: "Phạm Thị D",
    phone: "0934567890",
    role: "citizen",
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "user-5",
    email: "hoangvane@gmail.com",
    name: "Hoàng Văn E",
    phone: "0945678901",
    role: "citizen",
    createdAt: new Date("2024-05-12"),
  },
  {
    id: "admin-1",
    email: "admin@gov.vn",
    name: "Quản trị viên",
    phone: "0909999999",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]

// Mock appointments
const today = new Date()
const formatDate = (daysOffset: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split("T")[0]
}

export const mockAppointments: Appointment[] = [
  // User 1 appointments
  {
    id: "apt-1",
    citizenId: "user-1",
    citizenName: "Nguyễn Văn A",
    citizenPhone: "0901234567",
    citizenEmail: "nguyenvana@gmail.com",
    agencyId: "agency-1",
    agencyName: "UBND Quận 1",
    date: formatDate(2),
    timeSlot: "09:00",
    reason: "Đăng ký hộ khẩu thường trú",
    status: "confirmed",
    qrCode: "APT-001-2024",
    checkedIn: false,
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "apt-2",
    citizenId: "user-1",
    citizenName: "Nguyễn Văn A",
    citizenPhone: "0901234567",
    citizenEmail: "nguyenvana@gmail.com",
    agencyId: "agency-2",
    agencyName: "Sở Tư pháp TP.HCM",
    date: formatDate(5),
    timeSlot: "14:00",
    reason: "Cấp phiếu lý lịch tư pháp",
    status: "pending",
    qrCode: "APT-002-2024",
    checkedIn: false,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  // User 2 appointments
  {
    id: "apt-3",
    citizenId: "user-2",
    citizenName: "Trần Thị B",
    citizenPhone: "0912345678",
    citizenEmail: "tranthib@gmail.com",
    agencyId: "agency-3",
    agencyName: "Sở Kế hoạch và Đầu tư",
    date: formatDate(1),
    timeSlot: "10:00",
    reason: "Đăng ký doanh nghiệp mới",
    status: "confirmed",
    qrCode: "APT-003-2024",
    checkedIn: false,
    createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "apt-4",
    citizenId: "user-2",
    citizenName: "Trần Thị B",
    citizenPhone: "0912345678",
    citizenEmail: "tranthib@gmail.com",
    agencyId: "agency-1",
    agencyName: "UBND Quận 1",
    date: formatDate(-3),
    timeSlot: "08:30",
    reason: "Xác nhận tạm trú",
    status: "done",
    qrCode: "APT-004-2024",
    checkedIn: true,
    checkedInAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
  },
  // User 3 appointments
  {
    id: "apt-5",
    citizenId: "user-3",
    citizenName: "Lê Văn C",
    citizenPhone: "0923456789",
    citizenEmail: "levanc@gmail.com",
    agencyId: "agency-6",
    agencyName: "Công an Quận 1",
    date: formatDate(0),
    timeSlot: "09:30",
    reason: "Làm căn cước công dân gắn chip",
    status: "pending",
    qrCode: "APT-005-2024",
    checkedIn: false,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "apt-6",
    citizenId: "user-3",
    citizenName: "Lê Văn C",
    citizenPhone: "0923456789",
    citizenEmail: "levanc@gmail.com",
    agencyId: "agency-4",
    agencyName: "UBND Quận 3",
    date: formatDate(-5),
    timeSlot: "15:00",
    reason: "Chứng thực bản sao",
    status: "done",
    qrCode: "APT-006-2024",
    checkedIn: true,
    checkedInAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
  // User 4 appointments
  {
    id: "apt-7",
    citizenId: "user-4",
    citizenName: "Phạm Thị D",
    citizenPhone: "0934567890",
    citizenEmail: "phamthid@gmail.com",
    agencyId: "agency-5",
    agencyName: "Sở Lao động - Thương binh và Xã hội",
    date: formatDate(3),
    timeSlot: "08:00",
    reason: "Đăng ký bảo hiểm thất nghiệp",
    status: "pending",
    qrCode: "APT-007-2024",
    checkedIn: false,
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "apt-8",
    citizenId: "user-4",
    citizenName: "Phạm Thị D",
    citizenPhone: "0934567890",
    citizenEmail: "phamthid@gmail.com",
    agencyId: "agency-2",
    agencyName: "Sở Tư pháp TP.HCM",
    date: formatDate(-1),
    timeSlot: "10:30",
    reason: "Đăng ký kết hôn",
    status: "canceled",
    qrCode: "APT-008-2024",
    checkedIn: false,
    createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  // User 5 appointments
  {
    id: "apt-9",
    citizenId: "user-5",
    citizenName: "Hoàng Văn E",
    citizenPhone: "0945678901",
    citizenEmail: "hoangvane@gmail.com",
    agencyId: "agency-3",
    agencyName: "Sở Kế hoạch và Đầu tư",
    date: formatDate(4),
    timeSlot: "14:30",
    reason: "Thay đổi đăng ký kinh doanh",
    status: "confirmed",
    qrCode: "APT-009-2024",
    checkedIn: false,
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "apt-10",
    citizenId: "user-5",
    citizenName: "Hoàng Văn E",
    citizenPhone: "0945678901",
    citizenEmail: "hoangvane@gmail.com",
    agencyId: "agency-6",
    agencyName: "Công an Quận 1",
    date: formatDate(-7),
    timeSlot: "11:00",
    reason: "Xác nhận nhân thân",
    status: "done",
    qrCode: "APT-010-2024",
    checkedIn: true,
    checkedInAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
  },
  // More appointments for variety
  {
    id: "apt-11",
    citizenId: "user-2",
    citizenName: "Trần Thị B",
    citizenPhone: "0912345678",
    citizenEmail: "tranthib@gmail.com",
    agencyId: "agency-5",
    agencyName: "Sở Lao động - Thương binh và Xã hội",
    date: formatDate(7),
    timeSlot: "09:00",
    reason: "Tư vấn việc làm",
    status: "pending",
    qrCode: "APT-011-2024",
    checkedIn: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "apt-12",
    citizenId: "user-3",
    citizenName: "Lê Văn C",
    citizenPhone: "0923456789",
    citizenEmail: "levanc@gmail.com",
    agencyId: "agency-2",
    agencyName: "Sở Tư pháp TP.HCM",
    date: formatDate(-10),
    timeSlot: "13:30",
    reason: "Công chứng giấy tờ",
    status: "done",
    qrCode: "APT-012-2024",
    checkedIn: true,
    checkedInAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
  },
]

// Generate time slots for a given agency
export function generateTimeSlots(
  agency: Agency,
  date: string,
  bookedSlots: string[],
): { time: string; available: boolean }[] {
  const slots: { time: string; available: boolean }[] = []
  const [startHour] = agency.workingHours.start.split(":").map(Number)
  const [endHour] = agency.workingHours.end.split(":").map(Number)

  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`
    slots.push({
      time,
      available: !bookedSlots.includes(time),
    })

    if (hour < endHour - 1) {
      const halfTime = `${hour.toString().padStart(2, "0")}:30`
      slots.push({
        time: halfTime,
        available: !bookedSlots.includes(halfTime),
      })
    }
  }

  return slots
}

// Generate QR code string
export function generateQRCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `APT-${timestamp}-${random}`
}
