var express = require('express');
var router = express.Router();
var db = require(process.cwd() + '/database');
var models = require(process.cwd()+'/database/models');

router.post('/', function(req, res) {
    function success(reply) {
        res.send(reply);
    };

    function error(err) {
        res.status(403).json(err);
    };
    var userDetailsModel = new models.UserDetailsModel(req.body.username,req.body.password);
    
    db.registerUser(userDetailsModel, success, error);
});

module.exports = router;
