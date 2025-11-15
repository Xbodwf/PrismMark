"use client"

import { Bot, Shield } from "lucide-react"

function ModePanel({ isPlaying, autoPlay, setAutoPlay, invincibleMode, setInvincibleMode }) {
  if (isPlaying) return null

  return (
    <div className="mode-panel">
      <button
        className={`mode-btn ${invincibleMode ? "active" : ""}`}
        onClick={() => setInvincibleMode(!invincibleMode)}
        title="Invincible Mode"
      >
        <Shield size={20} />
      </button>

      <button
        className={`mode-btn ${autoPlay ? "active" : ""}`}
        onClick={() => setAutoPlay(!autoPlay)}
        title="Auto Play"
      >
        <Bot size={20} />
      </button>
    </div>
  )
}

export default ModePanel
