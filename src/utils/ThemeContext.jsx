"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    // 提供默认值而不是抛出错误
    console.warn("useTheme used outside of ThemeProvider, using default values")
    return {
      theme: "dark",
      setTheme: () => {},
      actualTheme: "dark",
    }
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("prismmark-theme")
      return saved || "system"
    } catch {
      return "system"
    }
  })

  const [actualTheme, setActualTheme] = useState("dark")

  useEffect(() => {
    const updateTheme = () => {
      let newTheme = theme

      if (theme === "system") {
        try {
          newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        } catch {
          newTheme = "dark"
        }
      }

      setActualTheme(newTheme)
      document.documentElement.setAttribute("data-theme", newTheme)

      try {
        localStorage.setItem("prismmark-theme", theme)
      } catch {
        // localStorage not available
      }
    }

    updateTheme()

    if (theme === "system") {
      try {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        mediaQuery.addEventListener("change", updateTheme)
        return () => mediaQuery.removeEventListener("change", updateTheme)
      } catch {
        // matchMedia not available
      }
    }
  }, [theme])

  const value = {
    theme,
    setTheme,
    actualTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
