module.exports = isSignedIn

function isSignedIn (state) {
  return !!state.session
}
