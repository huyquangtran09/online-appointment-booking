import { Building2 } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Dịch vụ công trực tuyến</h3>
                <p className="text-sm text-muted-foreground">Đặt lịch hẹn nhanh chóng</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Hệ thống đặt lịch hẹn trực tuyến giúp người dân tiết kiệm thời gian, giảm thiểu chờ đợi khi làm việc với
              các cơ quan hành chính.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/agencies" className="text-muted-foreground hover:text-foreground">
                  Danh sách cơ quan
                </Link>
              </li>
              <li>
                <Link href="/check-in" className="text-muted-foreground hover:text-foreground">
                  Check-in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Hotline: 1900-xxxx</li>
              <li>Email: hotro@dichvucong.vn</li>
              <li>Thời gian: 7:30 - 17:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Hệ thống đặt lịch hẹn trực tuyến. Bản quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
