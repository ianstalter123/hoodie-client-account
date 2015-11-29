module.exports = signOut

var request = require('../utils/request')
var clearSession = require('../utils/clear-session')

function signOut (state) {
  return request({
    url: state.url + '/session',
    headers: {
      authorization: 'Bearer ' + state.session.id
    },
    method: 'DELETE'
  })

  .then(function () {
    var username = state.session.account.username

    clearSession({
      cacheKey: state.cacheKey
    })
    delete state.session

    return { username: username }
  })
}