const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/profile/:username', auth.isAuthenticated, controllers.users.profile)
  app.post('/users/block/:id', controllers.users.block)
  app.post('/users/unblock/:id', controllers.users.unblock)

  app.get('/admins/add', auth.isInRole('Admin'), controllers.users.adminGet)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.users.adminPost)
  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.all)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
