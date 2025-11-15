"use client"

import { createContext, useContext, useState, useEffect } from "react"

const LanguageContext = createContext(null)

const translations = {
  en: {
    // App
    start: "Start",
    version: "Version",

    // Home
    levelEditor: "Level Editor",
    settings: "Settings",

    // Editor
    unknownSong: "Unknown Song",
    score: "Score",
    combo: "Combo",
    notes: "Notes",
    autoPlay: "Auto Play",
    backToHome: "Back to Home",
    dragToMove: "Drag to move view | Scroll to zoom",
    loadDefaultLevel: "Load Default Level",
    invalidJsonFormat: "Invalid JSON file format!",

    // Settings
    settingsTitle: "Settings",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    system: "System",
    english: "English",
    chinese: "中文",
    back: "Back",

    // Judgments
    perfect: "PERFECT",
    slightly_fast: "SLIGHTLY FAST",
    slightly_slow: "SLIGHTLY SLOW",
    fast: "FAST",
    slow: "SLOW",
    too_fast: "TOO FAST",
    too_slow: "TOO SLOW",
    miss: "MISS",
    empty_hit: "EMPTY HIT",
  },
  zh: {
    // App
    start: "开始",
    version: "版本",

    // Home
    levelEditor: "关卡编辑器",
    settings: "设置",

    // Editor
    unknownSong: "未知歌曲",
    score: "分数",
    combo: "连击",
    notes: "物量",
    autoPlay: "自动播放",
    backToHome: "返回主页",
    dragToMove: "拖拽移动视角 | 滚轮缩放",
    loadDefaultLevel: "加载默认关卡",
    invalidJsonFormat: "无效的JSON文件格式！",

    // Settings
    settingsTitle: "设置",
    theme: "主题",
    language: "语言",
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
    english: "English",
    chinese: "中文",
    back: "返回",

    // Judgments
    perfect: "完美",
    slightly_fast: "稍快",
    slightly_slow: "稍慢",
    fast: "快",
    slow: "慢",
    too_fast: "太快",
    too_slow: "太慢",
    miss: "失误",
    empty_hit: "空击",
  },
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    // 提供默认值而不是抛出错误
    console.warn("useLanguage used outside of LanguageProvider, using default values")
    return {
      language: "en",
      setLanguage: () => {},
      t: (key) => translations.en[key] || key,
    }
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("prismmark-language")
      if (saved) return saved

      // 安全地检测浏览器语言
      const browserLang = typeof navigator !== "undefined" && navigator.language
      return browserLang && browserLang.startsWith("zh") ? "zh" : "en"
    } catch {
      return "en"
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("prismmark-language", language)
    } catch {
      // localStorage not available
    }
  }, [language])

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const value = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
