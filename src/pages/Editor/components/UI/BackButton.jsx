"use client"

function BackButton({ isPlaying, onNavigateHome }) {
  if (isPlaying) return null

  return (
    <button className="back-btn" onClick={onNavigateHome}>
      Back to Home
    </button>
  )
}

export default BackButton
