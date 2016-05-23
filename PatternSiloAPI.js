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

var configuration = JSON.parse(fs.readFileSync('mysql_conf.json', 'utf8'));

var connection = mysql.createConnection(configuration);

/*	==========================================================================
	GLOBAL ARGUMENTS
	========================================================================== */

/*	==========================================================================
 	SOCKET FUNCTIONS
	========================================================================== */

io.on('connection', function (socket) {
	var login = null;
	var dbObject = null;

	/* User connection */

	/*	
	 *	Check the login and create the DBObject
	 */

	socket.on('login', function (data) {
		ret = checkLogin(data,socket);
		if(ret.type == 'err'){
			socket.emit('message', ret);
			io.emit('user disconnected');
		} else {
			login = data.user;
			dbObject = new DBObject(data);
			socket.emit('message', ret);
		}
	});

	/*	data = {
	 *		query : "query"; 
	 *		values : {};
	 *	}
	 *	see specification in documentation
	 */

	socket.on('query', function (data) {
		var ret = null;
		if (login != null){
			dbObject.run(data,socket);
		} else {
			emitMessage("You're not logged","err",socket);
			io.emit('user disconnected');			
		}
	});	

	/* Admin connection */

	/*	
	 *	Check the password for admin connection
	 */

	socket.on('admin', function (data) {
		if(data != configuration.password){
			emitMessage('login wrong','err',socket);
			io.emit('user disconnected');
		} else {
			login = configuration.user;
			emitMessage('login ok','message',socket);
		}
	});	

	socket.on('create_user', function (data) {
		var ret = null;
		if (login == configuration.user){
			createUser(data,socket);
		} else {
			emitMessage("You're not logged","err",socket);
			io.emit('user disconnected');
		}
	});

	socket.on('delete_user', function (data) {
		var ret = null;
		if (login == configuration.user){
			deleteUser(data,socket);
		} else {
			emitMessage("You're not logged","err",socket);
			io.emit('user disconnected');
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

var checkLogin = function(login,socket){
	var ret = {
		message: null,
		type: null,
	};
	var password = getSha1sum(login.password);
	var queryStructure = 'SELECT FROM SiloAdmin.Users WHERE login = ?? AND password = ??;';
	var queryValues = [login.user,password];
	var query = mysql.format(queryStructure,queryValues);		

	connection.query(query, function(err, rows, fields){

		if (!err) {
			if (typeof rows[0].login != undefined && rows[0].login != null ){
				ret.message = 'Log with user : '+login.user;
				ret.type = 'result';
			} else {
				ret.message = 'User or password wrong';
				ret.type = 'err';				
			}	
		}
		else {
			ret.message = 'Error while performing Query : SELECT FROM SiloAdmin.Users WHERE login = ?? AND password = ??';
			ret.type = 'err';	
		}
		emitMessage(ret,socket);

	});
};

var emitMessage = function(message,type,socket){

	socket.emit('message',{message:message,type:type});

};

/*	==========================================================================
 	ADMIN FUNCTIONS
	========================================================================== */


var createUser = function(login,socket){

	try {

		// Create a transaction

		connection.beginTransaction(function(err){

			if (err) {
			    console.log('Error 101');
			    throw err;	
			}

			// Prepare user creation statement

			var password = getSha1sum(login.password);
			var createUserQueryStructure = 'INSERT INTO SiloAdmin.Users (login,password,id) VALUES (??,??,null);';
			var createUserQueryValues = [login.user,password];
			var createUserQuery = mysql.format(queryStructure,queryValues);		

			// Create user query

			connection.query(createUserQuery, function(err, rows, fields){

				if (err) {
					console.log('Error 102');
					return connection.rollback(function() {
	         			throw err;
	        		});
				}

				// Prepare id recovery statement

				var getIdQueryStructure = 'SELECT * FROM SiloAdmin.Users WHERE login = ??;';
				var getIdQueryValues = [login.user];
				var getIdQuery = mysql.format(queryStructure,queryValues);				

				// Recovery user id

				connection.query(getIdQuery, function(err, rows, fields){

					if (err) {
						console.log('Error 103');
						return connection.rollback(function() {
							throw err;
						});					
					} 

					// Prepare schema creation statement

					var id = rows[0].id;
					var schema = 'PatternSilo'+id;

					var createSchemaQueryStructure = 'CREATE SCHEMA IF NOT EXISTS ?? DEFAULT CHARACTER SET utf8 ;';
					var createSchemaQueryValues = [schema];
					var createSchemaQuery = mysql.format(queryStructure,queryValues);

					// Create schema

					connection.query(createSchemaQuery, function(err, rows, fields){

						if (err) {
							console.log('Error 104');
							return connection.rollback(function() {
								throw err;
							});	
						}

						// Prepare tables creation statement

						fs = require('fs');
						var createTablesQuery = fs.readFileSync('createDB.sql', 'utf8');

						var createTablesQuery = query.replace('mydb',schema);					

						// Create tables

						connection.query(createTablesQuery, function(err, rows, fields){

							if (err) {
								console.log('Error 105');
								return connection.rollback(function() {
									throw err;
								});	
							} 

							console.log('106')
							emitMessage(100,'message',socket);

						});

					});

				});

			});			

		});

	} catch (ex) {
		console.log(ex);
		emitMessage(101,'err',socket);
	}	

};

/*
 *	Don't use for the moment, not secure function
 *
 */

var deleteUser = function(user,socket){
	var ret = {
		message: null,
		type: null,
	};

	var queryStructure = 'DELETE FROM SiloAdmin.Users WHERE login = ??;';
	var queryValues = [user];
	var query = mysql.format(queryStructure,queryValues);	

	connection.query(query, function(err, rows, fields){

		if (!err) {
			ret.message = 'Delete user : '+user;
			ret.type = 'result';
		}
		else {
			ret.message = 'Error while performing Query : DELETE FROM SiloAdmin.Users';
			ret.type = 'err';
		}
		console.log(ret);
		emitMessage(ret,socket);
	});

};

var getSha1sum = function(string){

	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	return shasum.update(string).digest('hex');

};