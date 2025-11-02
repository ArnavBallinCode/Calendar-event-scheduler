import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white">Find the Perfect Time</h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              Coordinate schedules across time zones with ease. Create events, collect availability from your team, and
              find the best meeting times.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-800 rounded-lg p-6 space-y-4">
              <div className="text-3xl">🗓️</div>
              <h3 className="text-xl font-semibold text-white">Easy Scheduling</h3>
              <p className="text-slate-400">Create events in seconds and share with your team</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 space-y-4">
              <div className="text-3xl">🌍</div>
              <h3 className="text-xl font-semibold text-white">Global Time Zones</h3>
              <p className="text-slate-400">Automatically handles time zones for everyone</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 space-y-4">
              <div className="text-3xl">📊</div>
              <h3 className="text-xl font-semibold text-white">Smart Analysis</h3>
              <p className="text-slate-400">Visual heatmaps show the best times to meet</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
