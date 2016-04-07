var pg = require('pg');
var models = require('./database/models/index.js');
var DatabaseClass = require("./database/");
var config = require('./config.js');

var testUserInsert = function() {
    var client = new pg.Client(config.dburl);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } else {
            db = new DatabaseClass(client);
            var successRegister = function(obj) {
                console.log("register success");
                client.end();
            };
            var errorRegister = function(obj) {
                console.log("register failure");
                client.end();
            };
            var userModel = new models.UserDetailsModel();
            userModel.setUsername("yashwanth");
            userModel.setPassword("yashwanth");
            db.registerUser(userModel, successRegister, errorRegister);
        }
    });
};

var testUserValidate = function() {
    var client = new pg.Client(config.dburl);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } else {
            db = new DatabaseClass(client);
            var successValidate = function(obj) {
                console.log("validate success");
                client.end();
            };
            var errorValidate = function(obj) {
                console.log("register failure");
                client.end();
            };
            var userModel = new models.UserDetailsModel();
            userModel.setUsername("sampleuser02");
            userModel.setPassword("sampleuser02");
            db.validateUser(userModel, successValidate, errorValidate);
        }
    });
};

var testJobInsert = function() {
    var client = new pg.Client(config.dburl);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } else {
            db = new DatabaseClass(client);
            var successInsert = function(obj) {
                console.log("job insert success");
                client.end();
            };
            var errorInsert = function(obj) {
                console.log("job insert failure");
                client.end();
            };
            var jobModel = new models.JobModel();
            jobModel.setEmployerUsername("sampleuser01");
            jobModel.setLatitude("17.414489");
            jobModel.setLongitude("78.543192");
            jobModel.setJobDescription("this is a nice job");
            db.addJob(jobModel, successInsert, errorInsert);
        }
    });
};
var testBidInsert = function() {
    var client = new pg.Client(config.dburl);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } else {
            db = new DatabaseClass(client);
            var successInsert = function(obj) {
                console.log("bid insert success");
                client.end();
            };
            var errorInsert = function(obj) {
                console.log("bid insert failure");
                client.end();
            };
            var bidModel = new models.BidModel();
            bidModel.setJobID("213d5a48-3c6b-4250-afef-a0a38203a8fe");
            bidModel.setBidderID("sampleuser03");
            bidModel.setMessage("hi i want that job");
            db.addBid(bidModel, successInsert, errorInsert);
        }
    });
};

var testGetUnassignedJobsForEmployee = function() {
    var client = new pg.Client(config.dburl);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } else {
            db = new DatabaseClass(client);
            var successGettingJobs = function(obj) {
                console.log("get Jobs success " + JSON.stringify(obj));
                client.end();
            };
            var errorGettingJobs = function(obj) {
                console.log("get Jobs failure");
                client.end();
            };
            db.getUnassignedJobsForEmployee("sampleuser02", "17.414489", "78.543192", "10000", successGettingJobs, errorGettingJobs);
        }
    });
};
var testGetJobsOfEmployer = function() {
    var client = new pg.Client(config.dburl);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } else {
            db = new DatabaseClass(client);
            var successGettingJobs = function(obj) {
                console.log("get Jobs success " + JSON.stringify(obj));
                client.end();
            };
            var errorGettingJobs = function(obj) {
                console.log("get Jobs failure");
                client.end();
            };
            db.getJobsOfEmployer("sampleuser02", successGettingJobs, errorGettingJobs);
        }
    });
};
var testGetJobsOfEmployee = function() {
    var client = new pg.Client(config.dburl);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } else {
            db = new DatabaseClass(client);
            var successGettingJobs = function(obj) {
                console.log("get Jobs success " + JSON.stringify(obj));
                client.end();
            };
            var errorGettingJobs = function(obj) {
                console.log("get Jobs failure");
                client.end();
            };
            db.getJobsOfEmployee("sampleuser01", successGettingJobs, errorGettingJobs);
        }
    });
};

var testAssignJob = function() {
    var client = new pg.Client(config.dburl);
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        } else {
            db = new DatabaseClass(client);
            var successGettingJobs = function(obj) {
                console.log("assign Job success " + JSON.stringify(obj));
                client.end();
            };
            var errorGettingJobs = function(obj) {
                console.log("assign Job failure");
                client.end();
            };
            db.assignJob("213d5a48-3c6b-4250-afef-a0a38203a8fe", "sampleuser01", "sampleuser02", successGettingJobs, errorGettingJobs);
        }
    });
};
testUserInsert();
// testUserValidate();
// testJobInsert();
// testBidInsert();
// testGetUnassignedJobsForEmployee();
// testGetJobsOfEmployer();
// testAssignJob();
// testGetJobsOfEmployee();
