import React, { useState, useRef, useEffect } from 'react'
import { fetchRouteStops } from './utils'

export default function LeftPanel({
  routes,
  selected,
  setSelect,
  showAllRoutes,
  setShowAllRoutes,
  routeMetadata
}) {
  const [expandedRoute, setExpandedRoute] = useState(null)
  const [routeStops, setRouteStops] = useState({})
  const leftPanelRef = useRef(null)

  // Click outside to close expanded route
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (leftPanelRef.current && !leftPanelRef.current.contains(event.target)) {
        setExpandedRoute(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRouteExpand = async (routeKey, event) => {
    event.stopPropagation() // Prevent event bubbling

    if (expandedRoute === routeKey) {
      // Collapsing - clear route from map
      setExpandedRoute(null)
      setSelect(null)
      return
    }

    // Expanding - show on map and expand details
    setExpandedRoute(routeKey)
    setSelect(routeKey)

    // Fetch stops if not already cached
    if (!routeStops[routeKey]) {
      try {
        const stops = await fetchRouteStops(routes[routeKey])
        setRouteStops(prev => ({ ...prev, [routeKey]: stops }))
      } catch (err) {
        console.error('Error fetching stops:', err)
      }
    }
  }

  return (
    <div ref={leftPanelRef}>
      {/* Show All Routes Checkbox */}
      <div className="controls-section">
        <label className="show-all-label">
          <input
            type="checkbox"
            checked={showAllRoutes}
            onChange={(e) => setShowAllRoutes(e.target.checked)}
          />
          <span>Show all routes on map</span>
        </label>
      </div>

      <hr />

      <h2>Routes</h2>
      <ul className="routes-list">
        {Object.keys(routes).map((k) => {
          const metadata = routeMetadata[k]
          const isExpanded = expandedRoute === k
          const stops = routeStops[k] || []

          return (
            <li key={k} className={`route-item ${selected === k ? 'selected' : ''}`}>
              {/* Route Header - clickable for expansion */}
              <div
                className="route-header"
                onClick={(e) => handleRouteExpand(k, e)}
              >
                {/* Bus Icon */}
                <svg className="bus-icon" viewBox="0 0 640 640">
                  <path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/>
                </svg>

                <div className="route-info">
                  <span className="route-name">
                    {metadata ? metadata.name : routes[k].replace('.json', '')}
                  </span>
                  {metadata && metadata.destination && (
                    <span className="route-destination">
                      → {metadata.destination}
                    </span>
                  )}
                </div>

                <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
              </div>

              {/* Expandable Stops List */}
              {isExpanded && (
                <div className="route-stops">
                  {stops.length > 0 ? (
                    stops.map((stop) => (
                      <div key={stop.POI_SEQUENCE_NO} className="stop-item">
                        <span className="stop-sequence">{stop.POI_SEQUENCE_NO + 1}</span>
                        <span className="stop-name">{stop.POI_NAME}</span>
                        <span className="stop-time">{stop.REACH_TIME}</span>
                      </div>
                    ))
                  ) : (
                    <div className="loading">Loading stops...</div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <hr />
      <h3>Selected</h3>
      <div>{selected !== null ? routeMetadata[selected]?.name || routes[selected] : 'None'}</div>
      <hr />
      <h3>Instructions</h3>
      <ul>
        <li>Click route name to expand stops and display on map</li>
        <li>Click again to collapse and clear from map</li>
        <li>Enable "Show all routes" to see all routes at once</li>
        <li>Click outside to close expanded route</li>
      </ul>
    </div>
  )
}
