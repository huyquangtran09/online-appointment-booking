"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AgencyCard } from "@/components/agency-card"
import { mockAgencies } from "@/lib/mock-data"
import { Search, Building2 } from "lucide-react"

export function AgencySearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState<string | null>(null)

  // Get all unique services
  const allServices = useMemo(() => {
    const services = new Set<string>()
    mockAgencies.forEach((agency) => {
      agency.services.forEach((service) => services.add(service))
    })
    return Array.from(services)
  }, [])

  // Filter agencies based on search and service
  const filteredAgencies = useMemo(() => {
    return mockAgencies.filter((agency) => {
      const matchesSearch =
        searchQuery === "" ||
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesService = !selectedService || agency.services.includes(selectedService)

      return matchesSearch && matchesService
    })
  }, [searchQuery, selectedService])

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm cơ quan, dịch vụ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 pl-10 text-base"
        />
      </div>

      {/* Service filter chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedService === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedService(null)}
        >
          Tất cả
        </Button>
        {allServices.slice(0, 8).map((service) => (
          <Button
            key={service}
            variant={selectedService === service ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedService(service === selectedService ? null : service)}
          >
            {service}
          </Button>
        ))}
      </div>

      {/* Results */}
      {filteredAgencies.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgencies.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Không tìm thấy cơ quan</h3>
          <p className="mt-2 text-sm text-muted-foreground">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchQuery("")
              setSelectedService(null)
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  )
}
