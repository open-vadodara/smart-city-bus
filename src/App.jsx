import React, { useEffect, useState } from 'react'
import MapView from './components/MapView'
import LeftPanel from './components/LeftPanel'
import Header from './components/Header'
import Footer from './components/Footer'
import { fetchRouteDestination } from './components/utils'

export default function App() {
  
  function fetchRouteFilenames() {
    return fetch('/route_details/filenames.txt')
      .then(res => res.text())
      .then(text => text.split('\n'))
  }

  const [routes, setRoutes] = useState({})
  const [selected, setSelected] = useState(null)
  const [routeMetadata, setRouteMetadata] = useState({})
  const [showAllRoutes, setShowAllRoutes] = useState(false)

  useEffect(() => {
    fetchRouteFilenames().then(files => {
      setRoutes(files)
    })
  }, [])

  useEffect(() => {
    const loadMetadata = async () => {
      if (Object.keys(routes).length === 0) return

      const metadata = {}
      const routeKeys = Object.keys(routes) // Load ALL routes

      // Process in batches of 10 to avoid overwhelming the browser
      const batchSize = 10
      for (let i = 0; i < routeKeys.length; i += batchSize) {
        const batch = routeKeys.slice(i, i + batchSize)

        await Promise.all(
          batch.map(async (key) => {
            try {
              metadata[key] = await fetchRouteDestination(routes[key])
            } catch (err) {
              console.error(`Error fetching metadata for ${routes[key]}:`, err)
              metadata[key] = {
                name: routes[key].replace('.json', ''),
                destination: 'Unknown'
              }
            }
          })
        )

        // Update state after each batch so UI shows progressive loading
        setRouteMetadata({ ...metadata })
      }
    }

    loadMetadata()
  }, [routes])

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <div className="left-panel">
          <LeftPanel
            routes={ routes }
            selected={ selected }
            setSelect={ setSelected }
            showAllRoutes={ showAllRoutes }
            setShowAllRoutes={ setShowAllRoutes }
            routeMetadata={ routeMetadata }
          />
        </div>
        <div className="map-container">
          <MapView
            selected={ selected }
            routes={ routes }
            showAllRoutes={ showAllRoutes }
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}
