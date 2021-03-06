module.exports = Account

var getSession = require('./helpers/get-session')

function Account (options) {
  if (!(this instanceof Account)) {
    return new Account(options)
  }

  if (!options || !options.url) {
    throw new Error('options.url is required')
  }

  var state = {
    url: options.url,
    validate: options.validate || function () {}
  }

  getSession(state)

  return {
    signUp: require('./lib/signup').bind(this, state),
    signIn: require('./lib/signin').bind(this, state),
    signOut: require('./lib/signout').bind(this, state),
    isSignedIn: require('./lib/is-signedin').bind(this, state),
    get: require('./lib/get').bind(this, state, 'account'),
    fetch: require('./lib/fetch').bind(this, state, 'account'),
    profile: {
      get: require('./lib/get').bind(this, state, 'account.profile'),
      fetch: require('./lib/fetch').bind(this, state, 'account.profile'),
      update: require('./lib/update-profile').bind(this, state)
    }
  }
}
