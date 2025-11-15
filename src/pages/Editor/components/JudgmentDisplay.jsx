"use client"

import { useState, useEffect } from "react"
import { Html } from "@react-three/drei"
import { JUDGMENT_TYPES } from "../constants/judgmentTypes"

function JudgmentDisplay({ position, judgment, visible }) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (visible && judgment) {
      setOpacity(1)
      const timer = setTimeout(() => {
        setOpacity(0)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [visible, judgment])

  if (!visible || !judgment) return null

  const getJudgmentColor = (judgment) => {
    switch (judgment) {
      case JUDGMENT_TYPES.PERFECT:
        return "#00ff88"
      case JUDGMENT_TYPES.SLIGHTLY_FAST:
      case JUDGMENT_TYPES.SLIGHTLY_SLOW:
        return "#88ff00"
      case JUDGMENT_TYPES.FAST:
      case JUDGMENT_TYPES.SLOW:
        return "#ffaa00"
      case JUDGMENT_TYPES.TOO_FAST:
      case JUDGMENT_TYPES.TOO_SLOW:
        return "#ff6600"
      case JUDGMENT_TYPES.MISS:
        return "#ff0000"
      default:
        return "#666666"
    }
  }

  return (
    <group position={[position.x, position.y + 30, 0]}>
      <Html center>
        <div
          style={{
            color: getJudgmentColor(judgment),
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "Arial",
            textAlign: "center",
            pointerEvents: "none",
            userSelect: "none",
            opacity: opacity,
            transition: "opacity 1s ease-out",
            textTransform: "uppercase",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {judgment.replace(/_/g, " ")}
        </div>
      </Html>
    </group>
  )
}

export default JudgmentDisplay
