const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))
let port = process.env.PORT || 3000
const dbPort = 27017
const dbName = 'twitter'

module.exports = {
  development: {
    rootPath: rootPath,
    dbStr: `mongodb://localhost:${dbPort}/${dbName}`,
    port: port,
    dbName: dbName,
    dbPort: dbPort
  },
  production: {
    port: port,
    dbName: dbName,
    dbPort: dbPort
  },
  staging: {
    port: port,
    dbName: dbName,
    dbPort: dbPort
  }
}
