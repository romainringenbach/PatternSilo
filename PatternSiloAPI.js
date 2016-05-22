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

/*	==========================================================================
 	ADMIN FUNCTIONS
	========================================================================== */



var createUser = function(login){

	var password = getSha1sum(login.password);

	var queryStructure = 'INSERT INTO SiloAdmin.Users (login,password,id) VALUES (??,??,null);';
	var queryValues = [login.user,password];
	var query = mysql.format(queryStructure,queryValues);	

	connection.query(query, function(err, rows, fields){

		if (!err) {
		    console.log('Create user : '+login.user);
		}
		else {
		    console.log('Error while performing Query : INSERT INTO SiloAdmin.Users');	
		}

	});

};

var deleteUser = function(user){

	var queryStructure = 'DELETE FROM SiloAdmin.Users WHERE login = ??;';
	var queryValues = [user];
	var query = mysql.format(queryStructure,queryValues);	

	connection.query(query, function(err, rows, fields){

		if (!err) {
		    console.log('Delete user : '+user);
		}
		else {
		    console.log('Error while performing Query : DELETE FROM SiloAdmin.Users');	
		}

	});

};

var getSha1sum = function(string){

	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	return shasum.update(string).digest('hex');

};

/*var queryResult = function(err, rows, fields){

	if (!err) {
	    console.log('The solution is: ', rows);
	}
	else {
	    console.log('Error while performing Query.');	
	}

};*/