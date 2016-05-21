/*	==========================================================================
 	SERVER CONFIGURATION
	========================================================================== */

var http = require('http');
var server = http.createServer(function(req, res){
	console.log('Printed page');
});

var port = process.env.PORT || 5110;
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

var io = require('socket.io')(server);

/*	==========================================================================
 	MYSQL CONFIGURATION
	========================================================================== */

var mysql = require('mysql');

var fs = require('fs')

var configuration = JSON.parse(fs.readFileSync('mysql_conf.json', 'utf8'););

var connection = mysql.createConnection(configuration);

connection = mysql.createConnection();

/*	==========================================================================
	GLOBAL ARGUMENTS
	========================================================================== */

var dbOjectList = new Array();	

/*	==========================================================================
 	SOCKET FUNCTIONS
	========================================================================== */

io.on('connection', function (socket) {
	var login = null;

	/*	
	 *	Check the login and create the DBObject
	 */

	socket.on('login', function (data) {
		if(!checkLogin(data)){
			socket.emit('message', { message: 'login wrong' });
			io.emit('user disconnected');
		} else {
			login = data
			var dbObject = new DBObject(data);
			dbOjectPool.push({login:data,object:dbObject});

		}
	});

	/*
	 *	Disconnect
	 */

	socket.on('disconnect', function () {
		io.emit('user disconnected');
	});

});

/*	==========================================================================
 	SERVER FUNCTIONS
	========================================================================== */

var checkLogin(login){

};