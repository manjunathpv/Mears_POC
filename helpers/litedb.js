import cogniUtil from './../helpers/cogni-util'

var sqlite3 = require('sqlite3').verbose()
const logger = cogniUtil.logger
let db = new sqlite3.Database('../scripts/mears_poc.db', (err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Connected to the Mears POC database.')
})

db.serialize(function () {
  var stmt = db.prepare('INSERT INTO Users VALUES (?,?)')
  for (var i = 0; i < 10; i++) {
    stmt.run('Ipsum of ' + i, i)
  }
  stmt.finalize()

  db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    if (err) {
      console.log(err)
    }
    console.log(row.id + ': ' + row.info)
  })
})

db.close()

const postNames = (req,res,error) =>
{

}

module.exports = postNames