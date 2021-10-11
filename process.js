const fs = require('fs')
const path = require('path')

// Input & Output directory paths as parameters
let input_dir = process.argv[2],
    output_dir = process.argv[3]
    is_tt = process.argv[4] ? true : false

// Read every file as raw input, convert into JSON & save in output dir
fs.readdir(input_dir, (err, filenames) => {
  if(err) {
    console.error(err)
    return
  }
  let timetables = []

  filenames.forEach((filename) => {
    let deets = fs.readFileSync(path.join(__dirname, input_dir, filename)).toString()

    let route_details = JSON.parse(deets),
        fname = filename.split('.')[0],  // remove `.txt` from end
        save_as = path.join(output_dir, `${fname}.json`)

    let bus_obj = JSON.parse(route_details)

    if(!is_tt) {
      // save array's first item's timetable id
      timetables.push(`${fname}-${bus_obj[0]['TIME_TABLE_TRIP_ID']}`)
    }

    fs.writeFile(save_as, route_details, 'utf8', () => {
      console.log(`${fname}.json file saved...`)
    })
  })

  if(!is_tt) {
    // Save timetables for all buses into separate txt file to parse
    fs.writeFile(path.join(__dirname, 'timetables.txt'), timetables.join('\n'), 'utf8', () => {
      console.log('timetables.txt file saved...')
    })
  }
})


