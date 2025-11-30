import type { Agency } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AgencyCardProps {
  agency: Agency
}

export function AgencyCard({ agency }: AgencyCardProps) {
  const formatWorkingDays = (days: number[]) => {
    if (days.length === 5 && days.includes(1) && days.includes(5)) {
      return "Thứ 2 - Thứ 6"
    }
    if (days.length === 6 && days.includes(6)) {
      return "Thứ 2 - Thứ 7"
    }
    return days.map((d) => `T${d === 0 ? "CN" : d + 1}`).join(", ")
  }

  return (
    <Card className="group flex flex-col transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{agency.name}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">{agency.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="line-clamp-2">{agency.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{agency.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              {agency.workingHours.start} - {agency.workingHours.end} ({formatWorkingDays(agency.workingDays)})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {agency.services.slice(0, 3).map((service) => (
            <Badge key={service} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
          {agency.services.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{agency.services.length - 3}
            </Badge>
          )}
        </div>

        <div className="mt-auto pt-2">
          <Button asChild className="w-full group-hover:bg-primary/90">
            <Link href={`/booking/${agency.id}`}>
              Đặt lịch hẹn
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
