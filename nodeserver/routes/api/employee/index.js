var express = require('express');
var router = express.Router();
var database = require(process.cwd() + '/database');
var models = require(process.cwd() + '/database/models');

router.get("/", function(req, res) {
    //get jobs assigned to the employee
    function success(jobs) {
        res.status(200).json({
            records: jobs
        });
    };

    function failure(obj) {
        res.status(400).json({
            msg: obj
        });
    };
    database.getJobsOfEmployee(req.decoded.uname, success, failure);
    // res.json({
    //     msg: 'get jobs assigned to the employee'
    // });
});

router.get("/:lat/:lon/:radius", function(req, res) {
    //get unassigned jobs in the locality

    function success(jobs) {
        res.status(200).json({
            records: jobs
        });
    };

    function failure(obj) {
        res.status(400).json({
            msg: obj
        });
    };
    database.getUnassignedJobsForEmployee(req.decoded.uname, req.params.lat, req.params.lon, req.params.radius, success, failure);

    // res.json({
    //     msg: 'get unassigned jobs in the locality ' + req.params.lat + ',' + req.params.lon + "," + req.params.radius
    // });
});

router.post("/:jid", function(req, res) {
    //post a bid for the job
    var bidModel = new models.BidModel();
    bidModel.setJobID(req.params.jid);
    bidModel.setMessage(req.body.message);
    bidModel.setBidderID(req.decoded.uname);


    function success(jobs) {
        res.status(200).json({
            records: jobs
        });
    };

    function failure(obj) {
        res.status(400).json({
            msg: obj
        });
    };
    database.addBid(bidModel, success, failure);
    // res.json({
    //     msg: 'post a bid for the job ' + req.params.jid
    // });
});

module.exports = router;
