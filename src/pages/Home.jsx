"use client"
import pmLogo from "/PrismMark.svg"
import { useNavigate } from "react-router-dom"
import "./Home.css"

function Home() {
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
            navigate("/guide")
          }}
        >
          Start
        </button>
        <br/>
        <p/>
        <button
          onClick={() => {
            navigate("/editor")
          }}
        >
          Level Editor
        </button>
        <br/>
        <p/>
        <button
          onClick={() => {
            navigate("/converter")
          }}
        >
          Converter
        </button>
      </div>
      <p className="read-the-docs">
      </p>
    </>
  )
}

export default Home
