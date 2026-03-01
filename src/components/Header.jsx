import React from 'react'

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-placeholder">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div className="app-title">
          <h1>Smart City Bus</h1>
          <span className="app-subtitle">Vadodara Bus Route Tracker</span>
        </div>
      </div>
      <nav className="header-right">
        <a href="#about" className="nav-link">About</a>
      </nav>
    </header>
  )
}
