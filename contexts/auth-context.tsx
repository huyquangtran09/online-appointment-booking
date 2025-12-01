"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, UserRole } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
}

const getRegisteredUsers = (): Array<User & { password: string }> => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("registeredUsers")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

const saveRegisteredUsers = (users: Array<User & { password: string }>) => {
  localStorage.setItem("registeredUsers", JSON.stringify(users))
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (email.includes("admin")) {
      const adminUser: User = {
        id: `admin-${Date.now()}`,
        email: email,
        name: "Quản trị viên",
        phone: "",
        role: "admin" as UserRole,
        createdAt: new Date(),
      }
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
      return { success: true }
    }

    const registeredUsers = getRegisteredUsers()
    const foundUser = registeredUsers.find((u) => u.email === email)

    if (!foundUser) {
      return { success: false, error: "Email chưa được đăng ký. Vui lòng đăng ký tài khoản mới." }
    }

    if (foundUser.password !== password) {
      return { success: false, error: "Mật khẩu không đúng" }
    }

    // Remove password before storing in session
    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    return { success: true }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const registeredUsers = getRegisteredUsers()

    // Check if email exists
    const exists = registeredUsers.some((u) => u.email === data.email)
    if (exists) {
      return { success: false, error: "Email đã được sử dụng" }
    }

    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.email.includes("admin") ? "admin" : ("citizen" as UserRole),
      password: data.password,
      createdAt: new Date(),
    }

    // Save to registered users list
    registeredUsers.push(newUser)
    saveRegisteredUsers(registeredUsers)

    // Remove password before storing in session
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
