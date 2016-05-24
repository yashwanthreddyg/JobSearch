var pg = require('pg');
var utils = require('./Utilities.js');
var config = require('../config.js');
var models = require('./models');
var uuid = require('node-uuid');
var conString = process.env.DATABASE_URL;

var client = new pg.Client(conString);
client.connect(function(err) {
    console.log(conString);
    if (err) {
        return console.error('could not connect to postgres', err);
    }
    client.query('SELECT NOW() AS "theTime"', function(err, result) {
        if (err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].theTime);
        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
        // client.end();
    });

    client.query('select * from tbl_user', function(err, res) {
        if (err) {
            client.query('CREATE TABLE tbl_user(\
            USERNAME VARCHAR(20) PRIMARY KEY NOT NULL,\
            PASSWORD VARCHAR(20) NOT NULL,\
            TIME_OF_CREATION TIMESTAMP NOT NULL)', function(err, result) {
                if (!err) {
                    client.query('CREATE TABLE tbl_job(\
                    JOB_ID UUID PRIMARY KEY,\
                    TITLE VARCHAR(30) NOT NULL,\
                    EMPLOYER VARCHAR(20) REFERENCES tbl_user(USERNAME) on delete cascade,\
                    DESCRIPTION TEXT NOT NULL,\
                    THE_GEOM GEOMETRY NOT NULL,\
                    TIME_OF_CREATION TIMESTAMP NOT NULL,\
                    ASSIGNED_TO VARCHAR(20) REFERENCES tbl_user(USERNAME),\
                    ASSIGNED_AT TIMESTAMP)', function(err, result) {
                        if (!err) {
                            client.query('CREATE TABLE tbl_bid(\
                            BID_ID UUID PRIMARY KEY,\
                            JOB_ID UUID REFERENCES tbl_job(JOB_ID) on delete cascade,\
                            EMPLOYEE VARCHAR(20) REFERENCES tbl_user(USERNAME) on delete cascade,\
                            MESSAGE TEXT NOT NULL,\
                            TIME_OF_CREATION TIMESTAMP NOT NULL)', function(err, result) {
                                if (err) {
                                    return console.error('err table 3', err);
                                }
                                console.log("done making tables");
                            })
                        } else {
                            return console.error('err table 2', err);
                        }
                    });
                } else {
                    return console.error('err table 1', err);
                }
            });
        } else {
            console.log("tables present");
        }
    });

});
var database = this;
database.setupTables = function(scb, ecb) {
    // client.query("CREATE TABLE tbl_user(\
    //     USERNAME VARCHAR(20) PRIMARY KEY NOT NULL,\
    //     PASSWORD VARCHAR(20) NOT NULL,\
    //     TIME_OF_CREATION TIMESTAMP NOT NULL\
    // )",function(err));
};

database.registerUser = function(userDetailsModel, scb, ecb) {
    if(userDetailsModel.getUsername() == "" || userDetailsModel.getPassword()==""){
        return ecb({msg:"empty creds"});
    }
    var queryConfig = {
        text: "insert into tbl_user values($1,$2,$3)",
        values: [userDetailsModel.getUsername(), userDetailsModel.getPassword(), utils.getDateTime()]
    };
    // var queryStr = "insert into tbl_user values(" +
    //     utils.getQuotedStr(userDetailsModel.getUsername()) + "," + utils.getQuotedStr(userDetailsModel.getPassword()) + "," + utils.getQuotedStr(utils.getDateTime()) + ")";
    // client.query("insert into tbl_user values("+);
    client.query(queryConfig, function(err, result) {
        if (err) {
            ecb(err);
        } else {
            scb(result);
        }
    });
};

database.validateUser = function(userDetailsModel, scb, ecb) {
    var queryConfig = {
        text: "select * from tbl_user where username = $1",
        values: [userDetailsModel.getUsername()]
    };
    // var queryStr = "select * from tbl_user where username like " + utils.getQuotedStr(userDetailsModel.getUsername());
    client.query(queryConfig, function(err, result) {
        if (err) {
            ecb(err);
        } else {
            if (result.rows.length > 0) {
                if (result.rows[0].password == userDetailsModel.getPassword()) {
                    scb(userDetailsModel);
                } else {
                    ecb({
                        msg: "wrong password"
                    });
                }
            } else {
                ecb({
                    msg: "no user"
                });
            }
        }
    });
};

