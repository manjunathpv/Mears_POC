'use strict'

const mysql = require('mysql')
const config = require('../config')

var con = mysql.createConnection({
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPass,
  database: config.mysqlDB
})

con.connect(function (err) {
  if (err) throw err
  console.log('Connected to the database!!!')
})

con.query(`CREATE TABLE IF NOT EXISTS 
Users
(
UserID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
FirstName varchar(255) NOT NULL,
LastName varchar(255),
Email varchar(255),
Password varchar(255),
Created_At Date,
UNIQUE KEY unique_email (email)
)
`, function (err) {
  if (err) {
    console.log('Something wrong with the SQL.\nThe error is \n', err)
  }
  console.log('Table created successfully')
})

// const createUser

// const get = (database, params, callback) => {
//     const db = cloudant.db.use(database);
//     getAll(database, (error, data) => {
//         if (error) {
//             console.log('Error: Unable to get documant with ', error);
//             return callback(error, null);
//         }
//         const filteredData = _.filter(data.data, params);
//         return callback(null, { data: filteredData });
//     });
// };

// const save = (database, params, callback) => {
//     const db = cloudant.db.use(database);
//     db.insert(params, (error, status) => {
//         if (error) {
//             console.log('Error: Unable to insert documant with ', error);
//             return callback(error, null);
//         }
//         callback(null, { status: status });
//     })
// }

// const remove = (database, params, callback) => {
//     const db = cloudant.db.use(database);
//     db.destroy(params._id, params._rev, (error, status) => {
//         if (error) {
//             console.log('Error: Unable to remove documant with ', error);
//             return callback(error, null);
//         }
//         return callback(null, { status: status });
//     })
// };

// const indexes = (callback) => {
//     db.index((error, result) => {
//         if (error) {
//             return callback(error, null);
//         }

//         console.log('The database has %d indexes', result.indexes.length);
//         for (var i = 0; i < result.indexes.length; i++) {
//             console.log('  %s (%s): %j', result.indexes[i].name, result.indexes[i].type, result.indexes[i].def);
//         }
//         return callback(null, { data: result.indexes });
//     })
// }

// const addIndex = (indexes, callback) => {
//     db.index(_composeIndexes(indexes), function (er, response) {
//         if (er) {
//             throw er;
//         }
//         console.log('Index creation result: %s', response.result);
//     });
// }

// const _composeIndexes = (params) => {
//     if (!params.name || !params.type || !params.fields) {
//         return params
//     }
//     if (params.fields && !Array.isArray(params.fields)) {
//         params.fields = [params.fields]
//     }
//     return { name: params.name, type: params.type, index: { fields: params.fields } }
// }

// const formatDbData = (data) => {
//     data = data.rows
//     const dataLength = data.length
//     for (let i = 0; i < dataLength; i++){
//         data[i] = data[i].doc
//     }
//     return data
// }

// module.exports = {
//     databases: databases,
//     indexes: indexes,
//     get: get,
//     getAll: getAll,
//     save: save,
//     remove: remove
// };
