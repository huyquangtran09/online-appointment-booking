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
    id: "admin-1",
    email: "admin@gov.vn",
    name: "Quản trị viên",
    phone: "0909999999",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: "apt-1",
    citizenId: "user-1",
    citizenName: "Nguyễn Văn A",
    citizenPhone: "0901234567",
    citizenEmail: "nguyenvana@gmail.com",
    agencyId: "agency-1",
    agencyName: "UBND Quận 1",
    date: "2024-12-20",
    timeSlot: "09:00",
    reason: "Đăng ký hộ khẩu thường trú",
    status: "confirmed",
    qrCode: "APT-001-2024",
    checkedIn: false,
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "apt-2",
    citizenId: "user-1",
    citizenName: "Nguyễn Văn A",
    citizenPhone: "0901234567",
    citizenEmail: "nguyenvana@gmail.com",
    agencyId: "agency-2",
    agencyName: "Sở Tư pháp TP.HCM",
    date: "2024-12-22",
    timeSlot: "14:00",
    reason: "Cấp phiếu lý lịch tư pháp",
    status: "pending",
    qrCode: "APT-002-2024",
    checkedIn: false,
    createdAt: new Date("2024-12-16"),
    updatedAt: new Date("2024-12-16"),
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
