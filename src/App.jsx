import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Subdomains from "./Subdomains.jsx"
import Domains from "./Domains.jsx"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Subdomains />} />
        <Route path="/register" element={<Domains />} />
      </Routes>
    </Router>
  )
}