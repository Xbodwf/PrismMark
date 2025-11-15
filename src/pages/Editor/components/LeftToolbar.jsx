"use client"

import { useState } from "react"
import {
  BarChart3,
  Music,
  Palette,
  Settings,
  ChevronRight,
  ChevronLeft,
  Info,
  Volume2,
  User,
  Tag,
  Plus,
  Minus,
} from "lucide-react"
import "./LeftToolbar.css"

// 综合信息选项卡
function OverviewTab({
  levelData,
  actualNoteCount,
  score,
  combo,
  currentNoteIndex,
  selectedNoteIndex,
  isPlaying,
  deathCount,
  failureWindow,
  audioReady,
  audioLoading,
  audioError,
}) {
  const getCurrentProgress = () => {
    if (!isPlaying) return `0/${actualNoteCount}`
    const displayCurrent = Math.max(0, currentNoteIndex - 1)
    const displayTotal = actualNoteCount
    return `${Math.min(displayCurrent, displayTotal)}/${displayTotal}`
  }

  return (
    <div className="tab-content">
      <div className="property-section">
        <h4>
          <Info size={16} />
          谱面信息
        </h4>
        <div className="property-row">
          <label>歌曲名称</label>
          <span style={{ color: "#00ff88" }}>{levelData?.property?.song?.name || "Unknown Song"}</span>
        </div>
        <div className="property-row">
          <label>BPM</label>
          <span>{levelData?.property?.song?.bpm || 120}</span>
        </div>
        <div className="property-row">
          <label>物量数</label>
          <span>{actualNoteCount}</span>
        </div>
        {selectedNoteIndex !== null && !isPlaying && (
          <div className="property-row">
            <label>选中物量</label>
            <span style={{ color: "#ffff00" }}>{selectedNoteIndex}</span>
          </div>
        )}
      </div>

      <div className="property-section">
        <h4>
          <BarChart3 size={16} />
          游戏状态
        </h4>
        <div className="property-row">
          <label>分数</label>
          <span style={{ color: "#00ff88" }}>{score}</span>
        </div>
        <div className="property-row">
          <label>连击</label>
          <span style={{ color: "#ffaa00" }}>{combo}</span>
        </div>
        <div className="property-row">
          <label>进度</label>
          <span>{getCurrentProgress()}</span>
        </div>
        {deathCount > 0 && (
          <div className="property-row">
            <label>死亡次数</label>
            <span style={{ color: "#ff6666" }}>{deathCount}</span>
          </div>
        )}
        <div className="property-row">
          <label>失败窗口</label>
          <span>{failureWindow} 物量</span>
        </div>
      </div>

      <div className="property-section">
        <h4>
          <Volume2 size={16} />
          音频状态
        </h4>
        {audioLoading && (
          <div className="property-row">
            <span style={{ color: "#ffaa00" }}>正在加载音频...</span>
          </div>
        )}
        {audioError && (
          <div className="property-row">
            <span style={{ color: "#ff6666" }}>音频错误: {audioError}</span>
          </div>
        )}
        {audioReady && (
          <div className="property-row">
            <span style={{ color: "#00ff88" }}>音频就绪</span>
          </div>
        )}
      </div>

      {!isPlaying && (
        <div className="property-section">
          <h4>
            <Settings size={16} />
            操作提示
          </h4>
          <div style={{ fontSize: "0.8em", color: "#888", lineHeight: 1.4 }}>
            • 拖拽移动视角
            <br />• 滚轮缩放
            <br />• 点击物量选中
            <br />• 选中物量后按Q-I键插入新物量
          </div>
        </div>
      )}
    </div>
  )
}

