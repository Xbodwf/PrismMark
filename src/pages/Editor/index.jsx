"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import Scene from "./components/Scene"
import UIPanel from "./components/UI/UIPanel"
import PropertyPanel from "./components/PropertyPanel"
import LeftToolbar from "./components/LeftToolbar"
import CountdownOverlay from "./components/CountdownOverlay"
import { DEFAULT_LEVEL } from "./constants/defaultLevel"
import { calculateNotePositions } from "./utils/levelUtils"
import { useGameState } from "./hooks/useGameState"
import { useDeathSystem } from "./hooks/useDeathSystem"
import { useAudioSystem } from "./hooks/useAudioSystem"
import { useJudgmentSystem } from "./hooks/useJudgmentSystem"
import { useHitsoundSystem } from "./hooks/useHitsoundSystem"
import JSONParser from "@/utils/LevelParser"
import "./Editor.css"
import "./components/DirectionButtons.css"

function Editor() {
  const navigate = useNavigate()

  // 游戏状态
  const {
    isPlaying,
    setIsPlaying,
    autoPlay,
    setAutoPlay,
    invincibleMode,
    setInvincibleMode,
    currentNoteIndex,
    setCurrentNoteIndex,
    selectedNoteIndex,
    setSelectedNoteIndex,
    ballPosition,
    setBallPosition,
  } = useGameState()

  // 判定系统
  const {
    lastJudgment,
    judgmentPosition,
    score,
    combo,
    executeJudgment,
    executeMissedJudgment,
    checkTooSlowJudgment,
    executeMissJudgment,
    isInJudgmentRange,
    resetJudgment,
  } = useJudgmentSystem()

  // 死亡系统
  const { isPlayerDead, deathCount, addJudgment, resetDeathSystem, getFailureWindow } = useDeathSystem()

  // 音频系统
  const {
    audioReady,
    audioLoading,
    audioError,
    countdown,
    isCountingDown,
    loadAudio,
    startCountdown,
    stopAudio,
    resetAudio,
  } = useAudioSystem()

  // 打拍音系统
  const { playHitsound, setHitsoundVolume } = useHitsoundSystem()

  // 关卡数据
  const [levelData, setLevelData] = useState(DEFAULT_LEVEL)
  const [notePositions, setNotePositions] = useState([])

  // UI状态 - 让左工具栏初始可见，方便用户发现
  const [propertyPanelVisible, setPropertyPanelVisible] = useState(false)
  const [leftToolbarVisible, setLeftToolbarVisible] = useState(true) // 改为true，初始显示

  // 跟踪玩家输入状态
  const [hasInputForCurrentNote, setHasInputForCurrentNote] = useState(false)
  const ballPassedNote = useRef(false)
  const actualBallPosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (levelData) {
      console.log("Loading level data:", levelData)

      const positions = calculateNotePositions(levelData.content || [])
      console.log("Calculated note positions:", positions)

      setNotePositions(positions)

      const hitsoundVolume = levelData.property?.level?.hitsoundVolume || 0.5
      setHitsoundVolume(hitsoundVolume)

      const audioPath = levelData.property?.song?.href
      const volume = levelData.property?.song?.volume || 1.0

      if (audioPath) {
        loadAudio(audioPath, volume)
      } else {
        resetAudio()
      }
    }
  }, [levelData, loadAudio, resetAudio, setHitsoundVolume])

  // 当关卡数据变化时，重新计算物量位置并更新摄像机
  useEffect(() => {
    if (levelData) {
      const positions = calculateNotePositions(levelData.content || [])
      setNotePositions(positions)

      // 如果有选中的物量，更新摄像机位置
      if (selectedNoteIndex !== null && selectedNoteIndex >= 0 && positions[selectedNoteIndex]) {
        setTimeout(() => {
          if (window.cameraControls) {
            window.cameraControls.snapCameraToNote(selectedNoteIndex)
          }
        }, 100)
      }
    }
  }, [levelData, selectedNoteIndex])

  // 当前物量索引变化时重置状态
  useEffect(() => {
    setHasInputForCurrentNote(false)
    ballPassedNote.current = false

    console.log(`Current note index changed to: ${currentNoteIndex}`)
  }, [currentNoteIndex])

  // 文件处理函数
  const loadDefaultLevel = () => {
    setLevelData(DEFAULT_LEVEL)
    const positions = calculateNotePositions(DEFAULT_LEVEL.content || [])
    setNotePositions(positions)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSONParser.parse(e.target.result)
          console.log("Loaded external level:", data)

          if (data && data.content) {
            setLevelData(data)
            const positions = calculateNotePositions(data.content || [])
            console.log("External level positions:", positions)
            setNotePositions(positions)
          } else {
            throw new Error("Invalid level format - missing content")
          }
        } catch (error) {
          console.error("Invalid JSON file:", error)
          alert(`Invalid JSON file format: ${error.message}`)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleAudioUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const audioURL = URL.createObjectURL(file)
      const updatedLevelData = {
        ...levelData,
        property: {
          ...levelData.property,
          song: {
            ...levelData.property.song,
            href: audioURL,
          },
        },
      }
      setLevelData(updatedLevelData)
    }
  }

  const saveLevel = async () => {
    if (!levelData) return

    try {
      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: "level.json",
          types: [{ description: "JSON files", accept: { "application/json": [".json"] } }],
        })
        const writable = await fileHandle.createWritable()
        await writable.write(JSONParser.stringify(levelData, null, 2))
        await writable.close()
      } else {
        const dataStr = JSONParser.stringify(levelData, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = "level.json"
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Failed to save file:", error)
    }
  }

  // 异步判定完成回调
  const handleJudgmentComplete = useCallback(
    async (result) => {
      console.log(`Judgment completed: ${result.judgment}, advancing to next note`)

      playHitsound()

      const bpm = levelData?.property?.song?.bpm || 120
      addJudgment(result.judgment, bpm)

      setCurrentNoteIndex((prev) => {
        const next = prev + 1
        console.log(`Note index advancing from ${prev} to ${next}`)
        return next
      })
    },
    [levelData, addJudgment, setCurrentNoteIndex, playHitsound],
  )

  // 距离检查回调
  const handleDistanceCheck = useCallback(
    async (distance, ballPos) => {
      if (!isPlaying || currentNoteIndex >= notePositions.length || autoPlay) return

      actualBallPosition.current = ballPos

      if (currentNoteIndex > 0 && !hasInputForCurrentNote && !ballPassedNote.current) {
        const targetNote = notePositions[currentNoteIndex]
        if (targetNote) {
          const ballToTarget = {
            x: targetNote.x - ballPos.x,
            y: targetNote.y - ballPos.y,
          }

          const distanceToTarget = Math.sqrt(ballToTarget.x * ballToTarget.x + ballToTarget.y * ballToTarget.y)

          if (distanceToTarget > 100) {
            ballPassedNote.current = true
            setHasInputForCurrentNote(true)
            console.log(`Ball passed note ${currentNoteIndex} without input - executing MISS`)
            await executeMissedJudgment(ballPos, targetNote, currentNoteIndex, handleJudgmentComplete)
          }
        }
      }
    },
    [
      isPlaying,
      currentNoteIndex,
      notePositions,
      hasInputForCurrentNote,
      autoPlay,
      executeMissedJudgment,
      handleJudgmentComplete,
    ],
  )

  // 异步处理输入
  const handleInput = useCallback(async () => {
    if (!isPlaying || currentNoteIndex >= notePositions.length) {
      console.log(
        `Input ignored: isPlaying=${isPlaying}, currentNoteIndex=${currentNoteIndex}, notePositions.length=${notePositions.length}`,
      )
      return
    }

    console.log(
      `Input received for note ${currentNoteIndex}, autoPlay: ${autoPlay}, hasInput: ${hasInputForCurrentNote}`,
    )

    if (autoPlay) {
      const targetPosition = notePositions[currentNoteIndex]
      console.log(
        `Auto play judgment: ballPos=${JSON.stringify(actualBallPosition.current)}, targetPos=${JSON.stringify(targetPosition)}`,
      )
      await executeJudgment(actualBallPosition.current, targetPosition, currentNoteIndex, handleJudgmentComplete)
    } else {
      if (hasInputForCurrentNote) {
        console.log(`Already input for note ${currentNoteIndex}, ignoring`)
        return
      }

      setHasInputForCurrentNote(true)
      const targetPosition = notePositions[currentNoteIndex]
      console.log(
        `Manual judgment: ballPos=${JSON.stringify(actualBallPosition.current)}, targetPos=${JSON.stringify(targetPosition)}`,
      )
      await executeJudgment(actualBallPosition.current, targetPosition, currentNoteIndex, handleJudgmentComplete)
    }
  }, [
    isPlaying,
    currentNoteIndex,
    notePositions,
    hasInputForCurrentNote,
    autoPlay,
    executeJudgment,
    handleJudgmentComplete,
  ])

  const handleAutoTrigger = useCallback(async () => {
    console.log(`Auto trigger called for note ${currentNoteIndex}`)
    await handleInput()
  }, [handleInput, currentNoteIndex])

  const handleBallPositionUpdate = useCallback(
    (position) => {
      setBallPosition(position)
      actualBallPosition.current = position
    },
    [setBallPosition],
  )

  // 物量选中处理
  const handleNoteClick = useCallback(
    (noteIndex) => {
      console.log(`Note click handler called for note ${noteIndex}`)
      if (!isPlaying) {
        if (selectedNoteIndex === noteIndex) {
          setPropertyPanelVisible(!propertyPanelVisible)
        } else {
          setSelectedNoteIndex(noteIndex)
          setPropertyPanelVisible(true)

          // 立即移动摄像机到选中的物量
          setTimeout(() => {
            if (window.cameraControls) {
              window.cameraControls.snapCameraToNote(noteIndex)
            }
          }, 50)
        }
      }
    },
    [isPlaying, selectedNoteIndex, propertyPanelVisible, setSelectedNoteIndex],
  )

  // 修改背景点击处理，同时折叠两个工具栏
  const handleBackgroundClick = useCallback(() => {
    if (!isPlaying) {
      console.log("Background clicked - collapsing toolbars and deselecting note")
      setSelectedNoteIndex(null)
      setPropertyPanelVisible(false)
      setLeftToolbarVisible(false)
    }
  }, [isPlaying, setSelectedNoteIndex])

  const handleSelectFirstNote = useCallback(() => {
    if (!isPlaying) {
      console.log("Selecting first note (index 0)")
      setSelectedNoteIndex(0)
      setPropertyPanelVisible(true)

      // 立即移动摄像机到第0个物量
      setTimeout(() => {
        if (window.cameraControls) {
          console.log("Moving camera to first note")
          window.cameraControls.snapCameraToNote(0)
        }
      }, 50)
    }
  }, [isPlaying, setSelectedNoteIndex])

  // 插入新物量
  const handleInsertNote = useCallback(
    (afterIndex, offset) => {
      if (isPlaying || !levelData) return

      const insertIndex = afterIndex + 1
      const currentNote = levelData.content[afterIndex]
      if (!currentNote) return

      // 创建新物量
      const newNote = {
        positionOffset: offset,
        timing: currentNote.timing + 1000,
        type: "tap",
      }

      // 插入到数组中
      const newContent = [...levelData.content]
      newContent.splice(insertIndex, 0, newNote)

      // 更新所有后续事件的noteIndex
      const newAddons =
        levelData.addons?.map((addon) => ({
          ...addon,
          noteIndex: addon.noteIndex >= insertIndex ? addon.noteIndex + 1 : addon.noteIndex,
        })) || []

      const newLevelData = {
        ...levelData,
        content: newContent,
        addons: newAddons,
      }

      setLevelData(newLevelData)
      setSelectedNoteIndex(insertIndex)

      console.log(`Inserted new note at index ${insertIndex} with offset`, offset)

      // 插入物量后，立即移动摄像机到新物量
      setTimeout(() => {
        if (window.cameraControls) {
          const newPositions = calculateNotePositions(newContent)
          if (newPositions[insertIndex]) {
            console.log(`Moving camera to newly inserted note ${insertIndex}`)
            window.cameraControls.snapCameraToNote(insertIndex)
          }
        }
      }, 100)
    },
    [isPlaying, levelData, setSelectedNoteIndex],
  )

  // 更新物量属性
  const handleUpdateNote = useCallback(
    (noteIndex, newData) => {
      if (!levelData) return

      const newContent = [...levelData.content]
      newContent[noteIndex] = newData

      const newLevelData = {
        ...levelData,
        content: newContent,
      }

      setLevelData(newLevelData)
    },
    [levelData],
  )

  // 添加事件
  const handleAddEvent = useCallback(
    (event) => {
      if (!levelData) return

      const newAddons = [...(levelData.addons || []), event]
      const newLevelData = {
        ...levelData,
        addons: newAddons,
      }

      setLevelData(newLevelData)
    },
    [levelData],
  )

  // 更新事件
  const handleUpdateEvent = useCallback(
    (noteIndex, eventIndex, newEventData) => {
      if (!levelData) return

      const noteEvents = levelData.addons?.filter((addon) => addon.noteIndex === noteIndex) || []
      const globalEventIndex = levelData.addons?.findIndex((addon, index) => {
        const noteEventIndex = noteEvents.indexOf(addon)
        return addon.noteIndex === noteIndex && noteEventIndex === eventIndex
      })

      if (globalEventIndex !== undefined && globalEventIndex !== -1) {
        const newAddons = [...levelData.addons]
        newAddons[globalEventIndex] = newEventData

        const newLevelData = {
          ...levelData,
          addons: newAddons,
        }

        setLevelData(newLevelData)
      }
    },
    [levelData],
  )

  // 删除事件
  const handleDeleteEvent = useCallback(
    (noteIndex, eventIndex) => {
      if (!levelData) return

      const noteEvents = levelData.addons?.filter((addon) => addon.noteIndex === noteIndex) || []
      const globalEventIndex = levelData.addons?.findIndex((addon, index) => {
        const noteEventIndex = noteEvents.indexOf(addon)
        return addon.noteIndex === noteIndex && noteEventIndex === eventIndex
      })

      if (globalEventIndex !== undefined && globalEventIndex !== -1) {
        const newAddons = [...levelData.addons]
        newAddons.splice(globalEventIndex, 1)

        const newLevelData = {
          ...levelData,
          addons: newAddons,
        }

        setLevelData(newLevelData)
      }
    },
    [levelData],
  )

  // 游戏控制
  const startGame = async () => {
    if (!audioReady && levelData?.property?.song?.href) {
      alert("Please wait for audio to load before starting the game.")
      return
    }

    const bpm = levelData?.property?.song?.bpm || 120
    const offset = levelData?.property?.song?.offset || 0

    console.log(`Starting game with BPM: ${bpm}, offset: ${offset}`)

    await startCountdown(bpm, offset)

    setIsPlaying(true)
    const startIndex = selectedNoteIndex !== null ? selectedNoteIndex : 0
    setCurrentNoteIndex(startIndex)
    resetJudgment()
    setHasInputForCurrentNote(false)
    ballPassedNote.current = false
    actualBallPosition.current = notePositions[0] || { x: 0, y: 0 }
    resetDeathSystem()
    setPropertyPanelVisible(false)
    setLeftToolbarVisible(false) // 游戏开始时折叠左工具栏

    console.log(`Game started in ${autoPlay ? "auto" : "manual"} mode, starting at note ${startIndex}`)
    console.log(`Total note positions: ${notePositions.length}`)
  }

  const stopGame = () => {
    setIsPlaying(false)
    stopAudio()
  }

  const resetGame = () => {
    stopGame()
    setCurrentNoteIndex(0)
    resetJudgment()
    setHasInputForCurrentNote(false)
    ballPassedNote.current = false
    actualBallPosition.current = notePositions[0] || { x: 0, y: 0 }
    resetDeathSystem()
  }

  // 检查玩家死亡
  useEffect(() => {
    if (isPlayerDead && isPlaying && !invincibleMode) {
      stopGame()
      alert("Game Over! Too many misses/empty hits.")
    }
  }, [isPlayerDead, isPlaying, invincibleMode])

  // 计算实际物量数量
  const actualNoteCount = Math.max(0, notePositions.length - 1)
  const bpm = levelData?.property?.song?.bpm || 120
  const failureWindow = getFailureWindow(bpm)

  return (
    <div className="editor-container">
      <Canvas
        camera={{
          position: [0, 0, 500],
          fov: 75,
          near: 1,
          far: 10000,
        }}
        style={{ background: "#1a1a1a" }}
        gl={{ antialias: true, alpha: false }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <Scene
          notePositions={notePositions}
          currentNoteIndex={currentNoteIndex}
          isPlaying={isPlaying}
          onInput={handleInput}
          onDistanceCheck={handleDistanceCheck}
          lastJudgment={lastJudgment}
          judgmentPosition={judgmentPosition}
          onBallPositionUpdate={handleBallPositionUpdate}
          autoPlay={autoPlay}
          onAutoTrigger={handleAutoTrigger}
          selectedNoteIndex={selectedNoteIndex}
          onNoteClick={handleNoteClick}
          onInsertNote={handleInsertNote}
          onBackgroundClick={handleBackgroundClick}
          ballPosition={ballPosition}
          levelData={levelData}
        />
      </Canvas>

      {isCountingDown && <CountdownOverlay countdown={countdown} bpm={bpm} ballPosition={ballPosition} />}

      {/* 左侧工具栏 - 始终渲染，通过CSS控制显示/隐藏 */}
      <LeftToolbar
        isVisible={leftToolbarVisible && !isPlaying}
        onToggle={() => setLeftToolbarVisible(!leftToolbarVisible)}
        levelData={levelData}
        onUpdateLevelData={setLevelData}
        actualNoteCount={actualNoteCount}
        score={score}
        combo={combo}
        currentNoteIndex={currentNoteIndex}
        selectedNoteIndex={selectedNoteIndex}
        isPlaying={isPlaying}
        deathCount={deathCount}
        failureWindow={failureWindow}
        audioReady={audioReady}
        audioLoading={audioLoading}
        audioError={audioError}
      />

      <UIPanel
        levelData={levelData}
        actualNoteCount={actualNoteCount}
        score={score}
        combo={combo}
        currentNoteIndex={currentNoteIndex}
        selectedNoteIndex={selectedNoteIndex}
        isPlaying={isPlaying}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        invincibleMode={invincibleMode}
        setInvincibleMode={setInvincibleMode}
        deathCount={deathCount}
        failureWindow={failureWindow}
        audioReady={audioReady}
        audioLoading={audioLoading}
        audioError={audioError}
        isCountingDown={isCountingDown}
        onStartGame={startGame}
        onStopGame={stopGame}
        onResetGame={resetGame}
        onLoadDefaultLevel={loadDefaultLevel}
        onFileUpload={handleFileUpload}
        onAudioUpload={handleAudioUpload}
        onSaveLevel={saveLevel}
        onSelectFirstNote={handleSelectFirstNote}
        onNavigateHome={() => navigate("/home")}
      />

      <PropertyPanel
        selectedNote={selectedNoteIndex}
        levelData={levelData}
        onUpdateNote={handleUpdateNote}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        isVisible={propertyPanelVisible && !isPlaying}
        onToggleVisibility={() => setPropertyPanelVisible(!propertyPanelVisible)}
      />
    </div>
  )
}

export default Editor
