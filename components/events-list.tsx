"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  created_at: string
}

export default function EventsList({ userId }: { userId: string }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setEvents(data)
      }
      setLoading(false)
    }

    fetchEvents()
  }, [userId])

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-slate-600 mb-4">No events created yet</p>
          <Link href="/event/create">
            <Button>Create Your First Event</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{event.title}</CardTitle>
                <p className="text-sm text-slate-600 mt-1">{event.description}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/event/${event.id}/results`}>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </Link>
                <Link href={`/event/${event.id}/share`}>
                  <Button size="sm">Share</Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
