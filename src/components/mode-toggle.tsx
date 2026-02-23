"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

interface ModeToggleProps {
  variant?: "outline" | "ghost" | "default"
}

export function ModeToggle({ variant = "outline" }: ModeToggleProps) {
  const { theme, setTheme } = useTheme()

  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    if (theme === "dark") {
      setIsDarkMode(true)
    } else if (theme === "light") {
      setIsDarkMode(false)
    } else {
      setIsDarkMode(
        typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
      )
    }
  }, [theme])

  const handleToggle = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleToggle}
      className="cursor-pointer relative overflow-hidden"
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Switch to {isDarkMode ? "light" : "dark"} mode</span>
    </Button>
  )
}
