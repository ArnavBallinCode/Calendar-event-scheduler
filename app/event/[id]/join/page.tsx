"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AvailabilityCalendar from "@/components/availability-calendar"

interface Event {
  id: string
  title: string
  description: string
  duration_minutes: number
}

export default function JoinEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [submitted, setSubmitted] = useState(false)
  const [responseId, setResponseId] = useState<string>("")
  const [eventId, setEventId] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      try {
        const { id } = await params
        setEventId(id)

        const supabase = createClient()
        const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

        console.log("[v0] Event fetch result:", { data, error })

        if (error) {
          console.log("[v0] Error fetching event:", error)
          setError("Failed to load event")
        } else if (data) {
          setEvent(data)
        } else {
          setError("Event not found")
        }
      } catch (err) {
        console.log("[v0] Exception in useEffect:", err)
        setError("An error occurred while loading the event")
      } finally {
        setLoading(false)
      }
    })()
  }, [params])

  const handleSubmitName = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = createClient()
    const { data, error } = await supabase
      .from("event_responses")
      .insert({
        event_id: eventId,
        responder_name: name,
        timezone,
      })
      .select()
      .single()

    if (!error && data) {
      setResponseId(data.id)
      setSubmitted(true)
    } else {
      console.log("[v0] Error creating response:", error)
      setError("Failed to submit your name")
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>
  if (!event) return <div className="text-center py-8">Event not found</div>

  if (!submitted) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitName} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    {Intl.supportedValuesOf("timeZone").map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Continue to Calendar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <AvailabilityCalendar
      eventId={eventId}
      responseId={responseId}
      eventTitle={event.title}
      timezone={timezone}
      durationMinutes={event.duration_minutes}
    />
  )
}
