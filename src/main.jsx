"use client"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import Home from "./pages/Home.jsx"
import Editor from "./pages/Editor/index.jsx"
import Player from "./pages/Player.jsx"
import Guide from "./pages/Guide.jsx"
import Converter from "./pages/Converter.jsx"

// 检查 root 元素是否存在
const rootElement = document.getElementById("root")
if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial;">
      <h1>Error: Root element not found</h1>
      <p>The element with id="root" was not found in the HTML.</p>
    </div>
  `
} else {
  try {
    const root = createRoot(rootElement)
    root.render(
      <StrictMode>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="home" element={<Home />} />
            <Route path="guide" element={<Guide />} />
            <Route path="player" element={<Player />} />
            <Route path="editor" element={<Editor />} />
            <Route path="converter" element={<Converter />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </StrictMode>,
    )
  } catch (error) {
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial;">
        <h1>React Error</h1>
        <p>Failed to render React app:</p>
        <pre style="background: #333; padding: 10px; border-radius: 5px;">${error.toString()}</pre>
      </div>
    `
  }
}
