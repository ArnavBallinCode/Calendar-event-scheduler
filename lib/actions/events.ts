"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createEventWithCreatorResponse(title: string, description: string, durationMinutes: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Create event
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .insert({
      creator_id: user.id,
      title,
      description,
      duration_minutes: durationMinutes,
    })
    .select()
    .single()

  if (eventError) throw eventError

  // Create event response for the creator
  const { data: responseData, error: responseError } = await supabase
    .from("event_responses")
    .insert({
      event_id: eventData.id,
      responder_name: user.user_metadata?.full_name || "Event Creator",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      is_creator: true,
    })
    .select()
    .single()

  if (responseError) throw responseError

  revalidatePath("/dashboard", "layout")

  return {
    eventId: eventData.id,
    responseId: responseData.id,
  }
}
