require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var database = require(process.cwd() + '/database');
var config = require('./config.js');
require('dotenv').config();

var routes = require('./routes');
//var users = require('./routes/users');

var database = require('./database/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('appSecret', config.appsecret);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var secret = app.get('appSecret');

//enabling CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(logger('dev'));
// app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/job-search-app-pg/www')));

app.use(function(req,res,next){
    if(req.method == 'OPTIONS'){
        res.status(200).send();
    }
    else
        next();
});
app.get('/drop',function(req,res){
    database.drop(function(r){
        res.send("success drop");
    },function(r){
        res.send(r);
    });
});
app.get('/delete',function(req,res){
    database.deleteData(function(r){
        res.send("success delete");
    },function(r){
        res.send(r);
    });
});
app.get('/ext',function(req,res){
    database.addExt(function(r){
        res.send("success ext");
    },function(r){
        res.send(r);
    });
});
app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log("Hello, world!");

module.exports = app;