// 歌曲属性选项卡
function SongTab({ levelData, onUpdateLevelData }) {
  const songData = levelData?.property?.song || {}

  const handleSongPropertyChange = (property, value) => {
    const newLevelData = {
      ...levelData,
      property: {
        ...levelData.property,
        song: {
          ...songData,
          [property]: value,
        },
      },
    }
    onUpdateLevelData(newLevelData)
  }

  const handleArtistChange = (index, field, value) => {
    const artists = [...(songData.artists || [{ name: "", link: "" }])]
    artists[index] = { ...artists[index], [field]: value }
    handleSongPropertyChange("artists", artists)
  }

  const addArtist = () => {
    const artists = [...(songData.artists || []), { name: "", link: "" }]
    handleSongPropertyChange("artists", artists)
  }

  const removeArtist = (index) => {
    const artists = songData.artists?.filter((_, i) => i !== index) || []
    handleSongPropertyChange("artists", artists)
  }

  return (
    <div className="tab-content">
      <div className="property-section">
        <h4>
          <Music size={16} />
          基本信息
        </h4>
        <div className="property-row">
          <label>歌曲名称</label>
          <input
            type="text"
            value={songData.name || ""}
            onChange={(e) => handleSongPropertyChange("name", e.target.value)}
            placeholder="输入歌曲名称"
          />
        </div>
        <div className="property-row">
          <label>BPM</label>
          <input
            type="number"
            value={songData.bpm || 120}
            onChange={(e) => handleSongPropertyChange("bpm", Number.parseInt(e.target.value) || 120)}
            min="1"
            max="500"
          />
        </div>
        <div className="property-row">
          <label>偏移 (ms)</label>
          <input
            type="number"
            value={songData.offset || 0}
            onChange={(e) => handleSongPropertyChange("offset", Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="property-row">
          <label>音量</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={songData.volume || 1.0}
            onChange={(e) => handleSongPropertyChange("volume", Number.parseFloat(e.target.value) || 1.0)}
          />
        </div>
        <div className="property-row">
          <label>音频路径</label>
          <input
            type="text"
            value={songData.href || ""}
            onChange={(e) => handleSongPropertyChange("href", e.target.value)}
            placeholder="音频文件路径或URL"
          />
        </div>
      </div>

      <div className="property-section">
        <h4>
          <User size={16} />
          艺术家
        </h4>
        <div className="array-input">
          {(songData.artists || [{ name: "", link: "" }]).map((artist, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={artist.name || ""}
                onChange={(e) => handleArtistChange(index, "name", e.target.value)}
                placeholder="艺术家名称"
              />
              <input
                type="text"
                value={artist.link || ""}
                onChange={(e) => handleArtistChange(index, "link", e.target.value)}
                placeholder="链接 (可选)"
              />
              {songData.artists?.length > 1 && (
                <button className="array-btn remove" onClick={() => removeArtist(index)}>
                  <Minus size={14} />
                </button>
              )}
            </div>
          ))}
          <button className="array-btn" onClick={addArtist}>
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// 关卡属性选项卡
function LevelTab({ levelData, onUpdateLevelData }) {
  const levelProps = levelData?.property?.level || {}

  const handleLevelPropertyChange = (property, value) => {
    const newLevelData = {
      ...levelData,
      property: {
        ...levelData.property,
        level: {
          ...levelProps,
          [property]: value,
        },
      },
    }
    onUpdateLevelData(newLevelData)
  }

  const handleAuthorChange = (index, field, value) => {
    const authors = [...(levelProps.authors || [{ name: "", link: "" }])]
    authors[index] = { ...authors[index], [field]: value }
    handleLevelPropertyChange("authors", authors)
  }

  const addAuthor = () => {
    const authors = [...(levelProps.authors || []), { name: "", link: "" }]
    handleLevelPropertyChange("authors", authors)
  }

  const removeAuthor = (index) => {
    const authors = levelProps.authors?.filter((_, i) => i !== index) || []
    handleLevelPropertyChange("authors", authors)
  }

  const handleTagChange = (index, value) => {
    const tags = [...(levelProps.levelTags || [])]
    tags[index] = value
    handleLevelPropertyChange("levelTags", tags)
  }

  const addTag = () => {
    const tags = [...(levelProps.levelTags || []), ""]
    handleLevelPropertyChange("levelTags", tags)
  }

  const removeTag = (index) => {
    const tags = levelProps.levelTags?.filter((_, i) => i !== index) || []
    handleLevelPropertyChange("levelTags", tags)
  }

  const handleRailColorChange = (index, value) => {
    const colors = [...(levelProps.defaultRailColor || ["#00ff88ff", "#0088ffff"])]
    colors[index] = value
    handleLevelPropertyChange("defaultRailColor", colors)
  }

  return (
    <div className="tab-content">
      <div className="property-section">
        <h4>
          <User size={16} />
          作者信息
        </h4>
        <div className="array-input">
          {(levelProps.authors || [{ name: "", link: "" }]).map((author, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={author.name || ""}
                onChange={(e) => handleAuthorChange(index, "name", e.target.value)}
                placeholder="作者名称"
              />
              <input
                type="text"
                value={author.link || ""}
                onChange={(e) => handleAuthorChange(index, "link", e.target.value)}
                placeholder="链接 (可选)"
              />
              {levelProps.authors?.length > 1 && (
                <button className="array-btn remove" onClick={() => removeAuthor(index)}>
                  <Minus size={14} />
                </button>
              )}
            </div>
          ))}
          <button className="array-btn" onClick={addAuthor}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="property-section">
        <h4>
          <Tag size={16} />
          标签
        </h4>
        <div className="array-input">
          {(levelProps.levelTags || []).map((tag, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={tag || ""}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder="标签"
              />
              <button className="array-btn remove" onClick={() => removeTag(index)}>
                <Minus size={14} />
              </button>
            </div>
          ))}
          <button className="array-btn" onClick={addTag}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="property-section">
        <h4>
          <Volume2 size={16} />
          音效设置
        </h4>
        <div className="property-row">
          <label>打拍音音量</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={levelProps.hitsoundVolume || 0.5}
            onChange={(e) => handleLevelPropertyChange("hitsoundVolume", Number.parseFloat(e.target.value) || 0.5)}
          />
        </div>
        <div className="property-row">
          <label>打拍音类型</label>
          <select
            value={levelProps.hitsound?.type || "internal"}
            onChange={(e) =>
              handleLevelPropertyChange("hitsound", {
                ...levelProps.hitsound,
                type: e.target.value,
              })
            }
          >
            <option value="internal">内置</option>
            <option value="external">外部</option>
          </select>
        </div>
        <div className="property-row">
          <label>打拍音名称</label>
          <input
            type="text"
            value={levelProps.hitsound?.name || "Kick"}
            onChange={(e) =>
              handleLevelPropertyChange("hitsound", {
                ...levelProps.hitsound,
                name: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

// 视觉设置选项卡
function VisualTab({ levelData, onUpdateLevelData }) {
  const levelProps = levelData?.property?.level || {}

  const handleLevelPropertyChange = (property, value) => {
    const newLevelData = {
      ...levelData,
      property: {
        ...levelData.property,
        level: {
          ...levelProps,
          [property]: value,
        },
      },
    }
    onUpdateLevelData(newLevelData)
  }

  const handleRailColorChange = (index, value) => {
    const colors = [...(levelProps.defaultRailColor || ["#00ff88ff", "#0088ffff"])]
    colors[index] = value
    handleLevelPropertyChange("defaultRailColor", colors)
  }

  const addRailColor = () => {
    const colors = [...(levelProps.defaultRailColor || []), "#ffffff"]
    handleLevelPropertyChange("defaultRailColor", colors)
  }

  const removeRailColor = (index) => {
    const colors = levelProps.defaultRailColor?.filter((_, i) => i !== index) || []
    handleLevelPropertyChange("defaultRailColor", colors)
  }

  return (
    <div className="tab-content">
      <div className="property-section">
        <h4>
          <Palette size={16} />
          颜色设置
        </h4>
        <div className="property-row">
          <label>预览颜色</label>
          <div className="color-input-group">
            <input
              type="color"
              value={(levelProps.previewColor || "#00ff88ff").substring(0, 7)}
              onChange={(e) => handleLevelPropertyChange("previewColor", e.target.value + "ff")}
            />
            <input
              type="text"
              value={levelProps.previewColor || "#00ff88ff"}
              onChange={(e) => handleLevelPropertyChange("previewColor", e.target.value)}
              placeholder="#00ff88ff"
            />
          </div>
        </div>
      </div>

      <div className="property-section">
        <h4>
          <Palette size={16} />
          轨道颜色
        </h4>
        <div className="array-input">
          {(levelProps.defaultRailColor || ["#00ff88ff", "#0088ffff"]).map((color, index) => (
            <div key={index} className="array-item">
              <div className="color-input-group">
                <input
                  type="color"
                  value={(color || "#ffffff").substring(0, 7)}
                  onChange={(e) => handleRailColorChange(index, e.target.value + "ff")}
                />
                <input
                  type="text"
                  value={color || "#ffffff"}
                  onChange={(e) => handleRailColorChange(index, e.target.value)}
                  placeholder="#00ff88ff"
                />
              </div>
              {levelProps.defaultRailColor?.length > 1 && (
                <button className="array-btn remove" onClick={() => removeRailColor(index)}>
                  <Minus size={14} />
                </button>
              )}
            </div>
          ))}
          <button className="array-btn" onClick={addRailColor}>
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function LeftToolbar({
  isVisible,
  onToggle,
  levelData,
  onUpdateLevelData,
  // 综合选项卡的props
  actualNoteCount,
  score,
  combo,
  currentNoteIndex,
  selectedNoteIndex,
  isPlaying,
  deathCount,
  failureWindow,
  audioReady,
  audioLoading,
  audioError,
}) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", icon: BarChart3, tooltip: "综合" },
    { id: "song", icon: Music, tooltip: "歌曲" },
    { id: "level", icon: Settings, tooltip: "关卡" },
    { id: "visual", icon: Palette, tooltip: "视觉" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            levelData={levelData}
            actualNoteCount={actualNoteCount}
            score={score}
            combo={combo}
            currentNoteIndex={currentNoteIndex}
            selectedNoteIndex={selectedNoteIndex}
            isPlaying={isPlaying}
            deathCount={deathCount}
            failureWindow={failureWindow}
            audioReady={audioReady}
            audioLoading={audioLoading}
            audioError={audioError}
          />
        )
      case "song":
        return <SongTab levelData={levelData} onUpdateLevelData={onUpdateLevelData} />
      case "level":
        return <LevelTab levelData={levelData} onUpdateLevelData={onUpdateLevelData} />
      case "visual":
        return <VisualTab levelData={levelData} onUpdateLevelData={onUpdateLevelData} />
      default:
        return null
    }
  }

  const getTabTitle = () => {
    const tab = tabs.find((t) => t.id === activeTab)
    return tab ? tab.tooltip : "工具栏"
  }

  return (
    <>
      {/* 切换按钮 */}
      <button className={`toolbar-toggle ${isVisible ? "expanded" : ""}`} onClick={onToggle}>
        {isVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* 工具栏主体 */}
      <div className={`left-toolbar ${isVisible ? "expanded" : "collapsed"}`}>
        {/* 选项卡列表 */}
        <div className="toolbar-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`toolbar-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                data-tooltip={tab.tooltip}
              >
                <Icon size={20} />
              </button>
            )
          })}
        </div>

        {/* 内容区域 */}
        <div className="toolbar-content">
          <div className="toolbar-header">
            <h3>{getTabTitle()}</h3>
          </div>
          <div className="toolbar-body">{renderTabContent()}</div>
        </div>
      </div>
    </>
  )
}

export default LeftToolbar
