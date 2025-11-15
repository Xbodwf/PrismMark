"use client"

import { useMemo } from "react"
import { BufferGeometry, Vector3 } from "three"

function NotePath({ notePositions }) {
  const pathGeometry = useMemo(() => {
    if (notePositions.length < 2) return null

    // 生成所有连接线，不进行视锥体剔除（简化逻辑）
    const points = notePositions.map((pos) => new Vector3(pos.x, pos.y, 0))
    return new BufferGeometry().setFromPoints(points)
  }, [notePositions])

  if (!pathGeometry) return null

  return (
    <line geometry={pathGeometry}>
      <lineBasicMaterial color="#555555" linewidth={2} />
    </line>
  )
}

export default NotePath
