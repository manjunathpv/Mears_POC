import sql from 'mssql'
const msc = require('./config')
sql.connect(msc.config, function (err) {
  if (err) console.log(err)

  // create Request object
  var request = new sql.Request()

  // query to the database and get the records
  request.query('select * from Users', function (err, res) {
    if (err) console.log(err)

    // send records as a response
    console.log(Object.keys(res.recordset[0]))
  })
})
