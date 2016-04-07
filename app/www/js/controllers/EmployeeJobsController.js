angular.module('JobSearch')
    .controller('EmployeeJobsController', ['NetworkService',
        '$routeParams',
        '$location',
        '$rootScope',
        function (NetworkService, $routeParams, $location, $rootScope) {
            var self = this;
            self.getJobsEmployee = function () {
                var scb = function (jbs) {
                    self.jobs = jbs;
                };
                var ecb = function () {

                };
                NetworkService.getJobsOfEmployee(scb, ecb);
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
            self.getJobsEmployee();
        }
    ]);
