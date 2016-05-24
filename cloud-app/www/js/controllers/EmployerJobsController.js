angular.module('JobSearch')
    .controller('EmployerJobsController', ['NetworkService',
        '$routeParams',
        '$location',
        '$rootScope',
        function (NetworkService, $routeParams, $location, $rootScope) {
            var self = this;
            self.jobs = [];
            // self.jobs = [
            //     {
            //         "employerUsername": "sampleuser01",
            //         "jobDescription": "this is lol2 job",
            //         "bids": [
            //             {
            //                 "job_id": "bde9535e-c3a3-4485-9005-80711dfc2ab1",
            //                 "bidder": "abcduser",
            //                 "msg": "Hi I'm abcduser want job",
            //                 "bidID": "e7cce39f-4e97-4389-8231-33d051ebcc12",
            //                 "timeOfCreation": "2016-04-04T15:47:49.000Z"
            //             }
            //         ],
            //         "job_id": "bde9535e-c3a3-4485-9005-80711dfc2ab1",
            //         "title": "cook",
            //         "timeOfCreation": "2016-04-03T21:05:08.000Z",
            //         "latitude": 17.446448,
            //         "longitude": 78.371659,
            //         "assignedTo": "abcduser",
            //         "assignedAt": "2016-04-04T15:48:43.000Z"
            //     },
            //     {
            //         "employerUsername": "sampleuser01",
            //         "jobDescription": "this is lol2 job",
            //         "bids": [
            //             {
            //                 "job_id": "bde9535e-c3a3-4485-9005-80711dfc2ab1",
            //                 "bidder": "abcduser",
            //                 "msg": "Hi I'm abcduser want job",
            //                 "bidID": "e7cce39f-4e97-4389-8231-33d051ebcc12",
            //                 "timeOfCreation": "2016-04-04T15:47:49.000Z"
            //             }
            //         ],
            //         "job_id": "bde9535e-c3a3-4485-9005-80711dfc2ab1",
            //         "title": "cook",
            //         "timeOfCreation": "2016-04-03T21:05:08.000Z",
            //         "latitude": 17.446448,
            //         "longitude": 78.371659
            //     }
            // ];
            self.getJobs = function () {
                $rootScope.isLoading = true;
                NetworkService.getJobsOfEmployer(function (jbs) {
                    self.jobs = jbs;
                    $rootScope.isLoading = false;
                }, function () {
                    console.log("error getting employer's jobs");
                    $rootScope.isLoading = false;
                });
            };
            self.goToDetails = function(jobID){
                var jobToShow;
                for(var i in self.jobs){
                    if(jobID == self.jobs[i].job_id){
                        jobToShow = self.jobs[i];
                        break;
                    }
                }
                $rootScope.job = jobToShow;
                $location.path('/job-view');
            };
            self.getJobs();
        }
    ]);
