import ControlPanel from "./ControlPanel"
import ModePanel from "./ModePanel"
import BackButton from "./BackButton"

function UIPanel({
  levelData,
  actualNoteCount,
  score,
  combo,
  currentNoteIndex,
  selectedNoteIndex,
  isPlaying,
  autoPlay,
  setAutoPlay,
  invincibleMode,
  setInvincibleMode,
  deathCount,
  failureWindow,
  audioReady,
  audioLoading,
  audioError,
  isCountingDown,
  onStartGame,
  onStopGame,
  onResetGame,
  onLoadDefaultLevel,
  onFileUpload,
  onAudioUpload,
  onSaveLevel,
  onSelectFirstNote,
  onNavigateHome,
}) {
  return (
    <div className="ui-panel">
      {/* 移除InfoPanel，它现在在LeftToolbar中 */}

      <ControlPanel
        isPlaying={isPlaying}
        isCountingDown={isCountingDown}
        audioReady={audioReady}
        onStartGame={onStartGame}
        onStopGame={onStopGame}
        onResetGame={onResetGame}
        onLoadDefaultLevel={onLoadDefaultLevel}
        onFileUpload={onFileUpload}
        onAudioUpload={onAudioUpload}
        onSaveLevel={onSaveLevel}
        onSelectFirstNote={onSelectFirstNote}
      />

      <ModePanel
        isPlaying={isPlaying}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        invincibleMode={invincibleMode}
        setInvincibleMode={setInvincibleMode}
      />

      <BackButton isPlaying={isPlaying} onNavigateHome={onNavigateHome} />
    </div>
  )
}

export default UIPanel
