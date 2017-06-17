const mongoose = require('mongoose')
const User = require('../models/User')
// const Xxx = require('../models/Xxx')

// require('../models/xxx')
require('../models/Tweet')

mongoose.Promise = global.Promise

module.exports = (settings) => {
  mongoose.connect(settings.dbStr)
  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }

    console.log(`MongoDB connected to "${settings.dbName}" database on port: ${settings.dbPort}`)

    User.seedAdminUser()
  })

  db.on('error', err => console.log(`Database error: ${err}`))
}
