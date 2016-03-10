//"node server.js" to start server
//http://localhost:5000/...

var connect = require('connect');
connect.createServer(
	connect.static(".")
).listen(5000);
