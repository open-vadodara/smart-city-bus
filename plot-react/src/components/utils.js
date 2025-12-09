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