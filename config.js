'use strict'

const mssqlHost = process.env.MSSQL_HOST
const mssqlUser = process.env.MSSQL_USER
const mssqlPass = process.env.MSSQL_PASS
const mssqlDB = process.env.MSSQL_DB
const mssqlEncrypt = process.env.MSSQL_ENCRYPT

// const preferences = {
//     tempClientId: 1
// }

const cookieExpiration = 300000
const sessionSecret = process.env.SESSION_SECRET

module.exports = {
  cookieExpiration: cookieExpiration,
  sessionSecret: sessionSecret,
  mssqlHost: mssqlHost,
  mssqlUser: mssqlUser,
  mssqlPass: mssqlPass,
  mssqlDB: mssqlDB,
  mssqlEncrypt: mssqlEncrypt
}