database.addJob = function(jobModel, scb, ecb) {
    var queryConfig = {
        text: "insert into tbl_job values($1,$2,$3,$4,ST_GeomFromText('POINT(" +
            jobModel.getLongitude() + " " + jobModel.getLatitude() + ")'),$5)",
        values: [uuid.v4(), jobModel.getTitle(), jobModel.getEmployerUsername(), jobModel.getJobDescription(), utils.getDateTime()]
    };
    // var queryStr = "insert into tbl_job values(" + utils.getQuotedStr(uuid.v4()) + "," + utils.getQuotedStr(jobModel.getEmployerUsername()) +
    //     "," + utils.getQuotedStr(jobModel.getJobDescription()) + "," + utils.getGeomStr(jobModel.getLatitude(), jobModel.getLongitude()) + "," +
    //     utils.getQuotedStr(utils.getDateTime()) + ")";
    client.query(queryConfig, function(err, result) {
        if (err) {
            ecb(err);
        } else {
            scb(result);
        }
    });
};

database.addBid = function(bidModel, scb, ecb) {
    var queryConfig = {
        text: 'insert into tbl_bid values($1,$2,$3,$4,$5)',
        values: [uuid.v4(), bidModel.getJobID(), bidModel.getBidderID(), bidModel.getMessage(), utils.getDateTime()]
    };
    // var queryStr = "insert into tbl_bid values(" +
    //     utils.getQuotedStr(uuid.v4()) + "," +
    //     utils.getQuotedStr(bidModel.getJobID()) + "," +
    //     utils.getQuotedStr(bidModel.getBidderID()) + "," +
    //     utils.getQuotedStr(bidModel.getMessage()) + "," +
    //     utils.getQuotedStr(utils.getDateTime()) + ")";
    client.query(queryConfig, function(err, result) {
        if (err) {
            ecb(err);
        } else {
            scb(result);
        }
    });
};

database.getJobs = function(lat, lon, radius, scb, ecb) {
    var jobQuery = "select job_id,description,employer,title ," +
        "ST_X(the_geom),ST_Y(the_geom),time_of_creation,assigned_to," +
        "assiged_at" +
        " from tbl_job where ST_Distance_Sphere(the_geom," +
        utils.getGeomStr(lat, lon) + ")>" + radius;
    client.query(jobQuery, function(err, jobResult) {
        if (err) {
            return ecb(err);
        } else {
            var jobJSON = {};
            var jobArr = utils.getJobModelsFromCursor(jobResult);
            for (index in jobArr) {
                jobJSON[jobArr[index].getJobID()] = jobArr[index];
            }
            var bidQuery = "select * from tbl_bid";
            client.query(bidQuery, function(err, bidResult) {
                if (err) {
                    return ecb(err);
                } else {
                    var bidArr = utils.getBidModelsFromCursor(bidResult);
                    for (bidIndex in bidArr) {
                        var jid = bidArr[bidIndex].getJobID();
                        jobJSON[jid].addBid(bidArr[bidIndex]);
                    }
                    var returnArr = [];
                    for (job in jobJSON) {
                        returnArr.push(job);
                    }
                    return scb(returnArr);
                }
            });
        }
    });
};

