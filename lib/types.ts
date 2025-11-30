// User roles
export type UserRole = "citizen" | "officer" | "admin"

// User type
export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  createdAt: Date
}

// Agency (Cơ quan hành chính)
export interface Agency {
  id: string
  name: string
  address: string
  phone: string
  email: string
  description: string
  services: string[]
  workingHours: {
    start: string
    end: string
  }
  workingDays: number[] // 0-6, 0 = Sunday
}

// Appointment status
export type AppointmentStatus = "pending" | "confirmed" | "done" | "canceled"

// Appointment
export interface Appointment {
  id: string
  citizenId: string
  citizenName: string
  citizenPhone: string
  citizenEmail: string
  agencyId: string
  agencyName: string
  date: string
  timeSlot: string
  reason: string
  status: AppointmentStatus
  qrCode: string
  checkedIn: boolean
  checkedInAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Time slot
export interface TimeSlot {
  time: string
  available: boolean
}

// Statistics
export interface Statistics {
  total: number
  pending: number
  confirmed: number
  done: number
  canceled: number
}
