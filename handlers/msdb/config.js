const msconfig = require('../../config')

// eslint-disable-next-line no-unused-vars
const config =
{
  user: msconfig.mssqlUser,
  password: msconfig.mssqlPass,
  server: msconfig.mssqlHost,
  database: msconfig.mssqlDB,

  options:
    {
      encrypt: msconfig.mssqlEncrypt
    }
}
