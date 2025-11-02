import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Check Your Email</CardTitle>
        <CardDescription>We've sent you a confirmation link</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Please click the link in your email to confirm your account and start scheduling events.
        </p>
        <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  )
}
