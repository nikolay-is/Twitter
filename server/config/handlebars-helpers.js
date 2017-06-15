const Handlebars = require('handlebars')

Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1.toString() === v2.toString()) {
    return options.fn(this)
  }
  return options.inverse(this)
})

Handlebars.registerHelper('selected', function (option, value) {
  if (option === value) {
    return ' selected'
  } else {
    return ''
  }
})
