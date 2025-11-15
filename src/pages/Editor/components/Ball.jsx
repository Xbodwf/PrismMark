"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import BallTrail from "./BallTrail"

function Ball({
  isPlaying,
  currentNoteIndex,
  notePositions,
  onPositionUpdate,
  autoPlay,
  onAutoTrigger,
  onDistanceCheck,
}) {
  const meshRef = useRef()
  const currentPosition = useRef({ x: 0, y: 0 })
  const ballTargetIndex = useRef(0)
  const hasTriggeredStart = useRef(false)
  const lastTriggeredNote = useRef(-1)
  const needsPositionCorrection = useRef(false)
  const smoothPosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!isPlaying) {
      if (notePositions.length > 0) {
        currentPosition.current = { x: notePositions[0].x, y: notePositions[0].y }
        smoothPosition.current = { x: notePositions[0].x, y: notePositions[0].y }
        ballTargetIndex.current = 1
        hasTriggeredStart.current = false
        lastTriggeredNote.current = -1
        needsPositionCorrection.current = false
        if (meshRef.current) {
          meshRef.current.position.set(notePositions[0].x, notePositions[0].y, 0)
        }
      }
    } else {
      if (notePositions.length > 0) {
        currentPosition.current = { x: notePositions[0].x, y: notePositions[0].y }
        smoothPosition.current = { x: notePositions[0].x, y: notePositions[0].y }
        ballTargetIndex.current = 1
        hasTriggeredStart.current = false
        lastTriggeredNote.current = -1
        needsPositionCorrection.current = false
        if (meshRef.current) {
          meshRef.current.position.set(notePositions[0].x, notePositions[0].y, 0)
        }
      }
    }
  }, [isPlaying, notePositions])

  // 移除位置校准逻辑，让球自由移动
  useFrame((state, delta) => {
    if (!meshRef.current || !isPlaying || notePositions.length === 0) return

    // 处理第0个物量的自动触发
    if (!hasTriggeredStart.current) {
      hasTriggeredStart.current = true
      if (onAutoTrigger) {
        setTimeout(() => onAutoTrigger(), 50)
      }
    }

    // 如果刚刚进行了位置校准，跳过一帧以确保位置稳定
    if (needsPositionCorrection.current) {
      needsPositionCorrection.current = false
      if (onPositionUpdate) {
        onPositionUpdate({ ...currentPosition.current })
      }
      return
    }

    // 球始终向下一个目标移动，不等待玩家输入
    const targetIndex = Math.min(ballTargetIndex.current, notePositions.length - 1)

    if (targetIndex >= notePositions.length) {
      if (onPositionUpdate) {
        onPositionUpdate({ ...currentPosition.current })
      }
      return
    }

    const target = notePositions[targetIndex]
    if (!target) return

    // 计算到目标的距离
    const dx = target.x - currentPosition.current.x
    const dy = target.y - currentPosition.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 2) {
      // 持续移动向目标
      const speed = 150 * delta
      const moveX = (dx / distance) * speed
      const moveY = (dy / distance) * speed

      currentPosition.current.x += moveX
      currentPosition.current.y += moveY

      // 平滑更新拖尾位置
      smoothPosition.current.x = currentPosition.current.x
      smoothPosition.current.y = currentPosition.current.y
    } else {
      // 到达目标物量
      currentPosition.current = { x: target.x, y: target.y }
      smoothPosition.current = { x: target.x, y: target.y }

      // 自动播放模式：检查是否需要触发判定
      if (autoPlay && targetIndex > 0) {
        if (targetIndex === currentNoteIndex && lastTriggeredNote.current < currentNoteIndex) {
          lastTriggeredNote.current = currentNoteIndex
          if (onAutoTrigger) {
            onAutoTrigger()
          }
        }
      }

      // 移动到下一个目标（球不等待，持续前进）
      ballTargetIndex.current = Math.min(targetIndex + 1, notePositions.length - 1)
    }

    // 更新球的实际位置
    meshRef.current.position.set(currentPosition.current.x, currentPosition.current.y, 0)

    // 实时检查距离
    if (onDistanceCheck && currentNoteIndex < notePositions.length) {
      const judgeTarget = notePositions[currentNoteIndex]
      if (judgeTarget) {
        const judgeDx = judgeTarget.x - currentPosition.current.x
        const judgeDy = judgeTarget.y - currentPosition.current.y
        const judgeDistance = Math.sqrt(judgeDx * judgeDx + judgeDy * judgeDy)

        onDistanceCheck(judgeDistance, { ...currentPosition.current })
      }
    }

    if (onPositionUpdate) {
      onPositionUpdate({ ...smoothPosition.current })
    }
  })

  if (!isPlaying) return null

  return (
    <group>
      {/* 球本体 */}
      <mesh ref={meshRef} renderOrder={2}>
        <circleGeometry args={[10, 32]} />
        <meshBasicMaterial color="#00ff88" transparent={false} depthWrite={true} depthTest={true} />
      </mesh>

      {/* 球的拖尾效果 - 使用平滑位置 */}
      <BallTrail ballPosition={smoothPosition.current} isPlaying={isPlaying} />
    </group>
  )
}

export default Ball
