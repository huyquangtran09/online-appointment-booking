import type React from "react"
import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AppointmentsProvider } from "@/contexts/appointments-context"
import { Toaster } from "@/components/ui/toaster"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata = {
  title: "Đặt lịch hẹn trực tuyến - Dịch vụ công",
  description: "Hệ thống đặt lịch hẹn trực tuyến với các cơ quan hành chính.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} antialiased`}>
        <AuthProvider>
          <AppointmentsProvider>
            {children}
            <Toaster />
          </AppointmentsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
