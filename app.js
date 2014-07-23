/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// MongoClient
var MongoClient = require('mongodb').MongoClient;
// Database
var db;

// setup mongo connection
MongoClient.connect('mongodb://127.0.0.1:27017/messageDB', function(err,
		database) {
	if (err) {
		throw err;
	} else {
		db = database;
		console.log("Connected to MongoDB!");
	}
});

// make db accessible from router
app.use(function(req, res, next) {
	req.db = db;
	next();
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

io.on('connection', function(socket) {
	socket.on('message', function(msg) {
		//emit message to all connected clients
		io.emit('message', msg);
	});
});

// routes
app.get('/', routes.getMessages);
app.post('/chat', routes.createMessage);
app.post('/clear', routes.deleteMessages);

http.listen(3000, function() {
	console.log('Express server listening on port 3000');
});
