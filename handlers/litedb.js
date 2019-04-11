import cogniUtil from '../helpers/cogni-util'

var sqlite3 = require('sqlite3').verbose()
const logger = cogniUtil.logger
let db = new sqlite3.Database('./scripts/mears_poc.db', (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Connected to the Mears POC database.')
  }
})

// db.serialize(function () {
//   var stmt = db.prepare('INSERT INTO Users(firstname,lastname) VALUES (?,?)')
//   for (var i = 0; i < 10; i++) {
//     stmt.run('Ipsum of ' + i, i)
//   }
//   stmt.finalize()

//   db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
//     if (err) {
//       console.log(err)
//     }
//     console.log(row.id + ': ' + row.info)
//   })
// })

const register = (req, res, error) => {
  if (error) {
    logger.info(error)
  }

  var firstname = req.body.firstname
  var lastname = req.body.lastname
  var username = req.body.username
  var password = req.body.password

  db.serialize(function () {
    var stmt = db.prepare('INSERT INTO Users(firstname,lastname,username,password) VALUES (?,?,?,?)')
    stmt.run(firstname, lastname, username, password)
    stmt.finalize()
  })

  res.json({
    'message': 'Registered User successfully'
  })
}

const login = (req, res, error) => {
  if (error) {
    logger.info(error)
  }

  var username = req.body.username
  var password = req.body.password

  db.serialize(function () {
    db.get(`SELECT id as ID from Users where username = "${username}" AND password = "${password}"`, function (err, row) {
      if (err) {
        console.log(err)
      }
      return row
        ? res.json({
          'message': 'User logged in'
        })
        : res.json({ 'error': `Username or password is incorrect` })
    })
  })
}

module.exports = {
  register: register,
  login: login
}

// db.close()
