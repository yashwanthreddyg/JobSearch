var express = require('express');
var config = require(process.cwd() + '/config.js');
var router = express.Router();
var location = require('./location');
var employee = require("./employee");
var employer = require("./employer");
var database = require(process.cwd() + '/database');
var authorizer = require(process.cwd() + '/routes/authentication/authtoken.js');
var jwt = require('jsonwebtoken');
/* GET users listing. */
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        var success = function(decoded) {
            console.log("decoded: " + JSON.stringify(decoded));
            req.decoded = decoded;
            next();
        }
        var failure = function(err) {
            res.status(400).json({
                success: false,
                message: 'Failed to authenticate token.'
            });
        }
        authorizer.verifyToken(token, success, failure);
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
router.get('/', function(req, res, next) {
    //console.log("cwd: "+process.cwd());
    res.json({
        message: 'welcome to the api'
    });
});
router.use('/location', location);
router.use('/employee', employee);
router.use('/employer', employer);

module.exports = router;
