import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import EventsList from "@/components/events-list"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Events</h1>
            <p className="text-slate-600 mt-2">Create or manage scheduling events</p>
          </div>
          <div className="flex gap-4">
            <Link href="/event/create">
              <Button>Create Event</Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline">Settings</Button>
            </Link>
          </div>
        </div>

        {!profile?.timezone && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-900">
                Please set your timezone in{" "}
                <Link href="/settings" className="underline font-semibold">
                  settings
                </Link>{" "}
                to see accurate availability times.
              </p>
            </CardContent>
          </Card>
        )}

        <EventsList userId={user.id} />
      </div>
    </main>
  )
}
