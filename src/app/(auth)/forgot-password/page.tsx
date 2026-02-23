"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ArrowLeft, Mail } from "lucide-react"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    setIsLoading(true)
    // TODO: implement password reset email via /api/auth/forgot-password
    console.log("Password reset requested for:", values.email)
    await new Promise((r) => setTimeout(r, 1000)) // simulate request
    setSubmitted(true)
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div className="p-2 bg-secondary/10 rounded-xl">
            <Mail className="h-6 w-6 text-secondary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="p-3 bg-secondary/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
              <Mail className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="font-medium mb-1">Check your email</p>
              <p className="text-sm text-muted-foreground">
                If that email is registered, you&apos;ll receive a password reset link shortly.
              </p>
            </div>
            <Button variant="outline" className="w-full cursor-pointer" asChild>
              <Link href="/sign-in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="kagaba@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Sending…" : "Send Reset Link"}
                </Button>
              </form>
            </Form>

            <Button variant="ghost" className="w-full cursor-pointer" asChild>
              <Link href="/sign-in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
