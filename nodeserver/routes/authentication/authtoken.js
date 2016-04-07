var db = require(process.cwd() + '/database');
var config = require(process.cwd() + '/config.js');
var models = require(process.cwd() + "/database/models")
var jwt = require('jsonwebtoken');
var auth = {};
auth.getToken = function(uname, pswd, scb, ecb) {
    //console.log("cwd: "+process.cwd());
    var success = function(user) {
        var secret = config.appsecret;
        var token = jwt.sign(user, secret, {
            expiresInMinutes: 1440 // expires in 24 hours
        });
        scb({
            success: true,
            token: token
        });
    };
    var failure = function(err) {
        ecb(err);
    }
    var userDetailsModel = new models.UserDetailsModel();
    userDetailsModel.setUsername(uname);
    userDetailsModel.setPassword(pswd);
    db.validateUser(userDetailsModel, success, failure);
}
auth.verifyToken = function(token, scb, ecb) {
    jwt.verify(token, config.appsecret, function(err, decoded) {
        if (err) {
            ecb(err);
        } else {
            scb(decoded);
        }
    });
}

module.exports = auth;
