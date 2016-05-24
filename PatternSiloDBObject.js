var DBObject = function(socket,user,ready){

/*	==========================================================================
 	MYSQL CONFIGURATION
	========================================================================== */

	this.mysql = require('mysql');

	this.fs = require('fs')

	this.configuration = JSON.parse(fs.readFileSync('mysql_conf.json', 'utf8'););

	this.connection = mysql.createConnection(configuration);

/*	==========================================================================
	GLOBAL ARGUMENTS
	========================================================================== */

	this.patternsList = new Array();
	this.currentPattern = null;	
	this.schema = null;

	this.queries = {

		getAllFrom : 'SELECT * FROM ??',
		getAllFromWhere : 'SELECT * FROM ?? WHERE ?? = ?'

	}	

	/// Récupérer l'ID

	/// Récupérer le schema

	/// Mettre un status : ready / notReady

	/// Récupérer l'intégralité des données et la renvoyée sur un canal prédéfinie ?

	/// 
};

DBObject.prototype.emitOnSocket = function(canal,data) {
	this.socket.emit(canal,data);
};

DBObject.prototype.emitMessageOnSocket = function(message,type) {
	this.emitOnSocket('message',{message:message,type:type});
};

DBObject.prototype.pushQuery = function(query,callback){
	connection.query(query, callback)
};

DBObject.prototype.run = function(query) {



};

DBObject.prototype.readDB = function(first_argument) {
	this.getPatternsList();

	for each(pattern in this.patternsList){
		this.currentPattern = pattern;
		pattern.characteristics = new Array();
		this.getPatternCharac(pattern.id);
	}
};

DBObject.prototype.getPatternsList = function() {
	var queryStructure = this.queries.getAllFrom;
	var queryValues = ['Patterns'];
	var query = mysql.format(queryStructure,queryValues);	
	pushQuery(query,this.getPatternsListCallBack);
};
DBObject.prototype.getPatternsListCallBack = function(err, rows, fields) {
	this.patternsList = rows;
	if (!err) {
		this.patternsList = rows;
	} else {
		console.log(err);
	}	
};
DBObject.prototype.getPatternCharac = function(patternId) {
	var queryStructure = this.queries.getAllFromWhere;
	var queryValues = ['PatternsCharacteristics','id',patternId];
	var query = mysql.format(queryStructure,queryValues);
	pushQuery(query,this.getPatternCharacCallBack);	
};
DBObject.prototype.getPatternCharacCallBack = function(err, rows, fields) {
	if (!err) {
		for each(row in rows){
			this.currentPattern.characteristics.push(row);
		}
	} else {
		console.log(err);
	}
};













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

var clients = new Array();

var queryPool = {

	getAllFrom : 'SELECT * FROM ??',
	getAllFromWhere : 'SELECT * FROM ?? WHERE ?? = ?'

}

/*	==========================================================================
	OBJECTS
	========================================================================== */
var DBReader = function(){

	var patternsList = new Array();
	var currentPattern = null;

};

DBReader.prototype.getPatternsList = function() {
	var queryStructure = queryPool.getAllFrom;
	var queryValues = ['Patterns'];
	var query = mysql.format(queryStructure,queryValues);	
	pushQuery(query,this.getPatternsListCallBack);
};
DBReader.prototype.getPatternsListCallBack = function(err, rows, fields) {
	this.patternsList = rows;
	if (!err) {
		this.patternsList = rows;
	} else {
		console.log(err);
	}	
};
DBReader.prototype.getPatternCharac = function(patternId) {
	var queryStructure = queryPool.getAllFromWhere;
	var queryValues = ['PatternsCharacteristics','id',patternId];
	var query = mysql.format(queryStructure,queryValues);
	pushQuery(query,this.getPatternCharacCallBack);	
};
DBReader.prototype.getPatternCharacCallBack = function(err, rows, fields) {
	if (!err) {
		for each(row in rows){
			this.currentPattern.characteristics.push(row);
		}
	} else {
		console.log(err);
	}
};
DBReader.prototype.run = function(askedData) {

	if () {}


	
	this.getPatternsList();

	for each(pattern in this.patternsList){
		this.currentPattern = pattern;
		pattern.characteristics = new Array();
		this.getPatternCharac(pattern.id);
	}

};

var DBWritter = function(){

}


/*	==========================================================================
	STANDALONE FUNCTIONS
	========================================================================== */

var queryResult = function(err, rows, fields){

	if (!err)
	    console.log('The solution is: ', rows);
	else
	    console.log('Error while performing Query.');	

};

var pushQuery = function(query,callback){

	connection.query(query, callback)
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

		pushQuery(data,queryResult)

	}	

};


var readDB = function(){

	var dbReader = new DBReader()	

};



var readPatternType = function(type){};
var readPatternTypeCallBack = function(err, rows, fields){};

var readPattern = function(id){};
var readPatternCallBack = function(err, rows, fields){};

var writeDB = function(){};
var writeDBCallBack = function(err, rows, fields){};

var writePatternType = function(patternType){};
var writePatternTypeCallBack = function(err, rows, fields){};

var writePattern = function(pattern,alreadyExist){};
var writePatternCallBack = function(err, rows, fields){};

var isPattern = function(pattern){};
var isPatternCallBack = function(err, rows, fields){

	if (rows.length > 0) {
		writePattern
	};

};

