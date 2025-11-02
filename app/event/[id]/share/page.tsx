"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Event {
  id: string
  title: string
  description: string
}

export default function ShareEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [eventId, setEventId] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      try {
        const { id } = await params
        setEventId(id)

        const supabase = createClient()
        const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

        if (error) {
          console.log("[v0] Error fetching event:", error)
          setError("Failed to load event")
        } else if (data) {
          setEvent(data)
        }
      } catch (err) {
        console.log("[v0] Exception:", err)
        setError("An error occurred")
      } finally {
        setLoading(false)
      }
    })()
  }, [params])

  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/event/${eventId}/join`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>
  if (!event) return <div className="text-center py-8">Event not found</div>

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Share Event</CardTitle>
            <CardDescription>Share this link with people to collect their availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
              {event.description && <p className="text-sm text-slate-600">{event.description}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly />
                <Button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy"}</Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => (window.location.href = `/event/${eventId}/results`)} className="flex-1">
                View Results
              </Button>
              <Button onClick={() => (window.location.href = "/dashboard")} variant="outline" className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
