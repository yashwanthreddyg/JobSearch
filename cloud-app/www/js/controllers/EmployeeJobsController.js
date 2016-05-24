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
                    $rootScope.isLoading = false;
                };
                var ecb = function () {
                    alert("error getting employee jobs");
                    $rootScope.isLoading = false;
                };
                $rootScope.isLoading = true;
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
