"use client"

import { useEffect } from "react"
import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"

const DIRECTION_BUTTONS = [
  { key: "q", direction: "NW", offset: [-1, 1], label: "Q", angle: 135 }, // 左上
  { key: "w", direction: "N", offset: [0, 1], label: "W", angle: 90 }, // 上
  { key: "e", direction: "NE", offset: [1, 1], label: "E", angle: 45 }, // 右上
  { key: "r", direction: "E", offset: [1, 0], label: "R", angle: 0 }, // 右
  { key: "t", direction: "SE", offset: [1, -1], label: "T", angle: 315 }, // 右下
  { key: "y", direction: "S", offset: [0, -1], label: "Y", angle: 270 }, // 下
  { key: "u", direction: "SW", offset: [-1, -1], label: "U", angle: 225 }, // 左下
  { key: "i", direction: "W", offset: [-1, 0], label: "I", angle: 180 }, // 左
]

function DirectionButtons({ position, onInsertNote, visible }) {
  const { camera } = useThree()

  useEffect(() => {
    if (!visible) return

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()
      const button = DIRECTION_BUTTONS.find((btn) => btn.key === key)
      if (button) {
        event.preventDefault()
        onInsertNote(button.offset)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [visible, onInsertNote])

  if (!visible) return null

  // 根据摄像机距离计算按钮大小和距离
  const cameraDistance = camera.position.z
  const baseDistance = 60
  const baseSize = 32

  // 距离和大小都随摄像机缩放调整
  const scaleFactor = Math.max(0.5, Math.min(2, cameraDistance / 500))
  const distance = baseDistance * scaleFactor
  const buttonSize = baseSize * scaleFactor

  return (
    <group position={[position.x, position.y, 1]}>
      {DIRECTION_BUTTONS.map((button) => {
        // 修正角度计算 - 使用正确的坐标系
        // 在Three.js中，Y轴向上为正，所以需要调整角度
        const angleRad = (button.angle * Math.PI) / 180
        const x = Math.cos(angleRad) * distance
        const y = Math.sin(angleRad) * distance

        return (
          <group key={button.key} position={[x, y, 0]}>
            <Html center>
              <button
                className="direction-button"
                onClick={() => onInsertNote(button.offset)}
                title={`Insert note ${button.direction} (${button.key.toUpperCase()})`}
                style={{
                  width: `${buttonSize}px`,
                  height: `${buttonSize}px`,
                  fontSize: `${Math.max(10, buttonSize * 0.375)}px`, // 动态字体大小
                }}
              >
                {button.label}
              </button>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

export default DirectionButtons
