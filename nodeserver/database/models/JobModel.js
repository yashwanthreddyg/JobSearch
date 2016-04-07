var JobModel = function(employer, latitude, longitude,title, description) {

    this.job_id;
    this.jobTitle = title;
    this.employerUsername = employer;
    this.locationLatitude = latitude;
    this.locationLongitude = longitude;
    this.jobDescription = description;
    this.timeOfCreation;
    this.aassignedTo;
    this.assignedAt;
    this.bids = [];
    
    this.setTitle = function(titl) {
        this.title = titl;
    };

    this.getTitle = function() {
        return this.title;
    };
    
    this.setAssignedTo = function(employee) {
        this.assignedTo = employee;
    };

    this.setAssignedAt = function(time) {
        this.assignedAt = time;
    };

    this.getAssignedTo = function() {
        return this.assignedTo;
    };

    this.getAssignedAt = function() {
        return this.assignedAt;
    };


    this.getJobID = function() {
        return this.job_id;
    };

    this.setJobID = function(jid) {
        this.job_id = jid;
    }

    this.getEmployerUsername = function() {
        return this.employerUsername;
    };
    this.getLatitude = function() {
        return this.latitude;
    };
    this.getLongitude = function() {
        return this.longitude;
    };
    this.getJobDescription = function() {
        return this.jobDescription;
    };

    this.getTimeofCreation = function() {
        return this.timeOfCreation;
    };

    this.setTimeOfCreation = function(toc) {
        this.timeOfCreation = toc;
    };

    this.getBids = function() {
        return this.bids;
    };
    this.setEmployerUsername = function(empu) {
        this.employerUsername = empu;
    };
    this.setLatitude = function(lat) {
        this.latitude = lat;
    };
    this.setLongitude = function(lng) {
        this.longitude = lng;
    };
    this.setJobDescription = function(desc) {
        this.jobDescription = desc;
    };
    this.setBids = function(bidArr) {
        this.bids = bidArr;
    };

    this.addBid = function(bidModel) {
        this.bids.push(bidModel);
    };

    this.getBidAt = function(index) {
        return this.bids[index];
    };
}
module.exports = JobModel;
