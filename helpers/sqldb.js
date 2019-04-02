/*var mysql = require('mysql2');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: 'cognidesk'
});


/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO cogniLog (http_status_code, response) VALUES (200, 'First Response')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
}); */


connection.connect(function(err) {
    if (err) {
		console.log("Error"+err);
		throw err;
	}
});

module.exports = connection; */