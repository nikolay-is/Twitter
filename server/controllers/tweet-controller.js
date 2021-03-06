const mongoose = require('mongoose')
const Tweet = mongoose.model('Tweet')
const User = mongoose.model('User')
// const Tweet = require('../models/Tweet')

const errorHandler = require('../utilities/error-handler')

function getHtag (str) {
  str = str.slice(str.indexOf('#'))
  let len = str.length - 1
  while (str.charAt(0) === '#' && (len >= 0)) {
    str = str.slice(1)
    len = str.length - 1
    str = str.replace(/#+$/, '')
  }
  return str
}

function getHandle (str) {
  str = str.slice(str.indexOf('@'))
  let len = str.length - 1
  while (str.charAt(0) === '@' && (len >= 0)) {
    str = str.slice(1)
    len = str.length - 1
  }
  str = str.replace(/@+$/, '')
  return str
}

module.exports = {
  addGet: (req, res) => {
    res.render('tweet/add')
  },
  addPost: (req, res) => {
    let message = req.body.message
    if (message.length > 140) {
      res.locals.globalError = `Message cannot be more than 140 characters`
      res.render('tweet/add', {
        message: message
      })
      return
    }

    // message = 'Hello, Twitter! This is my #first #message in aa### your system!'
    // message = 'Hello, Twitter! This is my a###first bb#messa ge## in your system!'
    // let separator = [' ', '.', ',', '!', '?']
    // message = 'Hello, Twitter! This is my afirst bbmessa ge in your system!'

    let tags = []
    let handles = []
    let words = message.split(/[ .,!?]+/g)
    let len = words.length - 1
    for (let i = 0; i <= len; i++) {
      if ((words[i].length > 0) && (words[i].indexOf('#') > -1)) {
        let tag = getHtag(words[i]).toLowerCase()
        if (tag.length - 1 > -1) {
          if (!tags.includes(tag)) {
            tags.push(tag)
          }
        }
      }
      if ((words[i].length > 0) && (words[i].indexOf('@') > -1)) {
        let handle = getHandle(words[i])
        if (handle.length - 1 > -1) {
          if (!handles.includes(handle)) {
            handles.push(handle)
          }
        }
      }
    }

    let tweetObj = {
      message: message,
      author: req.user.id,
      tags: tags,
      handles: handles
    }
    Tweet.create(tweetObj)
    .then((tweet) => {
      let len = handles.length - 1
      for (let i = 0; i <= len; i++) {
        let handledUser = handles[i]
        User.findOne({ username: `${handledUser}` })
          .then(user => {
            if (user) {
              Tweet.create({
                message: tweetObj.message,
                author: user.id,
                tags: tweetObj.tags
                // ,
                // handles: tweetObj.handles
              })
              .then(tweet => {
              })
              .catch(err => {
                console.log(errorHandler.handleMongooseError(err))
              })
            }
          })
      }
      res.redirect('/')
    })
    .catch(err => {
      res.locals.globalError = errorHandler.handleMongooseError(err)
      res.redirect('/')
    })
  },
  editGet: (req, res) => {
    let id = req.params.id
    Tweet.findById(id)
      .then(tweet => {
        res.render('tweet/edit', {
          tweet: tweet
        })
      })
  },
  editPost: (req, res) => {
    let id = req.params.id
    let message = req.body.message

    let tags = []
    let handles = []
    let words = message.split(/[ .,!?]+/g)
    let len = words.length - 1
    for (let i = 0; i <= len; i++) {
      if ((words[i].length > 0) && (words[i].indexOf('#') > -1)) {
        let tag = getHtag(words[i]).toLowerCase()
        if (tag.length - 1 > -1) {
          if (!tags.includes(tag)) {
            tags.push(tag)
          }
        }
      }
      if ((words[i].length > 0) && (words[i].indexOf('@') > -1)) {
        let handle = getHandle(words[i])
        if (handle.length - 1 > -1) {
          if (!handles.includes(handle)) {
            handles.push(handle)
          }
        }
      }
    }

    Tweet.findById(id)
      .then(tweet => {
        tweet.message = message
        tweet.tags = tags
        tweet.handles = handles
        tweet.save()
        .then((t) => {
          res.redirect('/')
        })
        .catch(err => {
          res.locals.globalError = errorHandler.handleMongooseError(err)
          res.redirect('/')
        })
      })
  },
  deleteGet: (req, res) => {
    let id = req.params.id

    Tweet.findById(id)
      .then(tweet => {
        res.render('tweet/delete', {
          tweet: tweet
        })
      })
  },
  deletePost: (req, res) => {
    let id = req.params.id

    Tweet.findByIdAndRemove(id)
      .then(() => {
        res.redirect('/')
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleMongooseError(err)
        res.redirect('/')
      })
  },
  like: (req, res) => {
    let id = req.params.id
    Tweet.findById(id)
      .then(tweet => {
        tweet.likes = tweet.likes + 1
        tweet.save()
          .then(tweet => {
            User.findByIdAndUpdate(req.user.id, {
              $addToSet: { likedItems: tweet.id }
            })
            .then(() => {
              res.redirect('/')
            })
          })
      })
  },
  dislike: (req, res) => {
    let id = req.params.id
    Tweet.findById(id)
      .then(tweet => {
        tweet.likes = tweet.likes - 1
        tweet.save()
          .then(tweet => {
            User.findByIdAndUpdate(req.user.id, {
              $pull: { likedItems: { $in: [tweet.id] } }
            })
            .then(() => {
              res.redirect('/')
            })
          })
      })
  },
  showByTagName: (req, res) => {
    let tagName = req.params.tagName

    Tweet.find({
      tags: { $in: [tagName] }
    })
    .populate('author')
    .sort('-date')
    .limit(100)
    .then(tweets => {
      for (let tweet of tweets) {
        tweet.views++
        tweet.save()
      }
      res.render(`tweet/tag`, {
        tweets: tweets,
        tagName: tagName
      })
    })
  }
}
