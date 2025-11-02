"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Response {
  id: string
  responder_name: string
  timezone: string
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export default function HeatmapView({
  eventId,
  responses,
}: {
  eventId: string
  responses: Response[]
}) {
  const [heatmap, setHeatmap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeatmap = async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("availability_slots")
        .select("response_id, day_of_week, hour")
        .in(
          "response_id",
          responses.map((r) => r.id),
        )

      if (!error && data) {
        const map: Record<string, number> = {}
        data.forEach((slot) => {
          const key = `${slot.day_of_week}-${slot.hour}`
          map[key] = (map[key] || 0) + 1
        })
        setHeatmap(map)
      }
      setLoading(false)
    }

    if (responses.length > 0) {
      fetchHeatmap()
    }
  }, [responses])

  const getColor = (count: number, totalResponses: number): string => {
    if (count === 0) return "bg-slate-100"
    const percentage = count / totalResponses
    if (percentage >= 0.8) return "bg-green-600"
    if (percentage >= 0.6) return "bg-green-400"
    if (percentage >= 0.4) return "bg-yellow-400"
    return "bg-orange-300"
  }

  if (loading) return <div className="text-center py-8">Loading heatmap...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Heatmap</CardTitle>
        <p className="text-sm text-slate-600 mt-2">Darker green = more people available</p>
      </CardHeader>
      <CardContent>
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

            {/* Heatmap grid */}
            <div className="space-y-1">
              {HOURS.map((hour) => (
                <div key={hour} className="flex gap-2 items-center">
                  <div className="w-24 text-right pr-2 text-sm text-slate-600 flex-shrink-0">
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                  {DAYS.map((_, dayIndex) => {
                    const key = `${dayIndex}-${hour}`
                    const count = heatmap[key] || 0
                    return (
                      <div
                        key={key}
                        className={`w-12 h-12 rounded border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 flex-shrink-0 ${getColor(count, responses.length)}`}
                        title={`${count} person${count !== 1 ? "s" : ""} available`}
                      >
                        {count > 0 ? count : ""}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded" />
            <span className="text-xs">0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-300 rounded" />
            <span className="text-xs">1-2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded" />
            <span className="text-xs">40-60%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded" />
            <span className="text-xs">60-80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-xs">80%+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
