'use strict'

const mysqlHost = process.env.MYSQL_HOST;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPass = process.env.MYSQL_PASS

// const preferences = {
//     tempClientId: 1
// }

const cookieExpiration = 300000
const sessionSecret = process.env.SESSION_SECRET


module.exports = {
    cookieExpiration: cookieExpiration,
    sessionSecret: sessionSecret,
    mysqlHost: mysqlHost,
    mysqlUser: mysqlUser,
    mysqlPass: mysqlPass
}
