"use client"

import { useEffect, useState } from "react"

function CountdownOverlay({ countdown, bpm, ballPosition }) {
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // 计算球的移动动画
    const beatInterval = (60 / bpm) * 1000 // 每拍的时间间隔
    const moveDistance = 50 // 每拍移动的距离

    // 根据倒计时计算球的位置
    const targetX = ballPosition.x + (3 - countdown) * moveDistance
    const targetY = ballPosition.y

    setBallPos({ x: targetX, y: targetY })
  }, [countdown, bpm, ballPosition])

  if (countdown <= 0) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        color: "white",
        fontFamily: "Lexend, sans-serif",
      }}
    >
      {/* 倒计时数字 */}
      <div
        style={{
          fontSize: "8rem",
          fontWeight: "bold",
          color: "#00ff88",
          textShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
          animation: "pulse 1s ease-in-out",
        }}
      >
        {countdown}
      </div>

      {/* 提示文字 */}
      <div
        style={{
          fontSize: "1.5rem",
          marginTop: "20px",
          color: "#ccc",
          textAlign: "center",
        }}
      >
        Get Ready!
        <br />
        <span style={{ fontSize: "1rem", color: "#888" }}>Game will start when countdown reaches 0</span>
      </div>

      {/* CSS动画 */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}

export default CountdownOverlay
