var simple = require('simple-mock')
var test = require('tape')

var signIn = require('../../lib/sign-in')

test('signIn without options', function (t) {
  t.plan(1)

  signIn({})
    .then(t.fail.bind(t, 'must reject'))
    .catch(t.pass.bind(t, 'rejects with error'))
})

test('signIn without password', function (t) {
  t.plan(1)

  signIn({}, {
    username: 'username'
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('signIn without username', function (t) {
  t.plan(1)

  signIn({}, {
    password: 'password'
  })

  .catch(function (error) {
    t.is(typeof error, 'object', 'rejects with error object')
  })
})

test('successful account.signIn(options)', function (t) {
  t.plan(5)

  simple.mock(signIn.internals, 'request').resolveWith({
    body: 'response body'
  })
  simple.mock(signIn.internals, 'serialise').returnWith('serialised')
  simple.mock(signIn.internals, 'deserialise').returnWith({
    id: 'abc1234'
  })
  simple.mock(signIn.internals, 'saveSession').callFn(function () {})

  signIn({
    url: 'http://example.com',
    cacheKey: 'cacheKey123'
  }, {
    username: 'pat',
    password: 'secret'
  })

  .then(function (session) {
    t.deepEqual(signIn.internals.request.lastCall.arg, {
      method: 'PUT',
      url: 'http://example.com/session',
      body: 'serialised'
    })
    t.deepEqual(signIn.internals.deserialise.lastCall.arg, 'response body')
    t.deepEqual(signIn.internals.saveSession.lastCall.arg, {
      cacheKey: 'cacheKey123',
      session: {
        id: 'abc1234',
        account: {
          username: 'pat'
        }
      }
    })

    t.equal(session.sessionId, 'abc1234', 'resolves with session.id')
    t.equal(session.username, 'pat', 'resolves with session.account.username')

    simple.restore()
  })

  .catch(t.error)
})

test('signIn with request error', function (t) {
  t.plan(1)

  simple.mock(signIn.internals, 'request').rejectWith(new Error('Ooops'))

  signIn({})

  .then(t.fail.bind(t, 'must reject'))

  .catch(function (error) {
    t.is(typeof error, 'object', 'returns error object')
    simple.restore()
  })
})