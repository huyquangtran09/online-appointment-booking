"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Appointment, AppointmentStatus, Statistics } from "@/lib/types"
import { mockAppointments, generateQRCode } from "@/lib/mock-data"

interface CreateAppointmentData {
  citizenId: string
  citizenName: string
  citizenPhone: string
  citizenEmail: string
  agencyId: string
  agencyName: string
  date: string
  timeSlot: string
  reason: string
}

interface AppointmentsContextType {
  appointments: Appointment[]
  isLoading: boolean
  createAppointment: (data: CreateAppointmentData) => Promise<Appointment>
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>
  cancelAppointment: (id: string) => Promise<void>
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => Promise<void>
  checkIn: (qrCode: string) => Promise<{ success: boolean; appointment?: Appointment; error?: string }>
  getAppointmentsByUser: (userId: string) => Appointment[]
  getAppointmentsByAgency: (agencyId: string) => Appointment[]
  getStatistics: () => Statistics
  getBookedSlots: (agencyId: string, date: string) => string[]
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load appointments from localStorage or use mock data
    const stored = localStorage.getItem("appointments")
    if (stored) {
      setAppointments(JSON.parse(stored))
    } else {
      setAppointments(mockAppointments)
      localStorage.setItem("appointments", JSON.stringify(mockAppointments))
    }
    setIsLoading(false)
  }, [])

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments)
    localStorage.setItem("appointments", JSON.stringify(newAppointments))
  }

  const createAppointment = async (data: CreateAppointmentData): Promise<Appointment> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      ...data,
      status: "pending",
      qrCode: generateQRCode(),
      checkedIn: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updated = [...appointments, newAppointment]
    saveAppointments(updated)

    // Mock email notification
    console.log(`[MOCK EMAIL] Xác nhận lịch hẹn gửi đến: ${data.citizenEmail}`)

    return newAppointment
  }

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const updated = appointments.map((apt) => (apt.id === id ? { ...apt, status, updatedAt: new Date() } : apt))
    saveAppointments(updated)
  }

  const cancelAppointment = async (id: string): Promise<void> => {
    await updateAppointmentStatus(id, "canceled")
  }

  const rescheduleAppointment = async (id: string, newDate: string, newTimeSlot: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const updated = appointments.map((apt) =>
      apt.id === id
        ? {
            ...apt,
            date: newDate,
            timeSlot: newTimeSlot,
            status: "pending" as AppointmentStatus,
            updatedAt: new Date(),
          }
        : apt,
    )
    saveAppointments(updated)
  }

  const checkIn = async (qrCode: string): Promise<{ success: boolean; appointment?: Appointment; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const appointment = appointments.find((apt) => apt.qrCode === qrCode)

    if (!appointment) {
      return { success: false, error: "Không tìm thấy lịch hẹn" }
    }

    if (appointment.checkedIn) {
      return { success: false, error: "Lịch hẹn đã được check-in trước đó" }
    }

    if (appointment.status === "canceled") {
      return { success: false, error: "Lịch hẹn đã bị hủy" }
    }

    const updated = appointments.map((apt) =>
      apt.id === appointment.id
        ? { ...apt, checkedIn: true, checkedInAt: new Date(), status: "confirmed" as AppointmentStatus }
        : apt,
    )
    saveAppointments(updated)

    return { success: true, appointment: { ...appointment, checkedIn: true } }
  }

  const getAppointmentsByUser = (userId: string): Appointment[] => {
    return appointments.filter((apt) => apt.citizenId === userId)
  }

  const getAppointmentsByAgency = (agencyId: string): Appointment[] => {
    return appointments.filter((apt) => apt.agencyId === agencyId)
  }

  const getBookedSlots = (agencyId: string, date: string): string[] => {
    return appointments
      .filter((apt) => apt.agencyId === agencyId && apt.date === date && apt.status !== "canceled")
      .map((apt) => apt.timeSlot)
  }

  const getStatistics = (): Statistics => {
    return {
      total: appointments.length,
      pending: appointments.filter((apt) => apt.status === "pending").length,
      confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
      done: appointments.filter((apt) => apt.status === "done").length,
      canceled: appointments.filter((apt) => apt.status === "canceled").length,
    }
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        isLoading,
        createAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        rescheduleAppointment,
        checkIn,
        getAppointmentsByUser,
        getAppointmentsByAgency,
        getStatistics,
        getBookedSlots,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentsProvider")
  }
  return context
}
