"use client"

import { Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#1a1a1a",
            color: "white",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>Something went wrong</h1>
          <p>An error occurred while loading the application.</p>
          <details style={{ marginTop: "20px", textAlign: "left" }}>
            <summary>Error details</summary>
            <pre
              style={{
                backgroundColor: "#333",
                padding: "10px",
                borderRadius: "5px",
                overflow: "auto",
                maxWidth: "80vw",
              }}
            >
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#00ff88",
              color: "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
