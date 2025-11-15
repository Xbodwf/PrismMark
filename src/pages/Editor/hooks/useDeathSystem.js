"use client"

import { useState, useCallback } from "react"
import { JUDGMENT_TYPES } from "../constants/judgmentTypes"

export const useDeathSystem = () => {
  const [recentJudgments, setRecentJudgments] = useState([])
  const [deathCount, setDeathCount] = useState(0)

  // 计算失败窗口大小
  const getFailureWindow = useCallback((bpm) => {
    return 10 + Math.floor(bpm / 400)
  }, [])

  // 检查是否为失败判定
  const isFailureJudgment = useCallback((judgment) => {
    return judgment === JUDGMENT_TYPES.MISS || judgment === JUDGMENT_TYPES.EMPTY_HIT
  }, [])

  // 添加判定
  const addJudgment = useCallback(
    (judgment, bpm) => {
      const windowSize = getFailureWindow(bpm)

      setRecentJudgments((prev) => {
        const newJudgments = [...prev, judgment]

        // 保持窗口大小
        if (newJudgments.length > windowSize) {
          newJudgments.shift()
        }

        // 检查失败次数
        const failureCount = newJudgments.filter((j) => isFailureJudgment(j)).length

        if (failureCount >= 3) {
          setDeathCount((prevCount) => prevCount + 1)
          // 清空判定历史，重新开始计算
          return []
        }

        return newJudgments
      })
    },
    [getFailureWindow, isFailureJudgment],
  )

  // 检查玩家是否死亡
  const isPlayerDead = recentJudgments.filter((j) => isFailureJudgment(j)).length >= 3

  // 重置死亡系统
  const resetDeathSystem = useCallback(() => {
    setRecentJudgments([])
    setDeathCount(0)
  }, [])

  return {
    isPlayerDead,
    deathCount,
    addJudgment,
    resetDeathSystem,
    getFailureWindow,
  }
}
