var express = require('express');
var config = require(process.cwd() + '/config.js');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require(process.cwd() + '/database');
var authorizer = require('./authtoken.js');

router.post('/', function(req, res) {
    if (req.body.username && req.body.password) {
        var success = function(token) {
            res.send(token);
        };
        var failure = function(err) {
            res.status(403).send(err);
        }
        authorizer.getToken(req.body.username, req.body.password, success, failure);
    }
});
module.exports = router;
