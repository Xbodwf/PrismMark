"use client"

import React from "react"

import { useMemo, useRef, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { CircleGeometry, RingGeometry, Matrix4, Frustum, Vector3, Sphere } from "three"
import JudgmentDisplay from "./JudgmentDisplay"
import DirectionButtons from "./DirectionButtons"

// 创建不同LOD级别的几何体
const createGeometries = () => {
  return {
    high: {
      circle: new CircleGeometry(15, 32),
      ring: new RingGeometry(13, 15, 32),
      highlight: new RingGeometry(18, 22, 32),
    },
    medium: {
      circle: new CircleGeometry(15, 16),
      ring: new RingGeometry(13, 15, 16),
      highlight: new RingGeometry(18, 22, 16),
    },
    low: {
      circle: new CircleGeometry(15, 8),
      ring: new RingGeometry(13, 15, 8),
      highlight: new RingGeometry(18, 22, 8),
    },
  }
}

// 视锥体剔除函数
const isInFrustum = (position, camera, margin = 100) => {
  const frustum = new Frustum()
  const matrix = new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
  frustum.setFromProjectionMatrix(matrix)

  const sphere = new Sphere(new Vector3(position.x, position.y, 0), margin)
  return frustum.intersectsSphere(sphere)
}

// 获取LOD级别
const getLODLevel = (distance) => {
  if (distance < 300) return "high"
  if (distance < 800) return "medium"
  return "low"
}

// 获取物量颜色配置
const getNoteColors = (levelData) => {
  const defaultColors = {
    normal: "#ffb3d9",
    start: "#ff4444",
    current: "#00ff88",
    selected: "#ffff00",
    border: "#ffffff",
  }

  try {
    const railColors = levelData?.property?.level?.defaultRailColor
    if (railColors && Array.isArray(railColors) && railColors.length > 0) {
      const primaryColor = railColors[0]
      const secondaryColor = railColors[1] || railColors[0]

      return {
        normal: primaryColor,
        start: "#ff4444",
        current: secondaryColor,
        selected: "#ffff00",
        border: "#ffffff",
      }
    }
  } catch (error) {
    console.warn("Failed to parse note colors from level data:", error)
  }

  return defaultColors
}

// 单个物量组件（用于需要特殊处理的物量）
const SingleNote = ({
  position,
  index,
  isSelected,
  isCurrent,
  isStart,
  colors,
  lodLevel,
  onNoteClick,
  isPlaying,
  fontSize,
  onInsertNote,
}) => {
  const geometries = useMemo(() => createGeometries(), [])
  const meshRef = useRef()

  const handleNoteClick = (event) => {
    event.stopPropagation()
    console.log(`Single note ${index} clicked`) // 调试日志
    if (!isPlaying && onNoteClick) {
      onNoteClick(index)
    }
  }

  return (
    <group position={[position.x, position.y, 0]}>
      {/* 选中高亮圈 */}
      {isSelected && !isPlaying && (
        <mesh geometry={geometries[lodLevel].highlight}>
          <meshBasicMaterial color={colors.selected} />
        </mesh>
      )}

      {/* 物量圆圈 - 确保可点击 */}
      <mesh
        ref={meshRef}
        geometry={geometries[lodLevel].circle}
        onClick={handleNoteClick}
        onPointerDown={handleNoteClick}
        userData={{ noteIndex: index, clickable: true }}
      >
        <meshBasicMaterial color={isStart ? colors.start : isCurrent ? colors.current : colors.normal} />
      </mesh>

      {/* 物量边框 */}
      <mesh geometry={geometries[lodLevel].ring}>
        <meshBasicMaterial color={colors.border} />
      </mesh>

      {/* 物量编号 - 只在编辑状态下显示 */}
      {!isPlaying && lodLevel === "high" && (
        <Html center>
          <div
            style={{
              color: "white",
              fontSize: `${fontSize}px`,
              fontFamily: "Arial",
              textAlign: "center",
              pointerEvents: "none",
              userSelect: "none",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            {index}
          </div>
        </Html>
      )}

      {/* 方向按钮 - 只在选中且非游戏状态时显示 */}
      <DirectionButtons visible={isSelected && !isPlaying} position={{ x: 0, y: 0 }} onInsertNote={onInsertNote} />
    </group>
  )
}

function Notes({
  notePositions,
  currentNoteIndex,
  isPlaying,
  lastJudgment,
  judgmentPosition,
  selectedNoteIndex,
  onNoteClick,
  onInsertNote,
  levelData,
}) {
  const { camera, raycaster, mouse, gl } = useThree()
  const [lodLevel, setLodLevel] = useState("high")

  // 获取物量颜色配置
  const colors = useMemo(() => getNoteColors(levelData), [levelData])

  // 全局点击处理 - 简化为只处理单个物量
  useEffect(() => {
    const handleClick = (event) => {
      if (isPlaying || !onNoteClick) return

      // 更新鼠标位置
      const rect = gl.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // 设置射线
      raycaster.setFromCamera(mouse, camera)

      // 检测所有可点击的物体
      const intersects = raycaster.intersectObjects(gl.domElement.scene?.children || [], true)

      for (const intersect of intersects) {
        if (intersect.object.userData?.clickable && intersect.object.userData?.noteIndex !== undefined) {
          const noteIndex = intersect.object.userData.noteIndex
          console.log(`Global click detected note ${noteIndex}`)
          onNoteClick(noteIndex)
          event.stopPropagation()
          return
        }
      }
    }

    gl.domElement.addEventListener("click", handleClick, true)
    return () => gl.domElement.removeEventListener("click", handleClick, true)
  }, [isPlaying, onNoteClick, raycaster, mouse, camera, gl])

  // LOD计算
  useFrame(() => {
    if (!notePositions.length) return

    const distance = camera.position.z
    const newLodLevel = getLODLevel(distance)

    if (newLodLevel !== lodLevel) {
      setLodLevel(newLodLevel)
    }
  })

  const fontSize = useMemo(() => {
    const distance = camera.position.z
    return Math.max(8, Math.min(20, 12 * (500 / distance)))
  }, [camera.position.z])

  // 渲染所有物量为单个组件，确保点击检测正常工作
  return (
    <group>
      {notePositions.map((position, index) => {
        // 视锥体剔除
        if (!isInFrustum(position, camera, 50)) return null

        const isSelected = selectedNoteIndex === index
        const isCurrent = index === currentNoteIndex && isPlaying
        const isStart = index === 0

        return (
          <SingleNote
            key={`note-${index}`}
            position={position}
            index={index}
            isSelected={isSelected}
            isCurrent={isCurrent}
            isStart={isStart}
            colors={colors}
            lodLevel={lodLevel}
            onNoteClick={onNoteClick}
            isPlaying={isPlaying}
            fontSize={fontSize}
            onInsertNote={(offset) => onInsertNote(index, offset)}
          />
        )
      })}

      <JudgmentDisplay position={judgmentPosition} judgment={lastJudgment} visible={isPlaying && lastJudgment !== ""} />
    </group>
  )
}

export default React.memo(Notes)
