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
    //   const ROUTES = {}
    //   files.forEach(fileName => {
    //     // const name = fileName.replace('.json', '')
    //     // if(!fileName.startsWith('tt_')) {
    //     //   ROUTES[name] = fileName
    //     // }
    //   })
    })
  }, [])

  // let files = await fetch('/route_details/filenames.txt')
  //   .then(res => res.text())
  //   .then(text => text.split('\n'))
  //   .then(files => console.log(files))

    // console.log('files', files)
  // const ROUTES = {}
  // files.forEach(({ name, fileName }) => {
  //   if (!fileName.startsWith('tt_')) ROUTES[name] = fileName
  // })
  // setRoutes(ROUTES)
  // const [routes, setRoutes] = useState({})
  // const [selected, setSelected] = useState(null)

  // In a React component
  // useEffect(() => {
  //   const fetchJsonData = (async () => {
  //     const filenames = ['2D.json', '2U.json'] // Or generate based on a pattern
  //     const promises = filenames.map(filename => 
  //       fetch(`/route_details/${filename}`).then(res => res.json())
  //     )
  //     const allData = await Promise.all(promises)
  //     // Use allData in your component state
  //     console.log('Fetched JSON data:', allData)
  //   })()
  //   // fetchJsonData()
  // }, [])

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
