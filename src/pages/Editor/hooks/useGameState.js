"use client"

import { useState } from "react"

export const useGameState = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [invincibleMode, setInvincibleMode] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [lastJudgment, setLastJudgment] = useState("")
  const [judgmentPosition, setJudgmentPosition] = useState({ x: 0, y: 0 })
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null)
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 })

  return {
    isPlaying,
    setIsPlaying,
    autoPlay,
    setAutoPlay,
    invincibleMode,
    setInvincibleMode,
    currentNoteIndex,
    setCurrentNoteIndex,
    score,
    setScore,
    combo,
    setCombo,
    lastJudgment,
    setLastJudgment,
    judgmentPosition,
    setJudgmentPosition,
    selectedNoteIndex,
    setSelectedNoteIndex,
    ballPosition,
    setBallPosition,
  }
}
