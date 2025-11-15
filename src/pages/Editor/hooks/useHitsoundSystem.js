"use client"

import { useRef, useCallback, useEffect } from "react"
import { HitsoundSystem } from "../systems/HitsoundSystem"

export const useHitsoundSystem = () => {
  const hitsoundSystem = useRef(null)

  useEffect(() => {
    hitsoundSystem.current = new HitsoundSystem()
    hitsoundSystem.current.initialize()

    return () => {
      if (hitsoundSystem.current) {
        hitsoundSystem.current.destroy()
      }
    }
  }, [])

  const playHitsound = useCallback((soundName = "kick") => {
    if (hitsoundSystem.current) {
      hitsoundSystem.current.playSound(soundName)
    }
  }, [])

  const setHitsoundVolume = useCallback((volume) => {
    if (hitsoundSystem.current) {
      hitsoundSystem.current.setVolume(volume)
    }
  }, [])

  return {
    playHitsound,
    setHitsoundVolume,
  }
}
