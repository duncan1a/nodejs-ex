var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var firebaseAdmin = require("firebase-admin");

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

//connect mongoose
var connection_string = '127.0.0.1:27017/fantasycards';
//var connection_string = '130.211.96.216/:27017/' + config.gameCode;// <= google
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
	connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + process.env.OPENSHIFT_APP_NAME; //+ process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connection_string, function(e) {
	console.log('mongo connected...', connection_string)
});


// initialise firebase
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(__dirname + "/specialt-a289f-firebase-adminsdk-4rv2y-8407f58940.json"),
	databaseURL: "https://specialt-a289f.firebaseio.com"
});

var app = express();
// Enables CORS
var enableCORS = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, *');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
};
app.use(enableCORS);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
