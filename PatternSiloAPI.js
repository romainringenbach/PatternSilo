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
			resultQuery = dbObject.run(data,socket);
			ret = resultQuery.ret;
			result = resultQuery.result;
			socket.emit('message', ret);
			socket.emit('data', result);
		} else {
			ret = {message:"You're not logged",type:"err"};
			socket.emit('message', ret);
			io.emit('user disconnected');			
		}
	});	

	/* Admin connection */

	/*	
	 *	Check the password for admin connection
	 */

	socket.on('admin', function (data) {
		if(data != configuration.password){
			socket.emit('message', { message: 'login wrong' });
			io.emit('user disconnected');
		} else {
			login = configuration.user;
			socket.emit('message', { message: 'login ok' });
		}
	});	

	socket.on('create_user', function (data) {
		var ret = null;
		if (login == configuration.user){
			ret = createUser(data,socket);
			socket.emit('message', ret);
		} else {
			ret = {message:"You're not logged",type:"err"};
			socket.emit('message', ret);
			io.emit('user disconnected');
		}
	});

	socket.on('delete_user', function (data) {
		var ret = null;
		if (login == configuration.user){
			ret = deleteUser(data,socket);
			socket.emit('message', ret);
		} else {
			ret = {message:"You're not logged",type:"err"};
			socket.emit('message', ret);
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

var emitMessage = function(object,socket){

	socket.emit('message',object);

};

/*	==========================================================================
 	ADMIN FUNCTIONS
	========================================================================== */

/*
 *	Create user
 * 	Initiation function, insert the login in the user table
 */

var createUser = function(login,socket){

	var ret = {
		message: null,
		type: null,
	};
	var password = getSha1sum(login.password);

	var queryStructure = 'INSERT INTO SiloAdmin.Users (login,password,id) VALUES (??,??,null);';
	var queryValues = [login.user,password];
	var query = mysql.format(queryStructure,queryValues);	

	connection.query(query, function(err, rows, fields){

		if (!err) {
			createUserSchema(login,socket);
		} else {
			ret.message = 'Can not create the user '+login.user;
			ret.type = 'err';
		    console.log(ret);	
		    emitMessage(ret,socket);
		}

	});
};

/*
 *	Get the if of the new user
 *
 */

var createUserGetId = function(login,socket){
	var ret = {
		message: null,
		type: null,
	};

	var id =null;

	queryStructure = 'SELECT * FROM SiloAdmin.Users WHERE login = ??;';
	queryValues = [login.user];
	query = mysql.format(queryStructure,queryValues);		

	connection.query(query, function(err, rows, fields){

		if (!err) {
			createUserCreateSchema(id,socket);
		} else {
			ret.message = 'Can not get id of '+login.user;
			ret.type = 'err';
		    console.log(ret);
		    emitMessage(ret,socket);	
		}

	});
};

/*
 *	Create the schema with id
 *
 */

var createUserCreateSchema = function(id,socket){
	var ret = {
		message: null,
		type: null,
	};
	var schema = 'PatternSilo'+id;
	queryStructure = 'CREATE SCHEMA IF NOT EXISTS ?? DEFAULT CHARACTER SET utf8 ;';
	queryValues = [schema];
	query = mysql.format(queryStructure,queryValues);		

	connection.query(query, function(err, rows, fields){

		if (!err) {
			createUserCreateTables(schema,socket);
		} else {
			ret.message = 'Can not create schema';
			ret.type = 'err';
		    console.log(ret);
		    emitMessage(ret,socket);	
		}

	});
};

/*
 *	Create the table under the schema
 *
 */

var createUserCreateTables = function(schema,socket){
	var ret = {
		message: null,
		type: null,
	};

	fs = require('fs');
	query = fs.readFileSync('createDB.sql', 'utf8');

	query = query.replace('mydb',schema);		

	connection.query(query, function(err, rows, fields){

		if (!err) {
			ret.message = 'Create user : '+login.user;
			ret.type = 'result';
		    console.log(ret);
		}
		else {
			ret.message = 'Can not create tables';
			ret.type = 'err';	
		}
		console.log(ret);
		emitMessage(ret,socket);

	});
};

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