function InfoPanel({
  levelData,
  actualNoteCount,
  score,
  combo,
  currentNoteIndex,
  selectedNoteIndex,
  isPlaying,
  deathCount,
  failureWindow,
  audioReady,
  audioLoading,
  audioError,
}) {
  // 计算当前进度 - 修复外置谱面的显示问题
  const getCurrentProgress = () => {
    if (!isPlaying) return `0/${actualNoteCount}`

    // 确保currentNoteIndex从0开始，但显示时减1（因为第0个物量不计入实际物量）
    const displayCurrent = Math.max(0, currentNoteIndex - 1)
    const displayTotal = actualNoteCount

    return `${Math.min(displayCurrent, displayTotal)}/${displayTotal}`
  }

  return (
    <div className="info-panel">
      <h3>{levelData?.property?.song?.name || "Unknown Song"}</h3>
      <p>BPM: {levelData?.property?.song?.bpm || 120}</p>
      <p>Notes: {actualNoteCount}</p>
      <p>Score: {score}</p>
      <p>Combo: {combo}</p>
      <p>Current: {getCurrentProgress()}</p>
      {selectedNoteIndex !== null && !isPlaying && <p style={{ color: "#ffff00" }}>Selected: {selectedNoteIndex}</p>}
      <p style={{ fontSize: "0.8em", color: "#888" }}>Failure Window: {failureWindow} notes</p>
      {deathCount > 0 && <p style={{ fontSize: "0.8em", color: "#ff6666" }}>Deaths: {deathCount}</p>}

      {/* 音频状态显示 */}
      {audioLoading && <p style={{ fontSize: "0.8em", color: "#ffaa00" }}>Loading Audio...</p>}
      {audioError && <p style={{ fontSize: "0.8em", color: "#ff6666" }}>Audio Error: {audioError}</p>}
      {audioReady && <p style={{ fontSize: "0.8em", color: "#00ff88" }}>Audio Ready</p>}

      {!isPlaying && <p style={{ fontSize: "0.8em", color: "#888" }}>拖拽移动视角 | 滚轮缩放 | 点击物量选中</p>}

      {/* 调试信息 */}
      {isPlaying && (
        <p style={{ fontSize: "0.7em", color: "#666" }}>
          Debug: noteIndex={currentNoteIndex}, totalNotes={actualNoteCount + 1}
        </p>
      )}
    </div>
  )
}

export default InfoPanel
