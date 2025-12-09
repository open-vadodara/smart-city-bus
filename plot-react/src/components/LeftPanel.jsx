import React from 'react'

export default function LeftPanel({ routes, selected, setSelect }) {
  console.log('routes ===', routes)

  return (
    <div>
      <h2>Routes</h2>
      <ul>
      {
        Object.keys(routes).map((k) => (
          <li
            key={ k }
            className={ `route-item ${selected === k ? 'selected' : ''}` }
            onClick={ () => setSelect(k) }
          >
            { routes[k] }
          </li>
        ))
      }
      </ul>

      <hr />
      <h3>Selected</h3>
      <div>{selected || 'None'}</div>
      <hr />
      <h3>Instructions</h3>
      <ul>
        <li>Click a route to display it on the map.</li>
        <li>Only the selected route is shown at a time.</li>
      </ul>
    </div>
  )
}
