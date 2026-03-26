import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import removeDuplicateArrays, { getRouteColor } from './utils'

export default function MapView({ selected, routes, showAllRoutes }) {
  const mapRef = useRef(null)
  const layerRef = useRef(null)
  const routeLayersRef = useRef({})

  // console.log('MapView render', { selected, routes })

  useEffect(() => {
    if(!mapRef.current) {
      mapRef.current = L.map('map').setView([22.3220818, 73.0906863], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current)
      layerRef.current = L.layerGroup().addTo(mapRef.current)
    }
  }, [])

  // Handle "show all routes" mode
  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return

    // Clear existing layers
    layerRef.current.clearLayers()

    // Clear individual route layers
    Object.values(routeLayersRef.current).forEach(layer => {
      mapRef.current.removeLayer(layer)
    })
    routeLayersRef.current = {}

    if (!showAllRoutes) return

    // Render all routes
    const routeKeys = Object.keys(routes)
    const batchSize = 15

    const renderRouteBatch = async (startIdx) => {
      const batch = routeKeys.slice(startIdx, startIdx + batchSize)

      await Promise.all(
        batch.map(async (key, idx) => {
          const file = routes[key]
          if (!file) return

          const baseUrl = import.meta.env.BASE_URL
          const ttFile = `${baseUrl}route_details/tt_${file}`
          const globalIdx = startIdx + idx
          const color = getRouteColor(globalIdx, routeKeys.length)

          try {
            const response = await fetch(ttFile)
            const data = await response.json()
            const table = data['Table'] || []

            // Create layer group for this route
            const routeLayer = L.layerGroup()
            const pathCoordinates = []

            table.forEach(point => {
              if (point.LATLAN) {
                const latlon = point.LATLAN.split(' ').reverse().map(x => parseFloat(x))
                const marker = L.marker(latlon)
                marker.bindPopup(`<b>${file.replace('.json', '')} - ${point.POI_NAME}</b> -> ${point.REACH_TIME}`)
                routeLayer.addLayer(marker)
              }

              if (point.TRAVELPATH) {
                const coordsStr = point.TRAVELPATH.substring(12, point.TRAVELPATH.length - 1)
                coordsStr.split(', ').forEach(item => {
                  const parts = item.split(' ').reverse().map(a => parseFloat(a))
                  pathCoordinates.push(parts)
                })
              }
            })

            const pathNoDupes = removeDuplicateArrays(pathCoordinates)

            if (pathNoDupes.length) {
              const geoJsonPath = {
                type: 'Feature',
                geometry: { type: 'LineString', coordinates: pathNoDupes },
                properties: {}
              }

              const geo = L.geoJSON(geoJsonPath, {
                style: { color, weight: 3, opacity: 0.6 }
              })
              routeLayer.addLayer(geo)
            }

            routeLayersRef.current[key] = routeLayer
            routeLayer.addTo(mapRef.current)
          } catch (err) {
            console.error('Error loading route file', ttFile, err)
          }
        })
      )

      // Render next batch
      if (startIdx + batchSize < routeKeys.length) {
        setTimeout(() => renderRouteBatch(startIdx + batchSize), 100)
      }
    }

    renderRouteBatch(0)

  }, [showAllRoutes, routes])

  // whenever selected changes, clear layers and draw only that route
  useEffect(() => {
    if(!mapRef.current || !layerRef.current) return

    // Don't render single route if showAllRoutes is active
    if (showAllRoutes) return

    layerRef.current.clearLayers()

    if(!selected) return
    
    const file = routes[selected]
    
    if(!file) return

    const baseUrl = import.meta.env.BASE_URL
    const ttFile = `${baseUrl}route_details/tt_${file}`
    fetch(ttFile)
      .then(res => res.json())
      .then(data => {
        const table = data['Table'] || []
        const pathCoordinates = []

        table.forEach(point => {
          if(point.LATLAN) {
            const latlon = point.LATLAN.split(' ').reverse().map(x => parseFloat(x))
            const marker = L.marker(latlon)
            // display all the routes passing through this point
            marker.bindPopup(`<b>${file.substring(3, file.length - 5)} - ${point.POI_NAME}</b> -> ${point.REACH_TIME}`)
            layerRef.current.addLayer(marker)
          }

          if(point.TRAVELPATH) {
            // TRAVELPATH seems like 'LINESTRING(lon lat, lon lat, ... )'
            const coordsStr = point.TRAVELPATH.substring(12, point.TRAVELPATH.length - 1)
            coordsStr.split(', ').forEach(item => {
              const parts = item.split(' ').reverse().map(a => parseFloat(a))
              pathCoordinates.push(parts)
            })
          }
        })

        const pathNoDupes = removeDuplicateArrays(pathCoordinates)

        if(pathNoDupes.length) {
          const geoJsonPath = {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: pathNoDupes },
            properties: {}
          }
          
          const geo = L.geoJSON(geoJsonPath, { style: { color: 'blue', weight: 4, opacity: 0.7 } })
          layerRef.current.addLayer(geo)
          
          // fit map to route bounds
          try {
            mapRef.current.fitBounds(geo.getBounds(), { padding: [20, 20] })
          } catch(e) {
            // ignore
          }
        }
      })
      .catch(err => console.error('Error loading route file', ttFile, err))

  }, [selected, routes, showAllRoutes])

  return <div id="map" style={{ height: '100%' }} />
}
