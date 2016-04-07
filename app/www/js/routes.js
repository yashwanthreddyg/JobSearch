angular.module('JobSearch')
    .config(function($routeProvider) {
        console.log("Configuring routes");
        $routeProvider.when('/login', {
                templateUrl: "./templates/login.html",
                controller: "LoginController",
                controllerAs: "loginCtrl"
            })
            .when('/employee/jobs', {
                //jobs the employee is responsible for
                templateUrl: "./templates/employee-jobs.html",
                controller: "EmployeeJobsController",
                controllerAs: "eeJobsCtrl"
            })
            .when('/employee/search', {
                //unassigned jobs
                templateUrl: "./templates/employee-job-search.html",
                controller: "JobSearchController",
                controllerAs: "searchCtrl"
            })
            .when('/employer/jobs', {
                //jobs created by the employer
                templateUrl: "./templates/employer-jobs.html",
                controller: "EmployerJobsController",
                controllerAs: "erJobsCtrl"
            })
            .when('/employer/create', {
                templateUrl: "./templates/employer-job-create.html",
                controller: "JobCreateController",
                controllerAs: "jobCreateCtrl"
            })
            .when('/job-view', {
                templateUrl: "./templates/job-view.html",
                controller: "JobViewController",
                controllerAs: "jobViewCtrl"
            })
            .otherwise({
                redirectTo: '/login'
            });
    });
