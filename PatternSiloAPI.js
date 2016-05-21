/*	==========================================================================
 	SERVER CONFIGURATIONS
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
	GLOBAL ARGUMENTS
	========================================================================== */

var dbOjectList = new Array();	

/*	==========================================================================
 	SERVER FUNCTIONS
	========================================================================== */

io.on('connection', function (socket) {

	/*	
	 *	Check the login and create the DBObject
	 */

	socket.on('login', function (data) {
		if(!checkLogin(login)){
			socket.emit('message', { message: 'login wrong' });
			io.emit('user disconnected');
		} else {
			var dbObject = new DBObject(login);
			dbOjectPool.push({login:login,object:dbObject});

		}
	});

	/*
	 *	Disconnect
	 */

	socket.on('disconnect', function () {
		io.emit('user disconnected');
	});

});

