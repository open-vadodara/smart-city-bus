const fs = require('fs')
const path = require('path')

// Input & Output directory paths as parameters
let input_dir = process.argv[2],
    output_dir = process.argv[3]

// Read every file as raw input, convert into JSON & save in output dir
fs.readdir(input_dir, (err, filenames) => {
  if(err) {
    console.error(err)
    return
  }

  filenames.forEach((filename) => {
    let deets = fs.readFileSync(path.join(__dirname, input_dir, filename)).toString()
    let route_details = JSON.parse(deets),
        fname = filename.split('.')[0],
        save_as = path.join(output_dir, `${fname}.json`)

    fs.writeFile(save_as, route_details, 'utf8', () => {
      console.log(`${fname}.json file saved`)
    })
  })
})