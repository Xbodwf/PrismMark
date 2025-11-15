"use client"

import CameraControls from "./CameraControls"
import Grid from "./Grid"
import NotePath from "./NotePath"
import Notes from "./Notes"
import Ball from "./Ball"
import { useThree } from "@react-three/fiber"
import { useEffect } from "react"

function Scene({
  notePositions,
  currentNoteIndex,
  isPlaying,
  onInput,
  onDistanceCheck,
  lastJudgment,
  judgmentPosition,
  onBallPositionUpdate,
  autoPlay,
  onAutoTrigger,
  selectedNoteIndex,
  onNoteClick,
  onInsertNote,
  onBackgroundClick,
  ballPosition,
  levelData,
}) {
  const { gl } = useThree()

  useEffect(() => {
    const handleClick = (event) => {
      // 检查点击是否在UI元素上
      const target = event.target
      if (
        target.closest(".left-toolbar") ||
        target.closest(".property-panel") ||
        target.closest(".toolbar-toggle") ||
        target.closest(".ui-panel")
      ) {
        return // 如果点击在UI元素上，不处理
      }

      if (isPlaying && onInput) {
        // 自动播放模式下屏蔽玩家输入
        if (!autoPlay) {
          onInput()
        }
      } else if (!isPlaying && onBackgroundClick) {
        // 点击空白处，折叠工具栏并取消选中
        onBackgroundClick()
      }
    }

    const handleKeyDown = (event) => {
      if (isPlaying && onInput) {
        // 自动播放模式下屏蔽玩家输入
        if (!autoPlay) {
          onInput()
        }
      }
    }

    // 使用document而不是canvas来捕获所有点击
    document.addEventListener("click", handleClick)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("click", handleClick)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying, onInput, onBackgroundClick, autoPlay])

  return (
    <>
      <CameraControls
        isPlaying={isPlaying}
        selectedNoteIndex={selectedNoteIndex}
        notePositions={notePositions}
        ballPosition={ballPosition}
      />
      <Grid />
      <NotePath notePositions={notePositions} />
      <Notes
        notePositions={notePositions}
        currentNoteIndex={currentNoteIndex}
        isPlaying={isPlaying}
        lastJudgment={lastJudgment}
        judgmentPosition={judgmentPosition}
        selectedNoteIndex={selectedNoteIndex}
        onNoteClick={onNoteClick}
        onInsertNote={onInsertNote}
        levelData={levelData}
      />
      <Ball
        isPlaying={isPlaying}
        currentNoteIndex={currentNoteIndex}
        notePositions={notePositions}
        onPositionUpdate={onBallPositionUpdate}
        autoPlay={autoPlay}
        onAutoTrigger={onAutoTrigger}
        onDistanceCheck={onDistanceCheck}
      />
    </>
  )
}

export default Scene
