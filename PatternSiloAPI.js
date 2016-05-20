/* SAMPLE

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '< MySQL username >',
  password : '< MySQL password >',
  database : '<your database name>'
});

connection.connect();

connection.query('SELECT * from < table name >', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();

*/

/*	==========================================================================
 	BASIC SERVER CONFIGURATIONS
	========================================================================== */

var http = require('http');
var server = require('http').createServer(function(req, res){
	console.log('Printed page');
});

var port = process.env.PORT || 1337;
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

var io = require('socket.io').listen(server);

/* ==== Loading custom modules === */

//var prevision = require('./dataPrevision.js');

/*	==========================================================================
 	BASIC MYSQL CONFIGURATIONS
	========================================================================== */

var mysql      = require('mysql');
var connection = mysql.createConnection({
	multipleStatements		: true,	
	host					: 'localhost',
	port     				: 'port',
	user     				: '< MySQL username >',
	password 				: '< MySQL password >',
	database 				: '<your database name>'
});

connection = mysql.createConnection({multipleStatements: true});

/*	==========================================================================
	GLOBAL ARGUMENTS
	========================================================================== */



/*	==========================================================================
	OBJECTS
	========================================================================== */

/*	==========================================================================
	STANDALONE FUNCTIONS
	========================================================================== */

var queryResult = function(err, rows, fields){

	if (!err)
	    console.log('The solution is: ', rows);
	else
	    console.log('Error while performing Query.');	

};

var pushQuery = function(query){

	connection.query(query, queryResult)
};

	//> Queries Functions - Get data

var selectAll = new function(table){

	query = 'SELECT * FROM '+table;
	pushQuery(query);

};

	//> Queries Functions - Push data

	//> Queries Functions - Create DB

	//> API Functions

var createDB = function(err,data){

	if(!data && !err){

		fs = require('fs')
		fs.readFile('createDB.sql', 'utf8', createDB);

	} else {

		pushQuery(data)

	}	

};

var readDB = function(){



};

var readPatternType = function(type){



};

var readPattern = function(id){



};

var writeDB = function(){



};

var writePatternType = function(patternType){



};

var writePattern = function(pattern){



};