"use client"
import pmLogo from "/PrismMark_component.svg"
import VersionManager from "./utils/VersionManager"
import { useNavigate } from "react-router-dom"
import "./App.css"

function App() {
  const navigate = useNavigate()
  return (
    <>
      <div>
        <a>
          <img src={pmLogo || "/placeholder.svg"} className="logo" alt="PrismMark logo" />
        </a>
      </div>
      <div className="card">
        <button
          onClick={() => {
            navigate("/home")
          }}
        >
          Start
        </button>
        <p>Version {VersionManager.version}</p>
      </div>
      <p className="read-the-docs">2025 PrismMark</p>
    </>
  )
}

export default App
