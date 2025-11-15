"use client"

import { useState, useRef, useEffect } from "react"
import { X, GripVertical, Plus, Trash2 } from "lucide-react"
import "./PropertyPanel.css"

function PropertyPanel({
  selectedNote,
  levelData,
  onUpdateNote,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  isVisible,
  onToggleVisibility,
}) {
  const [activeTab, setActiveTab] = useState("basic")
  const [panelWidth, setPanelWidth] = useState(350)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef(null)
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)

  // 获取当前物量数据
  const noteData = selectedNote !== null ? levelData?.content?.[selectedNote] : null
  const noteEvents = levelData?.addons?.filter((addon) => addon.noteIndex === selectedNote) || []

  // 重置选项卡当选中物量变化时
  useEffect(() => {
    if (selectedNote !== null) {
      setActiveTab("basic")
    }
  }, [selectedNote])

  // 处理拖拽调整大小
  const handleResizeStart = (e) => {
    setIsResizing(true)
    resizeStartX.current = e.clientX
    resizeStartWidth.current = panelWidth
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return
      const deltaX = resizeStartX.current - e.clientX
      const newWidth = Math.max(300, Math.min(600, resizeStartWidth.current + deltaX))
      setPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, panelWidth])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && activeTab !== "basic" && selectedNote !== null) {
        const eventIndex = noteEvents.findIndex(
          (event) => `event_${event.type}_${noteEvents.indexOf(event)}` === activeTab,
        )
        if (eventIndex !== -1) {
          onDeleteEvent(selectedNote, eventIndex)
          setActiveTab("basic")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeTab, selectedNote, noteEvents, onDeleteEvent])

  if (!isVisible || selectedNote === null || !noteData) return null

  const handleNotePropertyChange = (property, value) => {
    onUpdateNote(selectedNote, { ...noteData, [property]: value })
  }

  const handlePositionOffsetChange = (index, value) => {
    const newOffset = [...(noteData.positionOffset || [0, 0])]
    newOffset[index] = Number.parseFloat(value) || 0
    handleNotePropertyChange("positionOffset", newOffset)
  }

  const handleAddNewEvent = (eventType) => {
    const newEvent = {
      type: eventType,
      noteIndex: selectedNote,
      distanceOffset: 0,
      ...(eventType === "speed_change" && { newSpeed: 1.0 }),
      ...(eventType === "easing_change" && { newEasing: "linear" }),
    }
    onAddEvent(newEvent)
  }

  const handleEventPropertyChange = (eventIndex, property, value) => {
    const event = noteEvents[eventIndex]
    if (event) {
      onUpdateEvent(selectedNote, eventIndex, { ...event, [property]: value })
    }
  }

  const tabs = [
    { id: "basic", label: "基本" },
    ...noteEvents.map((event, index) => ({
      id: `event_${event.type}_${index}`,
      label: event.type === "speed_change" ? "速度" : "缓动",
      canDelete: true,
    })),
  ]

  return (
    <div
      ref={panelRef}
      className={`property-panel ${isVisible ? "visible" : "hidden"}`}
      style={{ width: `${panelWidth}px` }}
    >
      {/* 拖拽调整大小的手柄 */}
      <div className="resize-handle" onMouseDown={handleResizeStart}>
        <GripVertical size={16} />
      </div>

      {/* 面板头部 */}
      <div className="panel-header">
        <h3>物量属性 #{selectedNote}</h3>
        <button className="close-btn" onClick={() => onToggleVisibility()}>
          <X size={16} />
        </button>
      </div>

      {/* 选项卡 */}
      <div className="panel-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`panel-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.canDelete && (
              <button
                className="delete-tab-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  const eventIndex = noteEvents.findIndex(
                    (event) => `event_${event.type}_${noteEvents.indexOf(event)}` === tab.id,
                  )
                  if (eventIndex !== -1) {
                    onDeleteEvent(selectedNote, eventIndex)
                    setActiveTab("basic")
                  }
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 面板内容 */}
      <div className="panel-content">
        {activeTab === "basic" && (
          <div className="basic-properties">
            <div className="property-group">
              <label>类型</label>
              <select value={noteData.type || "tap"} onChange={(e) => handleNotePropertyChange("type", e.target.value)}>
                <option value="tap">Tap</option>
                <option value="hold">Hold</option>
                <option value="slide">Slide</option>
              </select>
            </div>

            <div className="property-group">
              <label>时间 (ms)</label>
              <input
                type="number"
                value={noteData.timing || 0}
                onChange={(e) => handleNotePropertyChange("timing", Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="property-group">
              <label>位置偏移</label>
              <div className="position-inputs">
                <input
                  type="number"
                  step="0.1"
                  placeholder="X"
                  value={noteData.positionOffset?.[0] || 0}
                  onChange={(e) => handlePositionOffsetChange(0, e.target.value)}
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Y"
                  value={noteData.positionOffset?.[1] || 0}
                  onChange={(e) => handlePositionOffsetChange(1, e.target.value)}
                />
              </div>
            </div>

            <div className="add-event-section">
              <h4>添加事件</h4>
              <div className="add-event-buttons">
                <button className="add-event-btn" onClick={() => handleAddNewEvent("speed_change")}>
                  <Plus size={14} />
                  速度变化
                </button>
                <button className="add-event-btn" onClick={() => handleAddNewEvent("easing_change")}>
                  <Plus size={14} />
                  缓动变化
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab.startsWith("event_") && (
          <div className="event-properties">
            {noteEvents.map((event, index) => {
              const tabId = `event_${event.type}_${index}`
              if (tabId !== activeTab) return null

              return (
                <div key={index} className="event-editor">
                  <div className="property-group">
                    <label>事件类型</label>
                    <input type="text" value={event.type} readOnly />
                  </div>

                  <div className="property-group">
                    <label>距离偏移</label>
                    <input
                      type="number"
                      step="0.1"
                      value={event.distanceOffset || 0}
                      onChange={(e) =>
                        handleEventPropertyChange(index, "distanceOffset", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  {event.type === "speed_change" && (
                    <div className="property-group">
                      <label>新速度</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="5"
                        value={event.newSpeed || 1.0}
                        onChange={(e) =>
                          handleEventPropertyChange(index, "newSpeed", Number.parseFloat(e.target.value) || 1.0)
                        }
                      />
                    </div>
                  )}

                  {event.type === "easing_change" && (
                    <div className="property-group">
                      <label>缓动类型</label>
                      <select
                        value={event.newEasing || "linear"}
                        onChange={(e) => handleEventPropertyChange(index, "newEasing", e.target.value)}
                      >
                        <option value="linear">Linear</option>
                        <option value="easeInSine">Ease In Sine</option>
                        <option value="easeOutSine">Ease Out Sine</option>
                        <option value="easeInOutSine">Ease In Out Sine</option>
                        <option value="easeInCubic">Ease In Cubic</option>
                        <option value="easeOutCubic">Ease Out Cubic</option>
                        <option value="easeInOutCubic">Ease In Out Cubic</option>
                      </select>
                    </div>
                  )}

                  <div className="event-actions">
                    <button
                      className="delete-event-btn"
                      onClick={() => {
                        onDeleteEvent(selectedNote, index)
                        setActiveTab("basic")
                      }}
                    >
                      <Trash2 size={14} />
                      删除事件
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyPanel
