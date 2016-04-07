var utils = {};
var models = require("./models");
utils.getDateTime = function() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

};

utils.getQuotedStr = function(str) {
    return "'" + str + "'";
};

utils.getGeomStr = function(lat, lng) {
    return "ST_GeomFromText('POINT(" + lng + " " + lat + ")')";
}

utils.getJobModelsFromCursor = function(cursor) {
    var arr = [];
    for (var i = 0; i < cursor.rows.length; i++) {
        var jobModel = new models.JobModel();
        jobModel.setJobID(cursor.rows[i].job_id);
        jobModel.setTitle(cursor.rows[i].title);
        jobModel.setEmployerUsername(cursor.rows[i].employer);
        jobModel.setJobDescription(cursor.rows[i].description);
        jobModel.setTimeOfCreation(cursor.rows[i].time_of_creation);
        jobModel.setLatitude(cursor.rows[i].st_y);
        jobModel.setLongitude(cursor.rows[i].st_x);
        if (cursor.rows[i].assigned_to) {
            jobModel.setAssignedTo(cursor.rows[i].assigned_to);
            jobModel.setAssignedAt(cursor.rows[i].assigned_at);
        }
        arr.push(jobModel);
    }
    return arr;
}

utils.getBidModelsFromCursor = function(cursor) {
    var arr = [];
    for (var i = 0; i < cursor.rows.length; i++) {
        var bidModel = new models.BidModel();
        bidModel.setBidID(cursor.rows[i].bid_id);
        bidModel.setJobID(cursor.rows[i].job_id);
        bidModel.setBidderID(cursor.rows[i].employee);
        bidModel.setMessage(cursor.rows[i].message);
        bidModel.setTimeOfCreation(cursor.rows[i].time_of_creation);
        arr.push(bidModel);
    }
    return arr;
}

module.exports = utils;
