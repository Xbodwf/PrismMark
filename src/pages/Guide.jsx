"use client"

import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { ArrowLeft, Play, Clock, Target, TrendingUp, Lightbulb } from "lucide-react"
import { TUTORIAL_LEVELS } from "./Tutorial/tutorialLevels"
import "./Guide.css"

function Guide() {
  const navigate = useNavigate()

  // 确保页面可以正常滚动
  useEffect(() => {
    // 添加页面类名
    document.body.classList.add("guide-page")

    // 确保页面可以滚动
    document.body.style.height = "auto"
    document.body.style.overflow = "auto"
    document.documentElement.style.height = "auto"
    document.documentElement.style.overflow = "auto"

    return () => {
      // 清理
      document.body.classList.remove("guide-page")
      document.body.style.height = ""
      document.body.style.overflow = ""
      document.documentElement.style.height = ""
      document.documentElement.style.overflow = ""
    }
  }, [])

  const handleTutorialClick = (tutorialId) => {
    navigate(`/player?tutorial=${tutorialId}`)
  }

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "🟢"
      case "intermediate":
        return "🟡"
      case "advanced":
        return "🟠"
      case "expert":
        return "🔴"
      default:
        return "⚪"
    }
  }

  const getEstimatedTime = (content) => {
    if (!content || content.length === 0) return "1 min"
    const lastTiming = content[content.length - 1]?.timing || 30000
    const minutes = Math.ceil(lastTiming / 60000)
    return `${minutes} min`
  }

  const getNoteCount = (content) => {
    return content ? content.length : 0
  }

  return (
    <div className="guide-container">
      <div className="guide-header">
        <button className="back-button" onClick={() => navigate("/home")}>
          <ArrowLeft size={24} />
        </button>
        <h1>Tutorial Guide</h1>
      </div>

      <div className="guide-content">
        <div className="guide-intro">
          <h2>Master PrismMark Step by Step</h2>
          <p>
            从这里开始您的PrismMark之旅吧! :-D
          </p>
          <p>Start from here</p>
        </div>

        <div className="tutorials-grid">
          {TUTORIAL_LEVELS.map((tutorial, index) => (
            <div
              key={tutorial.id}
              className={`tutorial-card ${tutorial.difficulty.toLowerCase()}`}
              onClick={() => handleTutorialClick(tutorial.id)}
            >
              <div className="tutorial-header">
                <h3 className="tutorial-title">
                  {getDifficultyIcon(tutorial.difficulty)} {tutorial.name}
                </h3>
                <span className="difficulty-badge">{tutorial.difficulty}</span>
              </div>

              <p className="tutorial-description">{tutorial.description}</p>

              <div className="tutorial-stats">
                <div className="tutorial-stat">
                  <Clock size={16} />
                  <span>{getEstimatedTime(tutorial.content)}</span>
                </div>
                <div className="tutorial-stat">
                  <Target size={16} />
                  <span>{getNoteCount(tutorial.content)} notes</span>
                </div>
                <div className="tutorial-stat">
                  <TrendingUp size={16} />
                  <span>{tutorial.property.song.bpm} BPM</span>
                </div>
              </div>

              <button className="play-button">
                <Play size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="tips-section">
          <h3>
            <Lightbulb size={24} />
            Pro Tips
          </h3>
          <ul className="tips-list">
            <li>我们没什么要说的</li>
             <li>We have nothing to say.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Guide
