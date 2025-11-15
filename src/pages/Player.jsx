"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import { Play, Pause, RotateCcw, ArrowLeft, Bot, Shield } from "lucide-react"
import Scene from "./Editor/components/Scene"
import CountdownOverlay from "./Editor/components/CountdownOverlay"
import { TUTORIAL_LEVELS } from "./Tutorial/tutorialLevels"
import { calculateNotePositions } from "./Editor/utils/levelUtils"
import { useGameState } from "./Editor/hooks/useGameState"
import { useDeathSystem } from "./Editor/hooks/useDeathSystem"
import { useAudioSystem } from "./Editor/hooks/useAudioSystem"
import { useJudgmentSystem } from "./Editor/hooks/useJudgmentSystem"
import { useHitsoundSystem } from "./Editor/hooks/useHitsoundSystem"
import "./Player.css"

function Player() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tutorialId = searchParams.get("tutorial")

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
  const [levelData, setLevelData] = useState(null)
  const [notePositions, setNotePositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 跟踪玩家输入状态
  const [hasInputForCurrentNote, setHasInputForCurrentNote] = useState(false)
  const wasInRange = useRef(false)
  const actualBallPosition = useRef({ x: 0, y: 0 })
  const lastCheckTime = useRef(0)
  const missCheckTimeout = useRef(null)

  // 请求全屏
  const requestFullscreen = useCallback(() => {
    try {
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(console.error)
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    } catch (error) {
      console.log("Fullscreen not supported")
    }
  }, [])

  // 加载教程关卡
  useEffect(() => {
    if (tutorialId) {
      const tutorial = TUTORIAL_LEVELS.find((t) => t.id === tutorialId)
      if (tutorial) {
        setLevelData(tutorial)
        setLoading(false)
      } else {
        setError("Tutorial not found")
        setLoading(false)
      }
    } else {
      setError("No tutorial specified")
      setLoading(false)
    }
  }, [tutorialId])

  // 处理关卡数据变化
  useEffect(() => {
    if (levelData) {
      console.log("Loading tutorial level:", levelData.name)

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

      // 延迟请求全屏
      setTimeout(() => {
        requestFullscreen()
      }, 1000)
    }
  }, [levelData, loadAudio, resetAudio, setHitsoundVolume, requestFullscreen])

  // 当前物量索引变化时重置状态
  useEffect(() => {
    setHasInputForCurrentNote(false)
    wasInRange.current = false
    lastCheckTime.current = performance.now()

    if (missCheckTimeout.current) {
      clearTimeout(missCheckTimeout.current)
      missCheckTimeout.current = null
    }

    console.log(`Current note index changed to: ${currentNoteIndex}`)
  }, [currentNoteIndex])

  // 判定完成回调
  const handleJudgmentComplete = useCallback(
    (result) => {
      console.log(`Judgment completed: ${result.judgment}, advancing to next note`)

      playHitsound()

      const bpm = levelData?.property?.song?.bpm || 120
      addJudgment(result.judgment, bpm)

      if (missCheckTimeout.current) {
        clearTimeout(missCheckTimeout.current)
        missCheckTimeout.current = null
      }

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
    (distance, ballPos) => {
      if (!isPlaying || currentNoteIndex >= notePositions.length) return

      actualBallPosition.current = ballPos

      if (!autoPlay && !hasInputForCurrentNote && currentNoteIndex > 0) {
        const currentTime = performance.now()
        const inRange = isInJudgmentRange(ballPos, notePositions[currentNoteIndex])

        if (wasInRange.current && !inRange && currentTime - lastCheckTime.current > 300) {
          console.log(`Auto TOO_SLOW for note ${currentNoteIndex}`)
          setHasInputForCurrentNote(true)
          checkTooSlowJudgment(ballPos, notePositions[currentNoteIndex], currentNoteIndex, handleJudgmentComplete)
        } else if (!inRange && distance > 150 && currentTime - lastCheckTime.current > 1000) {
          if (!missCheckTimeout.current) {
            missCheckTimeout.current = setTimeout(() => {
              if (!hasInputForCurrentNote && isPlaying && currentNoteIndex < notePositions.length) {
                console.log(`Auto MISS for note ${currentNoteIndex} - too far and timeout`)
                setHasInputForCurrentNote(true)
                executeMissJudgment(ballPos, notePositions[currentNoteIndex], currentNoteIndex, handleJudgmentComplete)
              }
              missCheckTimeout.current = null
            }, 500)
          }
        }

        wasInRange.current = inRange
      }
    },
    [
      isPlaying,
      currentNoteIndex,
      notePositions,
      hasInputForCurrentNote,
      autoPlay,
      isInJudgmentRange,
      checkTooSlowJudgment,
      executeMissJudgment,
      handleJudgmentComplete,
    ],
  )

  // 处理输入
  const handleInput = useCallback(() => {
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
      executeJudgment(actualBallPosition.current, targetPosition, currentNoteIndex, handleJudgmentComplete)
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
      executeJudgment(actualBallPosition.current, targetPosition, currentNoteIndex, handleJudgmentComplete)
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

  const handleAutoTrigger = useCallback(() => {
    console.log(`Auto trigger called for note ${currentNoteIndex}`)
    handleInput()
  }, [handleInput, currentNoteIndex])

  const handleBallPositionUpdate = useCallback(
    (position) => {
      setBallPosition(position)
      actualBallPosition.current = position
    },
    [setBallPosition],
  )

  // 游戏控制
  const startGame = async () => {
    if (!audioReady && levelData?.property?.song?.href) {
      alert("Please wait for audio to load before starting the game.")
      return
    }

    const bpm = levelData?.property?.song?.bpm || 120
    const offset = levelData?.property?.song?.offset || 0

    await startCountdown(bpm, offset)

    setIsPlaying(true)
    setCurrentNoteIndex(0)
    resetJudgment()
    setHasInputForCurrentNote(false)
    wasInRange.current = false
    lastCheckTime.current = performance.now()
    actualBallPosition.current = notePositions[0] || { x: 0, y: 0 }
    resetDeathSystem()

    if (missCheckTimeout.current) {
      clearTimeout(missCheckTimeout.current)
      missCheckTimeout.current = null
    }

    console.log(`Game started in ${autoPlay ? "auto" : "manual"} mode`)
    console.log(`Total note positions: ${notePositions.length}`)
  }

  const stopGame = () => {
    setIsPlaying(false)
    stopAudio()

    if (missCheckTimeout.current) {
      clearTimeout(missCheckTimeout.current)
      missCheckTimeout.current = null
    }
  }

  const resetGame = () => {
    stopGame()
    setCurrentNoteIndex(0)
    resetJudgment()
    setHasInputForCurrentNote(false)
    wasInRange.current = false
    lastCheckTime.current = performance.now()
    actualBallPosition.current = notePositions[0] || { x: 0, y: 0 }
    resetDeathSystem()
  }

  // 检查玩家死亡
  useEffect(() => {
    if (isPlayerDead && isPlaying && !invincibleMode) {
      stopGame()
      alert("Game Over! Too many misses/empty hits. Try enabling invincible mode to practice!")
    }
  }, [isPlayerDead, isPlaying, invincibleMode])

  // 清理超时
  useEffect(() => {
    return () => {
      if (missCheckTimeout.current) {
        clearTimeout(missCheckTimeout.current)
      }
    }
  }, [])

  // 返回导航
  const handleBack = () => {
    if (isPlaying) {
      stopGame()
    }
    navigate("/guide")
  }

  // 加载状态
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading Tutorial</div>
        <div className="loading-subtitle">Preparing your tutorial experience...</div>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="loading-overlay">
        <div className="loading-text" style={{ color: "#ff6666" }}>
          Error
        </div>
        <div className="loading-subtitle">{error}</div>
        <button
          className="player-btn primary"
          style={{
            marginTop: "20px",
            position: "static",
            width: "auto",
            height: "auto",
            padding: "10px 20px",
            borderRadius: "8px",
          }}
          onClick={handleBack}
        >
          Back to Guide
        </button>
      </div>
    )
  }

  // 计算实际物量数量
  const actualNoteCount = Math.max(0, notePositions.length - 1)
  const bpm = levelData?.property?.song?.bpm || 120
  const failureWindow = getFailureWindow(bpm)

  return (
    <div className="player-container">
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
          selectedNoteIndex={null}
          onNoteClick={() => {}}
          onBackgroundClick={() => {}}
          ballPosition={ballPosition}
          levelData={levelData}
        />
      </Canvas>

      {isCountingDown && <CountdownOverlay countdown={countdown} bpm={bpm} ballPosition={ballPosition} />}

      {/* UI 控制面板 */}
      <div className="player-ui">
        {/* 左上角信息 */}
        <div className="player-info">
          <h3>{levelData?.name || "Tutorial"}</h3>
          <p>Difficulty: {levelData?.difficulty || "Unknown"}</p>
          <p>BPM: {levelData?.property?.song?.bpm || 120}</p>
          <p>Notes: {actualNoteCount}</p>
          <p>Score: {score}</p>
          <p>Combo: {combo}</p>
          <p>
            Progress: {Math.max(0, currentNoteIndex - 1)}/{actualNoteCount}
          </p>
          {deathCount > 0 && <p style={{ fontSize: "0.8em", color: "#ff6666" }}>Deaths: {deathCount}</p>}

          {/* 音频状态显示 */}
          {audioLoading && <p style={{ fontSize: "0.8em", color: "#ffaa00" }}>Loading Audio...</p>}
          {audioError && <p style={{ fontSize: "0.8em", color: "#ff6666" }}>Audio Error: {audioError}</p>}
          {audioReady && <p style={{ fontSize: "0.8em", color: "#00ff88" }}>Audio Ready</p>}

          {!isPlaying && <p style={{ fontSize: "0.8em", color: "#888" }}>Click anywhere or press any key to play</p>}
        </div>

        {/* 左下角控制 */}
        <div className="player-controls">
          <button
            className={`player-btn ${isPlaying ? "" : "primary"}`}
            onClick={isPlaying ? stopGame : startGame}
            disabled={isCountingDown}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {!isPlaying && !isCountingDown && (
            <button className="player-btn" onClick={resetGame}>
              <RotateCcw size={24} />
            </button>
          )}
        </div>

        {/* 右下角模式选择 */}
        {!isPlaying && !isCountingDown && (
          <div className="player-modes">
            <button
              className={`mode-btn ${invincibleMode ? "active" : ""}`}
              onClick={() => setInvincibleMode(!invincibleMode)}
              title="Invincible Mode - Practice without failing"
            >
              <Shield size={20} />
            </button>

            <button
              className={`mode-btn ${autoPlay ? "active" : ""}`}
              onClick={() => setAutoPlay(!autoPlay)}
              title="Auto Play - Watch the perfect performance"
            >
              <Bot size={20} />
            </button>
          </div>
        )}

        {/* 返回按钮 */}
        <button className="player-back" onClick={handleBack}>
          <ArrowLeft size={16} style={{ marginRight: "8px" }} />
          Back to Guide
        </button>
      </div>
    </div>
  )
}

export default Player
