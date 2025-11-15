"use client"

import { Play, Pause, RotateCcw, Upload, Save, Home, SkipBack, Music } from "lucide-react"

function ControlPanel({
  isPlaying,
  isCountingDown,
  audioReady,
  onStartGame,
  onStopGame,
  onResetGame,
  onLoadDefaultLevel,
  onFileUpload,
  onAudioUpload,
  onSaveLevel,
  onSelectFirstNote,
}) {
  return (
    <div className="control-panel">
      {!isPlaying && !isCountingDown && (
        <button className="control-btn" onClick={onSelectFirstNote} title="Select First Note">
          <SkipBack size={24} />
        </button>
      )}

      <button
        className="control-btn start-btn"
        onClick={isPlaying ? onStopGame : onStartGame}
        disabled={isCountingDown}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      {!isPlaying && !isCountingDown && (
        <>
          <button className="control-btn" onClick={onResetGame}>
            <RotateCcw size={24} />
          </button>
          <button className="control-btn" onClick={onLoadDefaultLevel} title="Load Default Level">
            <Home size={24} />
          </button>
          <label className="control-btn file-input">
            <Upload size={24} />
            <input type="file" accept="*/*" onChange={onFileUpload} />
          </label>
          <label className="control-btn file-input" title="Upload Audio">
            <Music size={24} />
            <input type="file" accept="audio/*" onChange={onAudioUpload} />
          </label>
          <button className="control-btn" onClick={onSaveLevel}>
            <Save size={24} />
          </button>
        </>
      )}
    </div>
  )
}

export default ControlPanel
