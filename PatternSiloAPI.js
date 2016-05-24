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

var io = require('socket.io').listen(server);

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
 	SERVER FUNCTIONS
	========================================================================== */

var checkLogin = function(login,callback){
	var password = getSha1sum(login.password);
	var queryStructure = 'SELECT * FROM `SiloAdmin`.`Users` WHERE login = ? AND password = ?;';
	var queryValues = [login.user,password];
	var query = mysql.format(queryStructure,queryValues);		

	connection.query(query, function(err, rows, fields){

		if (!err) {
			if (rows.length != 0){
				callback(login.user,true,'Log with user : '+login.user,'message');	
			} else {
				callback(login.user,false,'User or password wrong','err');				
			}	
		}
		else {
			console.log(err);
		}

	});


};
/*	==========================================================================
 	ADMIN FUNCTIONS
	========================================================================== */

var createUser = function(login){


	// Create a transaction

	connection.beginTransaction(function(err){

		if (err) {
		    console.log('Error 101');
		    throw err;	
		}

		connection.query('SET autocommit=0;',function(err, rows, fields){

			if (err) {
				console.log('Error 102');
				return connection.rollback(function() {
         			throw err;
        		});
			}

			// Prepare user creation statement

			var password = getSha1sum(login.password);
			console.log('create user :',login.user,password);
			var createUserQueryStructure = 'INSERT INTO SiloAdmin.Users (login,password) VALUES (?,?);';
			var createUserQueryValues = [login.user,password];

			var createUserQuery = mysql.format(createUserQueryStructure,createUserQueryValues);	
			// Create user query

			connection.query(createUserQuery, function(err, rows, fields){

				if (err) {
					console.log('Error 103');
					return connection.rollback(function() {
	         			throw err;
	        		});
				}

				// Prepare id recovery statement

				var getIdQueryStructure = 'SELECT * FROM SiloAdmin.Users WHERE login = ?;';
				var getIdQueryValues = [login.user];
				var getIdQuery = mysql.format(getIdQueryStructure,getIdQueryValues);				


				// Recovery user id

				connection.query(getIdQuery, function(err, rows, fields){

					if (err) {
						console.log('Error 104');
						return connection.rollback(function() {
							throw err;
						});					
					} 

					// Prepare schema creation statement

					var id = rows[0].id;
					var schema = 'PatternSilo'+id;

					var createSchemaQueryStructure = 'CREATE SCHEMA IF NOT EXISTS ?? DEFAULT CHARACTER SET utf8 ;';
					var createSchemaQueryValues = [schema];
					var createSchemaQuery = mysql.format(createSchemaQueryStructure,createSchemaQueryValues);

					// Create schema

					connection.query(createSchemaQuery, function(err, rows, fields){

						if (err) {
							console.log('Error 105');
							return connection.rollback(function() {
								throw err;
							});	
						}

						// Prepare tables creation statement

						fs = require('fs');
						var script = fs.readFileSync('createDB.sql', 'utf8');

						createTablesQuery = script.replace(/mydb/g,schema);					
						
						// Create tables

						connection.query(createTablesQuery, function(err, rows, fields){
							if (err) {
								console.log('Error 106');
								return connection.rollback(function() {
									throw err;
								});	
							} 

							// Commit

							connection.commit(function(err) {
						        if (err) {
						        	console.log('Error 107');
						        	return connection.rollback(function() {
						            	throw err;
						          	});
						        }

						        // Reset auto commit to 1

								connection.query('SET autocommit=1;',function(err, rows, fields) {
							        if (err) {
							        	console.log('Error 108');
							        	return connection.rollback(function() {
							            	throw err;
							          	});
							        }
							        console.log('success!');
						      	});					        
							});						
						});
					});
				});
			});			
		});
	});
};

/*
 *	Don't use for the moment, not secure function
 *
 */

var deleteUser = function(user,socket){

	var queryStructure = 'DELETE FROM SiloAdmin.Users WHERE login = ?;';
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

/*	==========================================================================
 	SOCKET FUNCTIONS
	========================================================================== */

io.on('connection', function (socket) {

	var login = null;
	var dbObject = null;

	var emitMessage = function(message,type){

		socket.emit('message',{message:message,type:type});

	};

	var loginOk = function(user,awnser,message,type){
		
		if (awnser) {
			login = 'ok';
		}
		emitMessage(message,type);

		//dbObject = new DBObject(socket,user);
	};

	socket.emit('message','Welcom')

	var socketID = socket.id;
	console.log(socketID+' is connected');

	socket.on('lol', function(data){

		console.log('ping : ',data);
		socket.emit('message','pong');

	})

	/* User connection */

	/*	
	 *	Check the login and create the DBObject
	 */

	socket.on('login', function (data) {
		try {
			checkLogin(data,loginOk);
		} catch(ex){
			console.log(ex);
			emitMessage('Can not log','err');
		}
	});

	socket.on('query', function (data) {
		if (login != null){
			//dbObject.run(data,socket);
			emitMessage('not work for the moment','err');
		} else {
			emitMessage("You're not logged","err",socket);
			io.emit('user disconnected');			
		}
	});	

	/* Admin connection */

	var callback = function(){
		console.log('Ho my got ! ERROR');
	};

	/*	
	 *	Check the password for admin connection
	 */

	socket.on('admin', function (data) {
		if(data != configuration.password){
			emitMessage('login wrong','err');
			io.emit('user disconnected');
			console.log('Someone try to connect as Admin');
		} else {
			login = configuration.user;
			emitMessage('login ok','message');
			console.log('Admin connected');
		}
	});	

	socket.on('create_user', function (data) {
		if (login == configuration.user){
			try {
				createUser(data);
				emitMessage(100,'message');
			} catch (ex) {
				console.log(ex);
				callback(ex);
				emitMessage(101,'err');
			}	
		} else {
			emitMessage("You're not logged","err");
			io.emit('user disconnected');
		}
	});

	socket.on('delete_user', function (data) {
		var ret = null;
		if (login == configuration.user){
			deleteUser(data,socket);
		} else {
			emitMessage("You're not logged","err");
			io.emit('user disconnected');
		}
	});		

	/*
	 *	Disconnect client
	 */

	socket.on('disconnect', function () {
		io.emit('user disconnected');
	});

	/*
	 *	Disconnect User (ex: for another login...)
	 */

	socket.on('logout', function(){
		emitMessage('You logout','message');
		login = null;
	}); 

});