"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface Props {
  eventId: string
  responseId: string
  eventTitle: string
  timezone: string
  durationMinutes: number
}

export default function AvailabilityCalendar({ eventId, responseId, eventTitle, timezone, durationMinutes }: Props) {
  const [availability, setAvailability] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleSlot = (day: number, hour: number) => {
    const key = `${day}-${hour}`
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    const supabase = createClient()

    const slots = Object.entries(availability)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([key]) => {
        const [day, hour] = key.split("-").map(Number)
        return {
          response_id: responseId,
          day_of_week: day,
          hour,
          is_available: true,
        }
      })

    if (slots.length > 0) {
      await supabase.from("availability_slots").insert(slots)
    }

    setLoading(false)
    router.push(`/event/${eventId}/results`)
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{eventTitle}</CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Select all time slots when you're available. Times shown in {timezone}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Headers */}
                <div className="flex gap-2 mb-4">
                  <div className="w-24 flex-shrink-0" />
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="w-12 h-12 flex items-center justify-center font-semibold text-sm text-center flex-shrink-0"
                    >
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Time slots grid */}
                <div className="space-y-1">
                  {HOURS.map((hour) => (
                    <div key={hour} className="flex gap-2 items-center">
                      <div className="w-24 text-right pr-2 text-sm text-slate-600 flex-shrink-0">
                        {hour.toString().padStart(2, "0")}:00
                      </div>
                      {DAYS.map((_, dayIndex) => {
                        const key = `${dayIndex}-${hour}`
                        const isSelected = availability[key] || false
                        return (
                          <button
                            key={key}
                            onClick={() => toggleSlot(dayIndex, hour)}
                            className={`w-12 h-12 rounded border-2 transition-colors flex-shrink-0 ${
                              isSelected
                                ? "bg-blue-500 border-blue-600"
                                : "bg-white border-slate-200 hover:border-blue-300"
                            }`}
                            aria-label={`${DAYS[dayIndex]} ${hour}:00`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Availability"}
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
