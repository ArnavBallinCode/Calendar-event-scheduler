"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import AvailabilityCalendar from "@/components/availability-calendar"

interface Event {
  id: string
  title: string
  description: string
  duration_minutes: number
}

export default function AddAvailabilityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState<string>("")
  const [responseId, setResponseId] = useState<string>("")
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [isCreator, setIsCreator] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const { id } = await params
      const resId = searchParams.get("responseId")

      setEventId(id)
      setResponseId(resId || "")

      const supabase = createClient()

      if (resId) {
        const { data: responseData } = await supabase
          .from("event_responses")
          .select("is_creator")
          .eq("id", resId)
          .single()

        if (responseData?.is_creator) {
          setIsCreator(true)
        }
      }

      const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

      if (!error && data) {
        setEvent(data)
      }
      setLoading(false)
    })()
  }, [params, searchParams])

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (!event) return <div className="text-center py-8">Event not found</div>

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Add Your Availability</h1>
          <p className="text-slate-600 mt-2">
            Select the times you're available for: <span className="font-semibold">{event.title}</span>
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium">Your Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-slate-300 rounded-md mt-2"
          >
            {Intl.supportedValuesOf("timeZone").map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <AvailabilityCalendar
          eventId={eventId}
          responseId={responseId}
          eventTitle={event.title}
          timezone={timezone}
          durationMinutes={event.duration_minutes}
          isCreator={isCreator}
        />
      </div>
    </main>
  )
}
