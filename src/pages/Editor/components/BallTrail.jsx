"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { BufferGeometry, BufferAttribute, AdditiveBlending } from "three"

function BallTrail({ ballPosition, isPlaying }) {
  const trailRef = useRef()
  const materialRef = useRef()
  const trailPoints = useRef([])
  const maxTrailLength = 60
  const trailLifetime = 0.5 // 增加拖尾持续时间
  const lastBallPosition = useRef({ x: 0, y: 0 })
  const isInitialized = useRef(false)

  // 创建拖尾几何体
  const trailGeometry = useMemo(() => {
    const geometry = new BufferGeometry()

    // 初始化位置和透明度属性
    const positions = new Float32Array(maxTrailLength * 3)
    const alphas = new Float32Array(maxTrailLength)
    const colors = new Float32Array(maxTrailLength * 3)

    // 初始化所有点
    for (let i = 0; i < maxTrailLength; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      alphas[i] = 0
      // 设置颜色为绿色
      colors[i * 3] = 0.0 // R
      colors[i * 3 + 1] = 1.0 // G
      colors[i * 3 + 2] = 0.53 // B
    }

    geometry.setAttribute("position", new BufferAttribute(positions, 3))
    geometry.setAttribute("alpha", new BufferAttribute(alphas, 1))
    geometry.setAttribute("color", new BufferAttribute(colors, 3))

    return geometry
  }, [])

  // 创建自定义材质
  const trailMaterial = useMemo(() => {
    return {
      size: 10,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      sizeAttenuation: true,
      blending: AdditiveBlending,
      depthWrite: false,
      depthTest: false, // 禁用深度测试，确保拖尾总是可见
    }
  }, [])

  // 重置拖尾
  useEffect(() => {
    if (!isPlaying) {
      trailPoints.current = []
      isInitialized.current = false
      lastBallPosition.current = { x: 0, y: 0 }
    } else {
      // 游戏开始时初始化
      if (ballPosition && !isInitialized.current) {
        lastBallPosition.current = { ...ballPosition }
        isInitialized.current = true
      }
    }
  }, [isPlaying, ballPosition])

  useFrame((state, delta) => {
    if (!isPlaying || !ballPosition || !trailRef.current) return

    const currentTime = state.clock.elapsedTime

    // 检查球是否移动了
    const moved =
      Math.abs(ballPosition.x - lastBallPosition.current.x) > 0.1 ||
      Math.abs(ballPosition.y - lastBallPosition.current.y) > 0.1

    // 只有当球移动时才添加新的拖尾点
    if (moved) {
      // 添加新的拖尾点
      trailPoints.current.unshift({
        x: ballPosition.x,
        y: ballPosition.y,
        z: 0,
        time: currentTime,
      })

      // 更新上次位置
      lastBallPosition.current = { ...ballPosition }
    }

    // 移除过期的拖尾点
    trailPoints.current = trailPoints.current.filter((point) => currentTime - point.time < trailLifetime)

    // 限制拖尾长度
    if (trailPoints.current.length > maxTrailLength) {
      trailPoints.current = trailPoints.current.slice(0, maxTrailLength)
    }

    // 更新几何体
    const positions = trailGeometry.attributes.position.array
    const alphas = trailGeometry.attributes.alpha.array
    const colors = trailGeometry.attributes.color.array

    // 清空所有点
    for (let i = 0; i < maxTrailLength; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      alphas[i] = 0
      colors[i * 3] = 0.0
      colors[i * 3 + 1] = 1.0
      colors[i * 3 + 2] = 0.53
    }

    // 更新有效的拖尾点
    const pointCount = Math.min(trailPoints.current.length, maxTrailLength)
    for (let i = 0; i < pointCount; i++) {
      const point = trailPoints.current[i]
      const age = currentTime - point.time
      const normalizedAge = age / trailLifetime

      // 使用更平滑的衰减曲线
      const alpha = Math.max(0, Math.pow(1 - normalizedAge, 1.5)) * 0.8

      positions[i * 3] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = point.z
      alphas[i] = alpha

      // 根据年龄调整颜色强度
      const intensity = alpha * 0.9 + 0.1
      colors[i * 3] = 0.0
      colors[i * 3 + 1] = intensity
      colors[i * 3 + 2] = intensity * 0.53
    }

    // 强制更新几何体属性
    if (trailGeometry.attributes.position) {
      trailGeometry.attributes.position.needsUpdate = true
    }
    if (trailGeometry.attributes.alpha) {
      trailGeometry.attributes.alpha.needsUpdate = true
    }
    if (trailGeometry.attributes.color) {
      trailGeometry.attributes.color.needsUpdate = true
    }

    // 设置绘制范围
    trailGeometry.setDrawRange(0, pointCount)

    // 确保材质始终可见
    if (materialRef.current) {
      materialRef.current.opacity = pointCount > 0 ? 0.9 : 0
      materialRef.current.needsUpdate = true
    }
  })

  if (!isPlaying) return null

  return (
    <points ref={trailRef} geometry={trailGeometry} renderOrder={0} frustumCulled={false}>
      <pointsMaterial ref={materialRef} {...trailMaterial} />
    </points>
  )
}

export default BallTrail
