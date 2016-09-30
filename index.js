const path = require('path')
const aiva = require(path.join(__dirname, 'src', 'aiva'))

if (require.main === module) {
  aiva.start()
}
