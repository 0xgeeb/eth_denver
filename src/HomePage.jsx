import React from 'react'
import logo from "./images/logo.png"

export default function HomePage() {
  return (
    <div className='home-page-container'>
        <img src={logo} alt="logo" />
        <a href="/domains"><button className="header-button-main-page">enter site</button></a>
    </div>
    
  )
}
