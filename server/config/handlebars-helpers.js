const Handlebars = require('handlebars')

Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1.toString() === v2.toString()) {
    return options.fn(this)
  }
  return options.inverse(this)
})

// Handlebars.registerHelper('selected', function (option, value) {
//   if (option === value) {
//     return ' selected'
//   } else {
//     return ''
//   }
// })

Handlebars.registerHelper('hasLiked', function (user, itemId, options) {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper equal needs 2 parameters')
  }

  if (user.likedItems.indexOf(itemId) < 0) {
    return options.inverse(this)
  } else {
    return options.fn(this)
  }
})
