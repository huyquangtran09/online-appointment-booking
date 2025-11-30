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

export const metadata: Metadata = {
  title: "Đặt lịch hẹn trực tuyến - Dịch vụ công",
  description: "Hệ thống đặt lịch hẹn trực tuyến với các cơ quan hành chính. Tiết kiệm thời gian, giảm chờ đợi.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon-light-32x32.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

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