database.getUnassignedJobsForEmployee = function(userID, lat, lon, radius, scb, ecb) {
    var queryConfig = {
        text: "select job_id,description,employer,title ," +
            "ST_Y(the_geom),ST_X(the_geom),time_of_creation,assigned_to," +
            "assigned_at" +
            " from tbl_job where ST_Distance_Sphere(the_geom," +
            utils.getGeomStr(lat, lon) + ")<" + radius +
            " and employer != $1 and assigned_to is null",
        values: [userID]
    };
    // var jobQuery = "select job_id,description,employer," +
    //     "ST_Y(the_geom),ST_X(the_geom),time_of_creation,assigned_to," +
    //     "assigned_at" +
    //     " from tbl_job where ST_Distance_Sphere(the_geom," +
    //     utils.getGeomStr(lat, lon) + ")<" + radius +
    //     " and employer != " + utils.getQuotedStr(userID) +
    //     " and assigned_to is null";
    client.query(queryConfig, function(err, jobResult) {
        if (err) {
            return ecb(err);
        } else {
            var jobJSON = {};
            var jobArr = utils.getJobModelsFromCursor(jobResult);
            for (index in jobArr) {
                jobJSON[jobArr[index].getJobID()] = jobArr[index];
            }
            if (jobArr.length > 0) {
                var bidQuery = "select * from tbl_bid where job_id in (";
                for (jid in jobJSON) {
                    bidQuery = bidQuery + utils.getQuotedStr(jid) + ",";
                }
                bidQuery = bidQuery.slice(0, bidQuery.length - 1) + ")";
                client.query(bidQuery, function(err, bidResult) {
                    if (err) {
                        return ecb(err);
                    } else {
                        var bidArr = utils.getBidModelsFromCursor(bidResult);
                        for (bidIndex in bidArr) {
                            var jid = bidArr[bidIndex].getJobID();
                            jobJSON[jid].addBid(bidArr[bidIndex]);
                        }
                        var returnArr = [];
                        for (job in jobJSON) {
                            returnArr.push(jobJSON[job]);
                        }
                        return scb(returnArr);
                    }
                });
            } else {
                scb(jobArr);
            }
        }
    });
};

database.getJobsOfEmployee = function(userID, scb, ecb) {
    var queryConfig = {
        text: "select job_id,description,employer,title, " +
            "ST_Y(the_geom),ST_X(the_geom),time_of_creation,assigned_to," +
            "assigned_at" +
            " from tbl_job where assigned_to = $1",
        values: [userID]
    };
    // var jobQuery = "select job_id,description,employer," +
    //     "ST_Y(the_geom),ST_X(the_geom),time_of_creation,assigned_to," +
    //     "assigned_at" +
    //     " from tbl_job where assigned_to = " + utils.getQuotedStr(userID);
    client.query(queryConfig, function(err, jobResult) {
        if (err) {
            return ecb(err);
        } else {
            var jobJSON = {};
            var jobArr = utils.getJobModelsFromCursor(jobResult);
            for (index in jobArr) {
                jobJSON[jobArr[index].getJobID()] = jobArr[index];
            }

            if (jobArr.length > 0) {
                var bidQuery = "select * from tbl_bid where job_id in (";
                for (jid in jobJSON) {
                    bidQuery = bidQuery + utils.getQuotedStr(jid) + ",";
                }
                bidQuery = bidQuery.slice(0, bidQuery.length - 1) + ")";
                client.query(bidQuery, function(err, bidResult) {
                    if (err) {
                        return ecb(err);
                    } else {
                        var bidArr = utils.getBidModelsFromCursor(bidResult);
                        for (bidIndex in bidArr) {
                            var jid = bidArr[bidIndex].getJobID();
                            jobJSON[jid].addBid(bidArr[bidIndex]);
                        }
                        var returnArr = [];
                        for (job in jobJSON) {
                            returnArr.push(jobJSON[job]);
                        }
                        return scb(returnArr);
                    }
                });
            } else {
                scb(jobArr);
            }
        }
    });
};
database.getJobsOfEmployer = function(userID, scb, ecb) {
    var queryConfig = {
        text: "select job_id,description,employer,title, " +
            "ST_Y(the_geom),ST_X(the_geom),time_of_creation,assigned_to," +
            "assigned_at" +
            " from tbl_job where employer = $1",
        values: [userID]
    };
    // var jobQuery = "select job_id,description,employer," +
    //     "ST_Y(the_geom),ST_X(the_geom),time_of_creation,assigned_to," +
    //     "assigned_at" +
    //     " from tbl_job where employer = " + utils.getQuotedStr(userID);
    client.query(queryConfig, function(err, jobResult) {
        if (err) {
            return ecb(err);
        } else {
            var jobJSON = {};
            var jobArr = utils.getJobModelsFromCursor(jobResult);
            for (index in jobArr) {
                jobJSON[jobArr[index].getJobID()] = jobArr[index];
            }

            if (jobArr.length > 0) {
                var bidQuery = "select * from tbl_bid where job_id in (";
                for (jid in jobJSON) {
                    bidQuery = bidQuery + utils.getQuotedStr(jid) + ",";
                }
                bidQuery = bidQuery.slice(0, bidQuery.length - 1) + ")";
                client.query(bidQuery, function(err, bidResult) {
                    if (err) {
                        return ecb(err);
                    } else {
                        var bidArr = utils.getBidModelsFromCursor(bidResult);
                        for (bidIndex in bidArr) {
                            var jid = bidArr[bidIndex].getJobID();
                            jobJSON[jid].addBid(bidArr[bidIndex]);
                        }
                        var returnArr = [];
                        for (job in jobJSON) {
                            returnArr.push(jobJSON[job]);
                        }
                        return scb(returnArr);
                    }
                });
            } else {
                scb(jobArr);
            }
        }
    });
};

