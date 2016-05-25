/*	==========================================================================
	GLOBAL DOCUMENTATION
	========================================================================== */

/*
 *	pattern = {
 *		id: int,
 *		type: patternType{},
 *		parent: null | pattern,
 *		characteristics: array(characteristic{}),
 *	}
 *
 *	patternType = {
 *		type: string,
 *		characteristics: array(characteristic{}) // note that the characteristic object is limited to the type, no values, no unit.	
 *	}
 *
 *	characteristic musn't be defined by the unit. Give it a signification, like height, width etc... a complet signification
 *	for each type of characteristic, the system allow only one couple of values for a pattern
 *
 *	characteristic = {
 *		type: string,
 *		value: what you want in primary type : int, string, boolean  ! can't be null / undefined
 *		minValue: what you want in primary type : int, string, boolean  ! can't be null / undefined
 *		maxValue: what you want in primary type : int, string, boolean  ! can't be null / undefined
 *		unit: string,	
 *	}
 *
 */



/* List of code and functions can be use by run()
 * rps : readPatterns => return a list of object of Pattern modele
 * rp : readPattern => return a list of the asked pattern (by id)
 * rpt : readPatternTypes => return a list of patternTypes object
 * rc : readCharacteristics => return a list of characteristic
 * wp : writePattern => take a pattern and push it in database, if a id is given (in the pattern object), write on the existing pattern
 * wps : writePatterns => take patterns and push it in database, if a id is given (in the pattern object), write on the existing pattern
 * wpt : writePatternType => create a new patternType
 * wpts : writePatternTypes => create new patternTypes
 * wc : writeCharacteristic => write a new characteristic
 * wcs : writeCharacteristics => write new characteristics
 */


var DBObject = function(socket,user,ready,clientCallback){

/*	==========================================================================
 	MYSQL CONFIGURATION
	========================================================================== */

	this.mysql = require('mysql');

	this.fs = require('fs')

	this.configuration = null;

	this.connection = null;

/*	==========================================================================
	GLOBAL ARGUMENTS
	========================================================================== */

	this.id = null;
	this.socket = socket;

	this.patternsList = new Array();
	this.currentPattern = null;	
	this.schema = null;

	this.queries = null;

	this.async = require("async");

	var dbObject = this;

	var callback = function(err, data){
		console.log('callbaku');
	};

	this.async.waterfall(
		[
			function(callback) {
				dbObject.fs.readFile('mysql_conf.json', 'utf8',callback);
				console.log('Read mysql configuration : OK');
			},
			function(conf,callback) {  

				dbObject.configuration = JSON.parse(conf);
				dbObject.connection = dbObject.mysql.createConnection(dbObject.configuration);
				// Prepare id recovery statement

				var getIdQueryStructure = 'SELECT * FROM SiloAdmin.Users WHERE login = ?;';
				var getIdQueryValues = [user];
				var getIdQuery = dbObject.mysql.format(getIdQueryStructure,getIdQueryValues);				

				// Recovery user id

				dbObject.connection.query(getIdQuery,callback);	
				console.log('Get the if of '+user+' : OK');		

			},
			// 
			function(rows, callback) { 

				dbObject.id = rows[0].id;

				dbObject.queries = {

					getAllFrom : 'SELECT * FROM `PatternSilo'+dbObject.id+'`.??',
					getAllFromWhere : 'SELECT * FROM `PatternSilo'+dbObject.id+'`.?? WHERE ?? = ?',
					insertPattern : 'INSERT INTO `PatternSilo'+dbObject.id+'`.Patterns (type,parent) VALUES (??,??)',
					insertCharacteristic: 'INSERT INTO `PatternSilo'+dbObject.id+'`.Characteristics (type) VALUE (??)',
					insertPatternType: 'INSERT INTO `PatternSilo'+dbObject.id+'`.PatternTypes (type) VALUES (??)',
					insertUnit: 'INSERT INTO `PatternSilo'+dbObject.id+'`.Units (type) VALUES (??)',
					insertPatternCharacteristic: 'INSERT INTO `PatternSilo'+dbObject.id+'`.PatternsCharacteristics (id,type,value,minValue,maxValue,unit) VALUES (??,??,??,??,??,??)'

				};	

				console.log('Prepare queries : OK'); 
				dbObject.socket.emit(clientCallback,'hahahaha');
				ready(true,dbObject);
			},
		],
		// Erreur
		function(err) { console.log('Prepare DBObject : FAIL: ' + err.message); ready(false,null);}
	);
};

/* Will socket couple of code and function, 
 * after each function declaration, push it in this array with the code
 */
/*
DBObject.prototype.listOfQueryFunctions = new Array();

DBObject.prototype.emitOnSocket = function(canal,data) {
	this.socket.emit(canal,data);
};

DBObject.prototype.emitMessageOnSocket = function(message,type) {
	this.emitOnSocket('message',{message:message,type:type});
};

DBObject.prototype.pushQuery = function(query,callback){
	connection.query(query, callback)
};*/

/*
 *	query = {
 *		id: allow the client to know from witch of his queries come the data.
 *		canal: give the canal to emit with the socket
 *		codeQuery: code of the query, see documentation
 *		data: see the documentation of the asket code to know how the data need to be design
 *	}
 *
 */
/*
DBObject.prototype.run = function(query) {



};

DBObject.prototype.readDB = function(first_argument) {
	this.getPatternsList();

	for(pattern in this.patternsList){
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
		for(row in rows){
			this.currentPattern.characteristics.push(row);
		}
	} else {
		console.log(err);
	}
};*/

module.exports = DBObject;