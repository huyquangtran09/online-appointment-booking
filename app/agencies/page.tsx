import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AgencySearch } from "@/components/agency-search"

export default function AgenciesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Danh sách cơ quan hành chính</h1>
            <p className="mt-2 text-muted-foreground">Tìm và đặt lịch hẹn với các cơ quan hành chính trên địa bàn</p>
          </div>

          <AgencySearch />
        </div>
      </main>

      <Footer />
    </div>
  )
}
