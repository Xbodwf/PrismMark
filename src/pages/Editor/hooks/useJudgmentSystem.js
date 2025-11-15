"use client"

import { useState, useCallback, useRef } from "react"
import { JudgmentSystem } from "../systems/JudgmentSystem"
import { JUDGMENT_TYPES } from "../constants/judgmentTypes"

export const useJudgmentSystem = () => {
  const [lastJudgment, setLastJudgment] = useState("")
  const [judgmentPosition, setJudgmentPosition] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)

  const judgmentSystem = useRef(new JudgmentSystem())
  const judgmentTimeouts = useRef(new Set())

  // 异步执行判定
  const executeJudgment = useCallback(async (ballPosition, targetPosition, noteIndex, onJudgmentComplete) => {
    console.log(`Executing judgment for note ${noteIndex}, ballPos:`, ballPosition, `targetPos:`, targetPosition)

    return new Promise((resolve) => {
      // 使用 setTimeout 模拟异步判定处理
      setTimeout(() => {
        const result = judgmentSystem.current.executeJudgment(ballPosition, targetPosition, noteIndex)

        console.log(`Judgment result:`, result)

        // 更新UI状态
        setLastJudgment(result.judgment)
        setJudgmentPosition(result.position)

        // 更新分数
        setScore((prev) => {
          const newScore = prev + result.score
          console.log(`Score updated: ${prev} + ${result.score} = ${newScore}`)
          return newScore
        })

        // 更新连击
        if (result.breaksCombo) {
          console.log(`Combo broken at note ${noteIndex}`)
          setCombo(0)
        } else {
          setCombo((prev) => {
            const newCombo = prev + 1
            console.log(`Combo updated: ${prev} + 1 = ${newCombo}`)
            return newCombo
          })
        }

        // 设置判定显示消失时间
        const displayTime = noteIndex === 0 ? 1000 : 1500
        const timeoutId = setTimeout(() => {
          setLastJudgment("")
          judgmentTimeouts.current.delete(timeoutId)
        }, displayTime)

        judgmentTimeouts.current.add(timeoutId)

        // 通知判定完成
        if (onJudgmentComplete) {
          console.log(`Judgment complete for note ${noteIndex}: ${result.judgment}`)
          onJudgmentComplete(result)
        }

        resolve(result)
      }, 16) // 约1帧的延迟，模拟异步处理
    })
  }, [])

  // 异步执行错过判定
  const executeMissedJudgment = useCallback(async (ballPosition, targetPosition, noteIndex, onJudgmentComplete) => {
    console.log(`Executing MISSED judgment for note ${noteIndex} - ball passed the note`)

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          judgment: JUDGMENT_TYPES.MISS,
          distance: judgmentSystem.current.calculateDistance(ballPosition, targetPosition),
          score: 0,
          breaksCombo: true,
          position: { ...targetPosition },
        }

        // 更新UI状态
        setLastJudgment(result.judgment)
        setJudgmentPosition(result.position)

        // 重置连击
        setCombo(0)

        // 设置判定显示消失时间
        const timeoutId = setTimeout(() => {
          setLastJudgment("")
          judgmentTimeouts.current.delete(timeoutId)
        }, 1500)

        judgmentTimeouts.current.add(timeoutId)

        if (onJudgmentComplete) {
          console.log(`MISSED judgment complete for note ${noteIndex}`)
          onJudgmentComplete(result)
        }

        resolve(result)
      }, 16)
    })
  }, [])

  // 异步检查TOO_SLOW判定
  const checkTooSlowJudgment = useCallback(async (ballPosition, targetPosition, noteIndex, onJudgmentComplete) => {
    console.log(`Checking TOO_SLOW for note ${noteIndex}`)

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          judgment: JUDGMENT_TYPES.TOO_SLOW,
          distance: judgmentSystem.current.calculateDistance(ballPosition, targetPosition),
          score: 0,
          breaksCombo: true,
          position: { ...ballPosition },
        }

        // 更新UI状态
        setLastJudgment(result.judgment)
        setJudgmentPosition(result.position)

        // 重置连击
        setCombo(0)

        // 设置判定显示消失时间
        const timeoutId = setTimeout(() => {
          setLastJudgment("")
          judgmentTimeouts.current.delete(timeoutId)
        }, 1500)

        judgmentTimeouts.current.add(timeoutId)

        if (onJudgmentComplete) {
          console.log(`TOO_SLOW judgment complete for note ${noteIndex}`)
          onJudgmentComplete(result)
        }

        resolve(result)
      }, 16)
    })
  }, [])

  // 异步执行MISS判定
  const executeMissJudgment = useCallback(async (ballPosition, targetPosition, noteIndex, onJudgmentComplete) => {
    console.log(`Executing MISS judgment for note ${noteIndex}`)

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          judgment: JUDGMENT_TYPES.MISS,
          distance: judgmentSystem.current.calculateDistance(ballPosition, targetPosition),
          score: 0,
          breaksCombo: true,
          position: { ...ballPosition },
        }

        // 更新UI状态
        setLastJudgment(result.judgment)
        setJudgmentPosition(result.position)

        // 重置连击
        setCombo(0)

        // 设置判定显示消失时间
        const timeoutId = setTimeout(() => {
          setLastJudgment("")
          judgmentTimeouts.current.delete(timeoutId)
        }, 1500)

        judgmentTimeouts.current.add(timeoutId)

        if (onJudgmentComplete) {
          console.log(`MISS judgment complete for note ${noteIndex}`)
          onJudgmentComplete(result)
        }

        resolve(result)
      }, 16)
    })
  }, [])

  // 检查是否在判定范围内
  const isInJudgmentRange = useCallback((ballPosition, targetPosition, maxRange = 100) => {
    return judgmentSystem.current.isInJudgmentRange(ballPosition, targetPosition, maxRange)
  }, [])

  // 重置判定系统
  const resetJudgment = useCallback(() => {
    console.log("Resetting judgment system")
    setLastJudgment("")
    setJudgmentPosition({ x: 0, y: 0 })
    setScore(0)
    setCombo(0)

    // 清除所有超时
    judgmentTimeouts.current.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    judgmentTimeouts.current.clear()
  }, [])

  return {
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
    judgmentSystem: judgmentSystem.current,
  }
}
