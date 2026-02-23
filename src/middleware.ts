import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const publicRoutes = ["/landing", "/sign-in", "/sign-up", "/forgot-password"]
const publicPrefixes = ["/api/auth", "/t/"]

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Allow public routes and prefixes
  const isPublic =
    publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "/")) ||
    publicPrefixes.some((p) => pathname.startsWith(p))

  if (isPublic) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign-in
  if (!req.auth) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|public/).*)",
  ],
}
