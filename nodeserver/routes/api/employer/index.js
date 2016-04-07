var express = require('express');
var router = express.Router();
var database = require(process.cwd() + '/database');
var models = require(process.cwd() + '/database/models');

router.get('/', function(req, res) {
    //all jobs created by employer
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

    database.getJobsOfEmployer(req.decoded.uname, success, failure);

});
router.put('/:jid/:eid', function(req, res) {
    //assign job jid to eid
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
    database.assignJob(req.params.jid, req.decoded.uname, req.params.eid, success, failure);
    // res.json({
    //     msg: 'assign job jid to eid ' + req.params.jid + "," + req.params.eid
    // });
});
router.post('/', function(req, res) {
    //create new job
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
    var jobModel = new models.JobModel();
    jobModel.setTitle(req.body.title);
    jobModel.setEmployerUsername(req.decoded.uname);
    jobModel.setJobDescription(req.body.description);
    jobModel.setLatitude(req.body.latitude);
    jobModel.setLongitude(req.body.longitude);

    database.addJob(jobModel, success, failure);
    // res.json({
    //     msg: 'create new job'
    // });
});
router.delete('/:jid', function(req, res) {
    //delete job jid
    res.json({
        msg: 'delete job jid ' + req.params.jid
    });
});

module.exports = router;
