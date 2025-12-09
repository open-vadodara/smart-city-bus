import React, { useEffect, useState } from 'react'
import MapView from './components/MapView'
import LeftPanel from './components/LeftPanel'

export default function App() {
  
  function fetchRouteFilenames() {
    return fetch('/route_details/filenames.txt')
      .then(res => res.text())
      .then(text => text.split('\n'))
  }

  const [routes, setRoutes] = useState({})
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchRouteFilenames().then(files => {
      setRoutes(files)
    })
  }, [])

  return (
    <div className="app">
      <div className="left-panel">
        <LeftPanel
          routes={ routes }
          selected={ selected }
          setSelect={ setSelected }
        />
      </div>
      <div className="map-container">
        <MapView
          selected={ selected }
          routes={ routes }
        />
      </div>
    </div>
  )
}
