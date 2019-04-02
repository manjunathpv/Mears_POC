/*
const connection=require('../helpers/sqldb');
var moment = require('moment');

var createAuditLog = function(auditLog, callback) {
  console.log("Connected!");
  console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSSS'));
  console.log(JSON.stringify(auditLog));
  var sql = "INSERT INTO cogniLog (http_status_code,response,response_time,request_url,session_id,client_id,user_id,transaction_id,lastUpdated) VALUES("+auditLog.http_status+",'"+auditLog.response+"',"+auditLog.response_time+",'"+
  auditLog.request_url+ "','"+auditLog.session_id+"',"+
  "'"+auditLog.client_id+"',"+
   "'"+auditLog.user_id+"',"+
   "'"+auditLog.transaction_id+"','"
   +moment().format('YYYY-MM-DD HH:mm:ss.SSSS')+"')";
  connection.query(sql, function (err, result) {
    if (err) {
	console.log("Audit Log insertion failed");
	return callback(err)
	}
    console.log("Audit Log record inserted");
    callback(null)
  });
};

module.exports = createAuditLog; */