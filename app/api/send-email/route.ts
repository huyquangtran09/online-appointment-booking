import { type NextRequest, NextResponse } from "next/server"

// Email template for appointment confirmation
function generateEmailHTML(appointment: {
  citizenName: string
  agencyName: string
  date: string
  timeSlot: string
  reason: string
  qrCode: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận lịch hẹn</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Dịch vụ công trực tuyến</h1>
        <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">Xác nhận đặt lịch hẹn thành công</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px;">
        <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
          Xin chào <strong>${appointment.citizenName}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
          Lịch hẹn của bạn đã được đặt thành công. Vui lòng mang theo mã QR dưới đây khi đến cơ quan để check-in.
        </p>
        
        <!-- QR Code Section -->
        <div style="text-align: center; background-color: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
          <div style="background-color: #ffffff; display: inline-block; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appointment.qrCode)}" 
                 alt="QR Code" 
                 style="display: block; width: 150px; height: 150px;" />
          </div>
          <p style="color: #1e40af; font-size: 18px; font-weight: bold; margin: 15px 0 0 0; font-family: monospace;">
            ${appointment.qrCode}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
            Mã check-in của bạn
          </p>
        </div>
        
        <!-- Appointment Details -->
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
            Chi tiết lịch hẹn
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #6b7280; font-size: 14px; padding: 8px 0; vertical-align: top; width: 120px;">Cơ quan:</td>
              <td style="color: #1f2937; font-size: 14px; padding: 8px 0; font-weight: 500;">${appointment.agencyName}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; font-size: 14px; padding: 8px 0; vertical-align: top;">Ngày hẹn:</td>
              <td style="color: #1f2937; font-size: 14px; padding: 8px 0; font-weight: 500;">${appointment.date}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; font-size: 14px; padding: 8px 0; vertical-align: top;">Giờ hẹn:</td>
              <td style="color: #1f2937; font-size: 14px; padding: 8px 0; font-weight: 500;">${appointment.timeSlot}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; font-size: 14px; padding: 8px 0; vertical-align: top;">Lý do:</td>
              <td style="color: #1f2937; font-size: 14px; padding: 8px 0;">${appointment.reason}</td>
            </tr>
          </table>
        </div>
        
        <!-- Important Notes -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 25px; border-radius: 0 8px 8px 0;">
          <h4 style="color: #92400e; font-size: 14px; margin: 0 0 10px 0;">Lưu ý quan trọng:</h4>
          <ul style="color: #92400e; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Vui lòng đến trước giờ hẹn 10-15 phút</li>
            <li>Mang theo CMND/CCCD bản gốc</li>
            <li>Xuất trình mã QR để check-in khi đến</li>
          </ul>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          Email này được gửi tự động từ hệ thống Dịch vụ công trực tuyến.
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
          © 2025 Dịch vụ công trực tuyến. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, appointment } = body

    if (!to || !appointment) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const emailHtml = generateEmailHTML(appointment)

    // Check if Resend API key is available
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      // Send real email using Resend
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Dịch vụ công <onboarding@resend.dev>",
          to: [to],
          subject: `Xác nhận lịch hẹn - ${appointment.agencyName}`,
          html: emailHtml,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Resend API error:", error)
        return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        mock: false,
      })
    } else {
      // Mock mode - return success with email preview data
      console.log("[v0] Mock email mode - no RESEND_API_KEY found")
      console.log("[v0] Would send email to:", to)

      return NextResponse.json({
        success: true,
        message: "Email simulated (no API key)",
        mock: true,
        preview: {
          to,
          subject: `Xác nhận lịch hẹn - ${appointment.agencyName}`,
          html: emailHtml,
        },
      })
    }
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
