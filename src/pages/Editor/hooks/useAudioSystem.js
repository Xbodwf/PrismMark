"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export const useAudioSystem = () => {
  const [audioReady, setAudioReady] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const [audioError, setAudioError] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const [isCountingDown, setIsCountingDown] = useState(false)

  const audioRef = useRef(null)
  const countdownTimerRef = useRef(null)

  // 加载音频
  const loadAudio = useCallback(async (audioPath, volume = 1.0) => {
    if (!audioPath) {
      setAudioReady(true)
      return true
    }

    setAudioLoading(true)
    setAudioError(null)

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const audio = new Audio()
      audioRef.current = audio

      audio.volume = Math.max(0, Math.min(1, volume))
      audio.preload = "auto"

      const loadPromise = new Promise((resolve, reject) => {
        const handleCanPlayThrough = () => {
          audio.removeEventListener("canplaythrough", handleCanPlayThrough)
          audio.removeEventListener("error", handleError)
          resolve()
        }

        const handleError = () => {
          audio.removeEventListener("canplaythrough", handleCanPlayThrough)
          audio.removeEventListener("error", handleError)
          reject(new Error("Failed to load audio"))
        }

        audio.addEventListener("canplaythrough", handleCanPlayThrough)
        audio.addEventListener("error", handleError)
      })

      audio.src = audioPath
      audio.load()

      await loadPromise
      setAudioReady(true)
      setAudioLoading(false)
      return true
    } catch (error) {
      console.error("Audio loading error:", error)
      setAudioError(error.message)
      setAudioLoading(false)
      setAudioReady(false)
      return false
    }
  }, [])

  // 开始倒计时 - 修复BPM重置问题
  const startCountdown = useCallback((bpm, offset = 0) => {
    console.log(`Starting countdown with BPM: ${bpm}, offset: ${offset}`) // 调试日志

    return new Promise((resolve) => {
      setIsCountingDown(true)
      setCountdown(3)

      // 确保使用传入的BPM值
      const beatInterval = (60 / bpm) * 1000
      const countdownDuration = beatInterval * 3

      console.log(`Beat interval: ${beatInterval}ms, countdown duration: ${countdownDuration}ms`) // 调试日志

      // 计算音频开始时间
      const audioStartDelay = Math.max(0, countdownDuration - offset)

      // 如果有音频且需要提前开始
      if (audioRef.current && offset > 0) {
        if (audioStartDelay > 0) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch(console.error)
            }
          }, audioStartDelay)
        } else {
          audioRef.current.currentTime = Math.abs(audioStartDelay) / 1000
          audioRef.current.play().catch(console.error)
        }
      }

      // 倒计时逻辑 - 使用正确的BPM
      let currentCount = 3
      countdownTimerRef.current = setInterval(() => {
        currentCount--
        setCountdown(currentCount)

        if (currentCount <= 0) {
          clearInterval(countdownTimerRef.current)
          setIsCountingDown(false)

          // 如果没有offset但有音频，现在开始播放
          if (audioRef.current && offset === 0) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(console.error)
          }

          resolve()
        }
      }, beatInterval) // 使用正确的beatInterval
    })
  }, [])

  // 停止音频和倒计时
  const stopAudio = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    setIsCountingDown(false)
    setCountdown(0)
  }, [])

  // 重置音频系统
  const resetAudio = useCallback(() => {
    stopAudio()
    setAudioReady(false)
    setAudioError(null)

    if (audioRef.current) {
      audioRef.current = null
    }
  }, [stopAudio])

  // 清理
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return {
    audioReady,
    audioLoading,
    audioError,
    countdown,
    isCountingDown,
    loadAudio,
    startCountdown,
    stopAudio,
    resetAudio,
  }
}
