var express = require('express');
var router = express.Router();
var database = require(process.cwd()+'/database');

router.get('/',function(req,res){
    var success = function(locations){
        res.status(200).json(locations);
    }
    var error = function(err){
        res.status(403).json(err);
    }
    database.getLastLocations(success,error);
});
router.get('/:uname',function(req,res){
    var success = function(loc){
        res.status(200).json(loc);
    }
    var error = function(err){
        res.status(403).json(err);
    }
    database.getLastLocationOf(req.params.uname,success,error);
});
router.post('/',function(req,res){
    var success = function(reply){
        res.json(reply);
    }
    var error = function(err){
        res.status(403).json(err);
    }
    var loc = req.body.location;
    database.updateLastLocationOf(req.decoded._doc.username,req.body.location,success,error);
});

module.exports = router;
