"use client"

import { useEffect } from "react"
import { useUIStore } from "@/store/useUIStore"

export function ThemeEffect() {
  const { activeTheme, isDarkMode, isHighContrast } = useUIStore()

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove potential classes
    root.classList.remove("light", "dark", "high-contrast")

    // Theme logic
    if (activeTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else if (activeTheme === "dark" || isDarkMode) {
      root.classList.add("dark")
    } else {
      root.classList.add("light")
    }

    // High Contrast logic
    if (isHighContrast) {
      root.classList.add("high-contrast")
    }
  }, [activeTheme, isDarkMode, isHighContrast])

  return null
}
