"use client"

import { useMemo } from "react"
import { useThree } from "@react-three/fiber"

function Grid() {
  const { camera } = useThree()

  const gridLines = useMemo(() => {
    const gridSize = 50
    const lines = []

    // 固定范围的网格，不依赖摄像机位置
    const range = 50

    // 垂直线
    for (let i = -range; i <= range; i++) {
      lines.push(
        <line key={`v${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([i * gridSize, -range * gridSize, 0, i * gridSize, range * gridSize, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#333333" />
        </line>,
      )
    }

    // 水平线
    for (let i = -range; i <= range; i++) {
      lines.push(
        <line key={`h${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-range * gridSize, i * gridSize, 0, range * gridSize, i * gridSize, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#333333" />
        </line>,
      )
    }

    return lines
  }, []) // 移除camera.position依赖，使网格始终可见

  return <group>{gridLines}</group>
}

export default Grid
