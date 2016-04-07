var BidModel = function(jobID, bidderID, message) {

    this.job_id = jobID;
    this.bidID;
    this.bidder = bidderID;
    this.msg = message;
    this.timeOfCreation;

    this.getJobID = function() {
        return this.job_id;
    };

    this.getBidID = function() {
        return this.bidID;
    };


    this.getBidderID = function() {
        return this.bidder;
    };

    this.getMessage = function() {
        return this.msg;
    };

    this.setJobID = function(jID) {
        this.job_id = jID;
    };
    this.setBidID = function(bID) {
        this.bidID = bID;
    };

    this.setBidderID = function(bID) {
        this.bidder = bID;
    };

    this.setMessage = function(m) {
        this.msg = m;
    };
    this.getTimeofCreation = function() {
        return this.timeOfCreation;
    };

    this.setTimeOfCreation = function(toc) {
        this.timeOfCreation = toc;
    };
};
module.exports = BidModel;
