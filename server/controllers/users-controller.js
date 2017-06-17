const encryprion = require('../utilities/encryption')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const errorHandler = require('../utilities/error-handler')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validation
    // if (reqUser.username.lenght < 3)
    User.findOne({username: reqUser.username})
      .then(user => {
        if (user) {
          res.locals.globalError = `User "${user.username}" is allready exist!`
          res.render('users/register', {
            user: reqUser
          })
          return
        }

        let salt = encryprion.generateSalt()
        let hashedPassword = encryprion.generateHashedPassword(salt, reqUser.password)

        User.create({
          username: reqUser.username,
          firstName: reqUser.firstName,
          lastName: reqUser.lastName,
          salt: salt,
          hashedPass: hashedPassword,
          roles: ['User']
        }).then(user => {
          req.logIn(user, (err, user) => {
            if (err) { // locals - can access in all views and ...
              res.locals.globalError = err
              res.render('users/register', user)
            }

            res.redirect('/')
          })
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User.findOne({username: reqUser.username}).then(user => {
      if (!user) {
        res.locals.globalError = 'Invalid user data'
        res.render('users/login')
        return
      }

      if (!user.authenticate(reqUser.password)) {
        res.locals.globalError = 'Invalid user data'
        res.render('users/login')
        return
      }

      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/login')
        }

        res.redirect('/')
      })
    })
  },
  profile: (req, res) => {
    let username = req.params.username
    User.findOne({ username: username })
      .then(user => {
        res.render('users/profile', { user: user })
      })
  },
  adminGet: (req, res) => {
    User.find({ roles: { $ne: 'Admin' } })
      .then(users => {
        res.render('users/admin-add', {
          users: users
        })
      })
  },
  adminPost: (req, res) => {
    let userId = req.body.user
    User.findByIdAndUpdate(userId, { $addToSet: { roles: 'Admin' } })
      .then(() => {
        res.redirect('/admins/all')
      })
  },
  all: (req, res) => {
    User.find({ roles: { $in: ['Admin'] } })
      .then(admins => {
        res.render('users/admin-all', {
          admins: admins
        })
      })
  },
  block: (req, res) => {
    let userId = req.params.id
    User.findByIdAndUpdate(userId, { $set: { blocked: true } })
      .then(user => {
        res.redirect(`/profile/${user.username}`)
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  },
  unblock: (req, res) => {
    let userId = req.params.id
    User.findByIdAndUpdate(userId, { $set: { blocked: false } })
      .then(user => {
        res.redirect(`/profile/${user.username}`)
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.redirect('/')
      })
  }
}
