"use client"

import { useRef, useCallback, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { easeOutCubic } from "../utils/levelUtils"

function CameraControls({ isPlaying, selectedNoteIndex, notePositions, ballPosition }) {
  const { camera, gl } = useThree()
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const cameraAnimation = useRef({
    isAnimating: false,
    startTime: 0,
    startPos: { x: 0, y: 0, z: 500 },
    targetPos: { x: 0, y: 0, z: 500 },
  })

  // 摄像机跟随球
  useFrame((state) => {
    if (isPlaying && ballPosition && !isDragging.current && !cameraAnimation.current.isAnimating) {
      const targetX = ballPosition.x
      const targetY = ballPosition.y
      const currentX = camera.position.x
      const currentY = camera.position.y

      const followSpeed = 0.08
      camera.position.x += (targetX - currentX) * followSpeed
      camera.position.y += (targetY - currentY) * followSpeed
    }

    // 处理摄像机动画
    if (cameraAnimation.current.isAnimating) {
      const elapsed = state.clock.elapsedTime - cameraAnimation.current.startTime
      const duration = 1.0

      if (elapsed < duration) {
        const progress = easeOutCubic(elapsed / duration)
        const start = cameraAnimation.current.startPos
        const target = cameraAnimation.current.targetPos

        camera.position.x = start.x + (target.x - start.x) * progress
        camera.position.y = start.y + (target.y - start.y) * progress
        camera.position.z = start.z + (target.z - start.z) * progress
      } else {
        const target = cameraAnimation.current.targetPos
        camera.position.set(target.x, target.y, target.z)
        cameraAnimation.current.isAnimating = false
      }
    }
  })

  const moveCameraToNote = useCallback(
    (noteIndex) => {
      if (noteIndex >= 0 && noteIndex < notePositions.length) {
        const targetNote = notePositions[noteIndex]
        console.log(`Moving camera to note ${noteIndex} at position:`, targetNote) // 调试日志

        cameraAnimation.current = {
          isAnimating: true,
          startTime: performance.now() / 1000,
          startPos: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
          targetPos: { x: targetNote.x, y: targetNote.y, z: camera.position.z },
        }
      }
    },
    [notePositions, camera],
  )

  // 立即移动摄像机到指定物量（无动画）
  const snapCameraToNote = useCallback(
    (noteIndex) => {
      if (noteIndex >= 0 && noteIndex < notePositions.length) {
        const targetNote = notePositions[noteIndex]
        console.log(`Snapping camera to note ${noteIndex} at position:`, targetNote) // 调试日志

        // 停止当前动画
        cameraAnimation.current.isAnimating = false

        // 立即设置摄像机位置
        camera.position.set(targetNote.x, targetNote.y, camera.position.z)
      }
    },
    [notePositions, camera],
  )

  // 当选中物量发生变化时移动摄像机
  useEffect(() => {
    if (selectedNoteIndex !== null && selectedNoteIndex !== -1 && !isPlaying) {
      console.log(`Selected note changed to: ${selectedNoteIndex}`) // 调试日志
      // 使用立即移动而不是动画，确保摄像机位置正确关联
      snapCameraToNote(selectedNoteIndex)
    }
  }, [selectedNoteIndex, snapCameraToNote, isPlaying])

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (event) => {
      if (isPlaying) return
      isDragging.current = true
      previousMousePosition.current = { x: event.clientX, y: event.clientY }
      canvas.style.cursor = "grabbing"
      cameraAnimation.current.isAnimating = false
    }

    const handleMouseMove = (event) => {
      if (!isDragging.current || isPlaying) return

      const deltaX = event.clientX - previousMousePosition.current.x
      const deltaY = event.clientY - previousMousePosition.current.y

      const moveSpeed = camera.position.z / 500
      camera.position.x -= deltaX * moveSpeed
      camera.position.y += deltaY * moveSpeed

      previousMousePosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isDragging.current = false
      canvas.style.cursor = "default"
    }

    const handleWheel = (event) => {
      event.preventDefault()
      const zoomSpeed = 0.1
      const zoomFactor = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed

      const newZ = Math.max(50, Math.min(5000, camera.position.z * zoomFactor))
      camera.position.z = newZ
      cameraAnimation.current.isAnimating = false
    }

    // 触摸事件
    let lastTouchDistance = 0

    const handleTouchStart = (event) => {
      if (isPlaying) return
      event.preventDefault()

      if (event.touches.length === 1) {
        isDragging.current = true
        previousMousePosition.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
        cameraAnimation.current.isAnimating = false
      } else if (event.touches.length === 2) {
        isDragging.current = false
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        lastTouchDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
        )
      }
    }

    const handleTouchMove = (event) => {
      if (isPlaying) return
      event.preventDefault()

      if (event.touches.length === 1 && isDragging.current) {
        const touch = event.touches[0]
        const deltaX = touch.clientX - previousMousePosition.current.x
        const deltaY = touch.clientY - previousMousePosition.current.y

        const moveSpeed = camera.position.z / 500
        camera.position.x -= deltaX * moveSpeed
        camera.position.y += deltaY * moveSpeed

        previousMousePosition.current = { x: touch.clientX, y: touch.clientY }
      } else if (event.touches.length === 2) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
        )

        if (lastTouchDistance > 0) {
          const zoomFactor = currentDistance / lastTouchDistance
          const newZ = Math.max(50, Math.min(5000, camera.position.z / zoomFactor))
          camera.position.z = newZ
          cameraAnimation.current.isAnimating = false
        }

        lastTouchDistance = currentDistance
      }
    }

    const handleTouchEnd = (event) => {
      if (event.touches.length === 0) {
        isDragging.current = false
        lastTouchDistance = 0
      }
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove)
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("wheel", handleWheel)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [camera, gl, isPlaying])

  // 暴露摄像机控制方法
  useEffect(() => {
    // 将方法挂载到全局，供其他组件调用
    window.cameraControls = {
      moveCameraToNote,
      snapCameraToNote,
    }

    return () => {
      delete window.cameraControls
    }
  }, [moveCameraToNote, snapCameraToNote])

  return null
}

export default CameraControls
