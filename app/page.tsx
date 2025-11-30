import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, QrCode, Shield, CheckCircle2, Users } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: "Đặt lịch dễ dàng",
      description: "Chọn cơ quan, ngày giờ phù hợp và đặt lịch chỉ trong vài phút",
    },
    {
      icon: Clock,
      title: "Tiết kiệm thời gian",
      description: "Không cần xếp hàng chờ đợi, đến đúng giờ hẹn để được phục vụ ngay",
    },
    {
      icon: QrCode,
      title: "Check-in nhanh chóng",
      description: "Quét mã QR khi đến để xác nhận và được hướng dẫn ngay lập tức",
    },
    {
      icon: Shield,
      title: "An toàn & bảo mật",
      description: "Thông tin cá nhân được bảo vệ theo quy định của pháp luật",
    },
  ]

  const stats = [
    { value: "50+", label: "Cơ quan" },
    { value: "10,000+", label: "Lịch hẹn" },
    { value: "98%", label: "Hài lòng" },
    { value: "24/7", label: "Hỗ trợ" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Dịch vụ công trực tuyến chính thức
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Đặt lịch hẹn trực tuyến với cơ quan hành chính
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
                Tiết kiệm thời gian, giảm chờ đợi. Đặt lịch làm việc với UBND, Sở, Phòng ban chỉ trong vài phút, mọi lúc
                mọi nơi.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="h-12 px-8 text-base">
                  <Link href="/agencies">
                    Đặt lịch ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base bg-transparent">
                  <Link href="/check-in">
                    <QrCode className="mr-2 h-5 w-5" />
                    Check-in
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tại sao chọn chúng tôi?</h2>
              <p className="mt-4 text-muted-foreground">
                Hệ thống đặt lịch hẹn trực tuyến mang đến trải nghiệm dịch vụ công tiện lợi và hiệu quả
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 bg-muted/50 text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Quy trình đặt lịch</h2>
              <p className="mt-4 text-muted-foreground">Chỉ với 4 bước đơn giản</p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-4">
              {[
                { step: "01", title: "Chọn cơ quan", desc: "Tìm và chọn cơ quan bạn cần đến làm việc" },
                { step: "02", title: "Chọn ngày giờ", desc: "Chọn thời gian phù hợp với lịch của bạn" },
                { step: "03", title: "Xác nhận", desc: "Điền thông tin và nhận mã QR xác nhận" },
                { step: "04", title: "Đến cơ quan", desc: "Check-in bằng mã QR và được phục vụ" },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  {index < 3 && <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-border md:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-4xl overflow-hidden bg-primary text-primary-foreground">
              <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
                <Users className="h-12 w-12" />
                <h2 className="text-2xl font-bold sm:text-3xl">Sẵn sàng tiết kiệm thời gian?</h2>
                <p className="max-w-xl opacity-90">
                  Đăng ký tài khoản miễn phí ngay hôm nay để bắt đầu đặt lịch hẹn trực tuyến với các cơ quan hành chính
                  trên toàn quốc.
                </p>
                <Button size="lg" variant="secondary" asChild className="h-12 px-8">
                  <Link href="/register">
                    Đăng ký miễn phí
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
