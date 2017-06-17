const mongoose = require('mongoose')
const Tweet = mongoose.model('Tweet')

module.exports = {
  about: (req, res) => {
    res.render('home/about')
  },
  index: (req, res) => {
    Tweet.find()
      .populate('author')
      .sort('-date')
      .limit(100)
      .then(tweets => {
        for (let tweet of tweets) {
          tweet.views++
          tweet.save()
        }
        res.render('home/index', {
          tweets: tweets
        })
      })
  }
}
