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

  useEffect(() => {
    ;(async () => {
      const { id } = await params
      setEventId(id)

      const supabase = createClient()
      const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

      if (!error && data) {
        setEvent(data)
      }
      setLoading(false)
    })()
  }, [params])

  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/event/${eventId}/join`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
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

            <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
