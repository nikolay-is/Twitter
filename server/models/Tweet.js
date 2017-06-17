const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'
const ObjectId = mongoose.Schema.Types.ObjectId

let tweetSchema = new mongoose.Schema({
  message: { type: String, required: REQUIRED_VALIDATION_MESSAGE, maxlength: 140 },
  author: { type: ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'User' },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  tags: [ { type: String } ],
  handles: [ { type: String } ]
})

let Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet
