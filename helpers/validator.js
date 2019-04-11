const validatePassword = (req, res) => {
  // eslint-disable-next-line no-useless-escape
  var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
  return req.match(strongRegex)
}

module.exports = {
  // validateUsername: validateUsername
  validatePassword: validatePassword
}
