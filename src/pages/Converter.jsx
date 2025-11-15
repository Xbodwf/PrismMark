"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Download, Upload } from "lucide-react"
import JSONParser from "@/utils/LevelParser"
import "./Converter.css"

function Converter() {
  const navigate = useNavigate()
  const [inputData, setInputData] = useState("")
  const [bpm, setBpm] = useState("120")
  const [songName, setSongName] = useState("Converted Track")
  const [artist, setArtist] = useState("Unknown Artist")
  const [outputData, setOutputData] = useState("")
  const [error, setError] = useState("")
  const [stats, setStats] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.body.classList.add("converter-page")
    return () => {
      document.body.classList.remove("converter-page")
    }
  }, [])

  // 基于编辑器球移动机制的路径生成算法
  const generatePathFromTiming = (timeArray, bpm) => {
    if (timeArray.length === 0) return { content: [], addons: [] }

    const content = []
    const addons = []

    // 编辑器中的球移动参数
    const BALL_SPEED = 150 // 像素/秒 (与Ball.jsx中一致)
    const GRID_UNIT = 50 // 网格单位像素 (与levelUtils.js中一致)
    const MIN_OFFSET = 1 // 最小偏移量
    const MAX_OFFSET = 8 // 最大偏移量

    // 排序时间数组并保持原始索引关系
    const timeWithIndex = timeArray.map((time, index) => ({ time, originalIndex: index }))
    timeWithIndex.sort((a, b) => a.time - b.time)

    // 处理相同时间的物量（双押/多押）
    const timeGroups = {}
    timeWithIndex.forEach(({ time, originalIndex }) => {
      if (!timeGroups[time]) {
        timeGroups[time] = []
      }
      timeGroups[time].push(originalIndex)
    })

    const uniqueTimes = Object.keys(timeGroups)
      .map(Number)
      .sort((a, b) => a - b)

    // 当前位置追踪（像素坐标）
    const currentPixelPos = { x: 0, y: 0 }

    for (let i = 0; i < uniqueTimes.length; i++) {
      const timing = uniqueTimes[i] * 1000 // 转换为毫秒
      const noteIndices = timeGroups[uniqueTimes[i]]

      if (i === 0) {
        // 第一个时间点：起始位置
        noteIndices.forEach((originalIndex, noteIndex) => {
          if (noteIndex === 0) {
            // 第一个物量在原点
            content.push({
              positionOffset: [0, 0],
              timing: timing,
              type: "tap",
            })
          } else {
            // 同时间的其他物量，形成双押/多押
            const angle = (noteIndex * 2 * Math.PI) / noteIndices.length
            const offsetX = Math.round(Math.cos(angle) * MIN_OFFSET)
            const offsetY = Math.round(Math.sin(angle) * MIN_OFFSET)

            content.push({
              positionOffset: [offsetX, offsetY],
              timing: timing,
              type: "tap",
            })

            // 更新像素位置
            currentPixelPos.x += offsetX * GRID_UNIT
            currentPixelPos.y += offsetY * GRID_UNIT
          }
        })
      } else {
        // 后续时间点：根据球的移动能力计算位置
        const timeDiff = uniqueTimes[i] - uniqueTimes[i - 1] // 秒

        if (timeDiff > 0) {
          // 计算球在这段时间内能移动的最大距离
          const maxTravelDistance = BALL_SPEED * timeDiff // 像素
          const maxGridDistance = Math.floor(maxTravelDistance / GRID_UNIT)

          // 确保至少移动1个网格单位，但不超过最大限制
          const targetGridDistance = Math.max(MIN_OFFSET, Math.min(maxGridDistance, MAX_OFFSET))

          noteIndices.forEach((originalIndex, noteIndex) => {
            let offsetX, offsetY

            if (noteIndices.length === 1) {
              // 单个物量：生成合理的移动方向
              if (targetGridDistance <= 2) {
                // 短距离：简单移动
                const directions = [
                  [1, 0],
                  [0, 1],
                  [-1, 0],
                  [0, -1],
                  [1, 1],
                  [-1, 1],
                  [1, -1],
                  [-1, -1],
                ]
                const direction = directions[Math.floor(Math.random() * directions.length)]
                offsetX = direction[0] * targetGridDistance
                offsetY = direction[1] * targetGridDistance
              } else {
                // 长距离：随机角度但偏向前进
                const angle = (Math.random() - 0.5) * Math.PI + Math.PI / 2 // 偏向上方
                offsetX = Math.round(Math.cos(angle) * targetGridDistance)
                offsetY = Math.round(Math.sin(angle) * targetGridDistance)
              }
            } else {
              // 多个物量：分散排列
              const baseAngle = (noteIndex * 2 * Math.PI) / noteIndices.length
              const angle = baseAngle + (Math.random() - 0.5) * 0.5 // 添加小幅随机
              offsetX = Math.round(Math.cos(angle) * targetGridDistance)
              offsetY = Math.round(Math.sin(angle) * targetGridDistance)
            }

            // 确保偏移量不为0
            if (offsetX === 0 && offsetY === 0) {
              offsetX = Math.random() > 0.5 ? MIN_OFFSET : -MIN_OFFSET
              offsetY = Math.random() > 0.5 ? MIN_OFFSET : -MIN_OFFSET
            }

            content.push({
              positionOffset: [offsetX, offsetY],
              timing: timing,
              type: "tap",
            })

            // 更新像素位置
            currentPixelPos.x += offsetX * GRID_UNIT
            currentPixelPos.y += offsetY * GRID_UNIT

            // 计算实际移动距离和所需速度
            const actualPixelDistance = Math.sqrt((offsetX * GRID_UNIT) ** 2 + (offsetY * GRID_UNIT) ** 2)
            const requiredSpeed = actualPixelDistance / timeDiff
            const speedMultiplier = requiredSpeed / BALL_SPEED

            // 如果速度差异显著，添加速度变化
            if (Math.abs(speedMultiplier - 1) > 0.3) {
              const clampedSpeed = Math.max(0.3, Math.min(3.0, speedMultiplier))
              addons.push({
                type: "speed_change",
                noteIndex: content.length - 1,
                distanceOffset: 0,
                newSpeed: Number.parseFloat(clampedSpeed.toFixed(2)),
              })
            }
          })
        } else {
          // 时间间隔为0：双押/多押
          noteIndices.forEach((originalIndex, noteIndex) => {
            const angle = (noteIndex * 2 * Math.PI) / noteIndices.length
            const offsetX = Math.round(Math.cos(angle) * MIN_OFFSET)
            const offsetY = Math.round(Math.sin(angle) * MIN_OFFSET)

            content.push({
              positionOffset: [offsetX, offsetY],
              timing: timing,
              type: "tap",
            })

            currentPixelPos.x += offsetX * GRID_UNIT
            currentPixelPos.y += offsetY * GRID_UNIT
          })
        }
      }
    }

    return { content, addons }
  }

  const handleFileUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSONParser.parse(e.target.result)
        if (Array.isArray(data)) {
          setInputData(JSONParser.stringify(data, null, 2))
          setError("")
        } else {
          throw new Error("文件内容不是数组格式")
        }
      } catch (err) {
        setError(`文件解析失败: ${err.message}`)
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove("dragover")
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add("dragover")
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove("dragover")
  }

  const convertToLevel = () => {
    setError("")
    setStats(null)

    try {
      const timeArray = JSONParser.parse(inputData)

      if (!Array.isArray(timeArray)) {
        throw new Error("输入必须是一个数组")
      }

      if (timeArray.length === 0) {
        throw new Error("数组不能为空")
      }

      // 验证数组元素都是数字
      for (let i = 0; i < timeArray.length; i++) {
        if (typeof timeArray[i] !== "number") {
          throw new Error(`数组第${i + 1}个元素不是数字`)
        }
        if (timeArray[i] < 0) {
          throw new Error(`数组第${i + 1}个元素不能为负数`)
        }
      }

      const bpmValue = Number.parseFloat(bpm)
      if (isNaN(bpmValue) || bpmValue <= 0) {
        throw new Error("BPM必须是大于0的数字")
      }

      // 排序时间数组用于统计
      const sortedTimes = [...timeArray].sort((a, b) => a - b)

      // 统计信息
      const uniqueCount = new Set(timeArray).size
      const multiHitCount = timeArray.length - uniqueCount
      const duration = sortedTimes[sortedTimes.length - 1] - sortedTimes[0]

      setStats({
        totalNotes: timeArray.length,
        uniqueTimes: uniqueCount,
        multiHits: multiHitCount,
        duration: duration.toFixed(2),
        bpm: bpmValue,
      })

      // 使用基于编辑器的路径生成算法
      const { content, addons } = generatePathFromTiming(timeArray, bpmValue)

      // 创建完整的谱面数据
      const levelData = {
        property: {
          version: 1.0,
          song: {
            name: songName || "Converted Track",
            artists: [{ name: artist || "Unknown Artist", link: "" }],
            bpm: bpmValue,
            offset: 0,
            volume: 1.0,
            href: "",
            thumb: "./circleArc.png",
          },
          level: {
            authors: [{ name: "Converter", link: "" }],
            levelTags: ["converted", "auto-generated"],
            hitsoundVolume: 0.5,
            hitsound: {
              type: "internal",
              name: "Kick",
            },
            previewColor: "#00ff88ff",
            defaultRailColor: ["#00ff88ff", "#0088ffff"],
          },
        },
        content: content,
        addons: addons,
      }

      const output = JSONParser.stringify(levelData, null, 2)
      setOutputData(output)
    } catch (err) {
      setError(err.message)
      setOutputData("")
    }
  }

  const exportLevel = async () => {
    if (!outputData) return

    try {
      const filename = `${songName.replace(/[^a-zA-Z0-9]/g, "_")}_converted.json`

      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: "JSON files", accept: { "application/json": [".json"] } }],
        })
        const writable = await fileHandle.createWritable()
        await writable.write(outputData)
        await writable.close()
      } else {
        const dataBlob = new Blob([outputData], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Failed to export file:", error)
    }
  }

  return (
    <div className="converter-container">
      <div className="converter-header">
        <button className="back-button" onClick={() => navigate("/home")}>
          <ArrowLeft size={24} />
        </button>
        <h1>Array to PrismMark Converter</h1>
      </div>

      <div className="converter-content">
        <div className="input-section">
          <h2 className="section-title">输入设置</h2>

          <div className="form-group">
            <label>歌曲名称:</label>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              placeholder="输入歌曲名称"
            />
          </div>

          <div className="form-group">
            <label>艺术家:</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="输入艺术家名称"
            />
          </div>

          <div className="form-group">
            <label>BPM:</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              placeholder="120"
              min="1"
              max="500"
            />
          </div>

          <div className="form-group">
            <label>时间数组 (JSON格式，单位：秒):</label>

            <div
              className="file-upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} style={{ marginBottom: "8px", color: "#00ff88" }} />
              <div className="upload-text">
                <strong>点击上传</strong> 或 <strong>拖拽JSON文件</strong>
                <br />
                支持包含时间数组的JSON文件
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                className="file-upload-input"
              />
            </div>

            <div className="info-text">
              输入格式示例: [0, 1, 1, 2.5, 4, 4, 5.5]
              <br />• 支持相同时间点（双押/多押）
              <br />• 时间必须为非负数
              <br />• 基于编辑器球移动机制生成路径
              <br />• 球速150像素/秒，网格50像素/单位
              <br />• 确保与编辑器中的效果一致
            </div>

            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="[0, 1, 2, 3, 4, 5]"
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <button className="convert-button" onClick={convertToLevel} disabled={!inputData.trim() || !bpm}>
            转换为PrismMark谱面
          </button>
        </div>

        <div className="output-section">
          <h2 className="section-title">输出结果</h2>

          {stats && (
            <div className="stats-info">
              <strong>转换统计:</strong>
              <br />• 总物量数: {stats.totalNotes}
              <br />• 独立时间点: {stats.uniqueTimes}
              <br />• 多押物量: {stats.multiHits}
              <br />• 总时长: {stats.duration}秒
              <br />• BPM: {stats.bpm}
            </div>
          )}

          <div className="info-text">
            <strong>基于编辑器的转换算法:</strong>
            <br />• 球移动速度: 150像素/秒
            <br />• 网格单位: 50像素
            <br />• 智能路径规划
            <br />• 自动速度调整
            <br />• 与编辑器完全一致的移动机制
          </div>

          <textarea
            className="output-textarea"
            value={outputData}
            readOnly
            placeholder="转换后的谱面数据将显示在这里..."
          />

          <button className="export-button" onClick={exportLevel} disabled={!outputData}>
            <Download size={16} />
            导出谱面文件
          </button>
        </div>
      </div>
    </div>
  )
}

export default Converter
