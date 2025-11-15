"use client"

import { useNavigate } from "react-router-dom"
import { ArrowLeft, Monitor, Sun, Moon } from "lucide-react"
import { useTheme } from "@/utils/ThemeContext"
import { useLanguage } from "@/utils/LanguageContext"
import "./Settings.css"

function Settings() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const themeOptions = [
    { value: "light", label: t("light"), icon: Sun },
    { value: "dark", label: t("dark"), icon: Moon },
    { value: "system", label: t("system"), icon: Monitor },
  ]

  const languageOptions = [
    { value: "en", label: t("english") },
    { value: "zh", label: t("chinese") },
  ]

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-button" onClick={() => navigate("/home")}>
          <ArrowLeft size={24} />
        </button>
        <h1>{t("settingsTitle")}</h1>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <h2>{t("theme")}</h2>
          <div className="theme-options">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                className={`theme-option ${theme === value ? "active" : ""}`}
                onClick={() => setTheme(value)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h2>{t("language")}</h2>
          <div className="language-options">
            {languageOptions.map(({ value, label }) => (
              <button
                key={value}
                className={`language-option ${language === value ? "active" : ""}`}
                onClick={() => setLanguage(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
