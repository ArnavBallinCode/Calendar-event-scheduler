"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import HeatmapView from "@/components/heatmap-view"

interface Response {
  id: string
  responder_name: string
  timezone: string
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      const { id } = await params
      setEventId(id)

      const supabase = createClient()
      const { data, error } = await supabase.from("event_responses").select("*").eq("event_id", id)

      if (!error && data) {
        setResponses(data)
      }
      setLoading(false)
    })()
  }, [params])

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Event Results</h1>
          <p className="text-slate-600 mt-2">
            {responses.length} {responses.length === 1 ? "person has" : "people have"} submitted their availability
          </p>
        </div>

        <div className="grid gap-6">
          {/* Responses list */}
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {responses.length === 0 ? (
                  <p className="text-slate-600">No responses yet</p>
                ) : (
                  responses.map((response) => (
                    <div key={response.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                      <span className="font-medium">{response.responder_name}</span>
                      <span className="text-sm text-slate-600">{response.timezone}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Heatmap */}
          {responses.length > 0 && <HeatmapView eventId={eventId} responses={responses} />}
        </div>
      </div>
    </main>
  )
}
