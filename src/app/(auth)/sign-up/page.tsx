"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
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
import { Separator } from "@/components/ui/separator"
import { Trophy, Chrome } from "lucide-react"

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

type SignUpValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: SignUpValues) {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Registration failed. Please try again.")
        setIsLoading(false)
        return
      }

      // Auto sign-in after registration
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard",
        redirect: true,
      })
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div className="p-2 bg-secondary/10 rounded-xl">
            <Trophy className="h-6 w-6 text-secondary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Start running tournaments for free
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Google Sign Up */}
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-destructive text-center bg-destructive/10 rounded-md py-2 px-3">
            {error}
          </p>
        )}

        {/* Registration Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kagaba Samuel"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Create Free Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <Link href="#" className="underline hover:text-foreground">Terms of Service</Link>
          {" "}and{" "}
          <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-secondary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
