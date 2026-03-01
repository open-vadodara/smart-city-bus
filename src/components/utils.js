export default function removeDuplicateArrays(arrayOfArrays) {
  // Use a Set to store unique stringified arrays
  const uniqueSet = new Set();

  // Filter the array to remove duplicates
  return arrayOfArrays.filter((arr) => {
    const stringified = JSON.stringify(arr) // Convert the array to a string
    if(uniqueSet.has(stringified)) {
      return false // Duplicate found, filter it out
    } else {
      uniqueSet.add(stringified) // Add to Set and keep it
      return true // Keep this array
    }
  })
}

/**
 * Fetch route destination from tt_*.json file
 */
export async function fetchRouteDestination(routeFile) {
  const response = await fetch(`route_details/tt_${routeFile}`)
  const data = await response.json()
  const table = data.Table || []

  // Find the stop with highest sequence number (last stop)
  const maxSeq = Math.max(...table.map(t => t.POI_SEQUENCE_NO))
  const destination = table.find(t => t.POI_SEQUENCE_NO === maxSeq)

  return {
    name: routeFile.replace('.json', ''),
    destination: destination?.POI_NAME || 'Unknown'
  }
}

/**
 * Fetch all stops for a route in sequential order
 */
export async function fetchRouteStops(routeFile) {
  const response = await fetch(`route_details/tt_${routeFile}`)
  const data = await response.json()
  const table = data.Table || []

  // Sort by sequence number
  return table.sort((a, b) => a.POI_SEQUENCE_NO - b.POI_SEQUENCE_NO)
}

/**
 * Generate distinct color for each route using HSL color space
 */
export function getRouteColor(index, total = 126) {
  const hue = (index * 360) / total
  return `hsl(${hue}, 70%, 50%)`
}

/**
 * for a given point, find all routes passing through it
 */
function getRoutesThroughPoint(point) {
  console.log('gives routes through point', point)
}

/**
 * for a given route and point, get the timings
 */
function getTimingsForRouteAtPoint(point, route) {
  console.log('gives timings for route at point', point, route)
}