database.getJob = function(jobID, scb, ecb) {
    var queryStr = "select job_id,description,employer,title ," +
        "ST_X(the_geom),ST_Y(the_geom),time_of_creation,assigned_to," +
        "assigned_at" +
        " from tbl_job where job_id = " + utils.getQuotedStr(jobID);
    client.query(queryStr, function(err, result) {
        if (err) {
            ecb(err);
        } else {
            var jobModel = utils.getJobModelsFromCursor(result)[0];
            var bidQuery = "select * from tbl_bid where job_id = " +
                utils.getQuotedStr(jobModel.getJobID());
            client.query(bidQuery, function(err, res) {
                if (err) {
                    ecb(err);
                } else {
                    var bidArr = utils.getBidModelsFromCursor(res);
                    jobModel.setBids(bidArr);
                    scb(jobModel);
                }
            });
        }
    });
};

database.assignJob = function(jobID, employerID, employeeID, scb, ecb) {

    var successGettingJob = function(jobModel) {

        if (jobModel && jobModel.getEmployerUsername() == employerID) {
            var assignQueryConfig = {
                text: "update tbl_job set assigned_to = $1 , assigned_at = $2 where job_id = $3",
                values: [employeeID, utils.getDateTime(), jobID]
            };
            // var assignQuery = "update tbl_job set assigned_to = " +
            //     utils.getQuotedStr(employeeID) + ",assigned_at = " +
            //     utils.getQuotedStr(utils.getDateTime()) + " where job_id = " +
            //     utils.getQuotedStr(jobID);
            client.query(assignQueryConfig, function(err, result) {
                if (err) {
                    ecb(err);
                } else {
                    scb(result);
                }
            });
        } else {
            ecb();
        }
    };
    database.getJob(jobID, successGettingJob, ecb);
};

database.deleteJob = function(employerID, jobID, scb, ecb) {
    var successGettingJob = function(jobModel) {
        if (jobModel && jobModel.getEmployerUsername() == employerID) {
            var deleteQuery = "delete from tbl_job where job_id = " +
                utils.getQuotedStr(jobID);
            client.query(deleteQuery, function(err, result) {
                if (err) {
                    ecb(err);
                } else {
                    scb(result);
                }
            });
        }
    };
};

database.drop = function(scb, ecb) {
    client.query("drop table if exists tbl_bid", function(err, res) {
        if (err) {
            console.log("drop bid fail");
            ecb(err);
        } else {
            client.query("drop table if exists tbl_job", function(err, res) {
                if (err) {
                    console.log("drop job fail");
                    ecb(err);
                } else {
                    client.query("drop table if exists tbl_user", function(err, res) {
                        if (err) {
                            console.log("drop user fail");
                            ecb(err);
                        } else {
                            console.log("all dropped");
                            scb();
                        }
                    });
                }
            });
        }
    });
};

database.deleteData = function(scb, ecb) {
    client.query("delete from tbl_bid", function(err, res) {
        if (err) {
            console.log("delete bid fail");
            ecb(err);
        } else {
            client.query("delete from tbl_job", function(err, res) {
                if (err) {
                    console.log("delete job fail");
                    ecb(err);
                } else {
                    client.query("delete from tbl_user", function(err, res) {
                        if (err) {
                            console.log("delete user fail");
                            ecb(err);
                        } else {
                            console.log("all deleted");
                            scb();
                        }
                    });
                }
            });
        }
    });
};

database.addExt = function(scb, ecb) {
    client.query('create extention postgis', function(err, res) {
        if (err) {
            console.log('add ext fail');
            ecb(err);
        }
        else
        {
            console.log('add ext success');
            scb();
        }
    });
};
module.exports = database;
