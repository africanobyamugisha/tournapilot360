import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  variant?: "long" | "square"
  height?: number
  className?: string
  showText?: boolean
}

export function Logo({
  href = "/landing",
  variant = "long",
  height = 36,
  className,
  showText = false,
}: LogoProps) {
  const imgSrc =
    variant === "square" ? "/images/logo-square.png" : "/images/logo.png"
  const width = variant === "square" ? height : height * 2.5

  const img = (
    <Image
      src={imgSrc}
      alt="TournaPilot360"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-2">
        {img}
        {showText && (
          <span className="font-bold text-lg hidden sm:inline-block">
            TournaPilot360
          </span>
        )}
      </Link>
    )
  }

  return img
}
