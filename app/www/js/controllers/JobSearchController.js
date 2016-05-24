angular.module('JobSearch')
    .controller('JobSearchController', ['NetworkService',
        '$routeParams',
        '$location',
        '$rootScope',
        function (NetworkService, $routeParams, $location, $rootScope) {
            console.log("in search controller");
            var self = this;
            var curLat = null;
            var curLon = null;
            self.distance = 20;
            self.jobs = [];
            // self.jobs = [
            //     {
            //         "employerUsername": "user1",
            //         "jobDescription": "this is job1",
            //         "title": "Cook",
            //         "bids": [],
            //         "distance": 8,
            //         "job_id": "5ddf5621-b5cd-44d3-a160-74d2245ad782",
            //         "timeOfCreation": "2016-04-01T10:43:19.000Z",
            //         "latitude": 17.446448,
            //         "longitude": 78.371659
            //     },
            //     {
            //         "employerUsername": "user2",
            //         "jobDescription": "this is lol2 job",
            //         "title": "Tutor",
            //         "bids": [],
            //         "distance": 9,
            //         "job_id": "5ddf5621-b5cd-44d3-a160-74d2245ad782",
            //         "timeOfCreation": "2016-04-01T10:43:19.000Z",
            //         "latitude": 17.446448,
            //         "longitude": 78.371659
            //     },
            //     {
            //         "employerUsername": "user3",
            //         "jobDescription": "this is lol2 job",
            //         "title": "Helper",
            //         "bids": [],
            //         "distance": 10,
            //         "job_id": "5ddf5621-b5cd-44d3-a160-74d2245ad782",
            //         "timeOfCreation": "2016-04-01T10:43:19.000Z",
            //         "latitude": 17.446448,
            //         "longitude": 78.371659
            //     }
            // ];
            self.incrementDistance = function () {
                if (self.distance < 100)
                    self.distance++;
                self.getUnassignedJobs();
            }
            self.decrementDistance = function () {
                if (self.distance > 1)
                    self.distance--;
                self.getUnassignedJobs();
            }
            self.getUnassignedJobs = function () {
                var scb = function (jbs) {
                    self.jobs = jbs;
                    $rootScope.isLoading = false;
                };
                var ecb = function () {
                    console.log("error getting jobs");
                    $rootScope.isLoading = false;
                };
                if (NetworkService.latitude) {
                    $rootScope.isLoading = true;
                    NetworkService.getUnassignedJobs(NetworkService.latitude, NetworkService.longitude, self.distance * 1000, scb, ecb);
                }
                else if (navigator.geolocation) {

                    $rootScope.isLoading = true;
                    navigator.geolocation.getCurrentPosition(function (loc) {
                        NetworkService.latitude = loc.coords.latitude;
                        NetworkService.longitude = loc.coords.longitude;
                        NetworkService.getUnassignedJobs(loc.coords.latitude, loc.coords.longitude, self.distance * 1000, scb, ecb);
                    }, function (error) {

                        $rootScope.isLoading = false;
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                console.log("User denied the request for Geolocation.");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                console.log("Location information is unavailable.");
                                break;
                            case error.TIMEOUT:
                                console.log("The request to get user location timed out.");
                                break;
                            case error.UNKNOWN_ERROR:
                                console.log("An unknown error occurred.");
                                break;
                        }
                    }, {timeout: 10000, enableHighAccuracy: true});
                }
            };
            self.goToDetails = function (jobID) {
                var jobToShow;
                for (var i in self.jobs) {
                    if (jobID == self.jobs[i].job_id) {
                        jobToShow = self.jobs[i];
                        break;
                    }
                }
                $rootScope.job = jobToShow;
                $location.path('/job-view');
            };
            self.getUnassignedJobs();
        }
    ]);
