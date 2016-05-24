angular.module('JobSearch')
    .factory('NetworkService', ['$http', function ($http) {
        console.log("network service");
        // var v2 = "v2";
        var factory = {
            token: null,
            username: null,
            serverAddress: null,
            latitude: null,
            longitude: null
        };

        var getDistance = function (lat1, lon1, lat2, lon2) {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
            var R = 6371;
            var x1 = lat2 - lat1;
            var dLat = x1.toRad();
            var x2 = lon2 - lon1;
            var dLon = x2.toRad();
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        };

        // var encodeJSON = function(obj) {
        // 	var str = "";
        // 	for (var key in obj) {
        // 		str = str + window.encodeURIComponent(key) + '=' + window.encodeURIComponent(obj[key]) + '&';
        // 	}
        // 	str = str.slice(0, str.length - 1);
        // 	return str;
        // }

        //COMMON METHODS
        //^^^^^^^^^^^^^^^^^^
        //fetches the access_token for that session
        factory.getToken = function (uname, pswd, server, successCallback, failureCallback) {
            return $http({
                method: 'POST',
                url: 'http://' + server + '/auth',
                data: {
                    username: uname,
                    password: pswd
                }
            }).then(function (response) {
                factory.token = response.data.token;
                factory.username = uname;
                // $http.defaults.headers.common['x-access-token'] = response.data.token;
                factory.serverAddress = 'http://' + server;
                successCallback(response);
            }, function (response) {
                console.log("failure in auth:" + JSON.stringify(response));
                failureCallback(response);
            });
        };

        factory.registerUser = function (uname, pswd, server, successCallback, failureCallback) {
            return $http({
                method: 'POST',
                url: 'http://' + server + '/register',
                data: {
                    username: uname,
                    password: pswd
                }
            }).then(function (response) {
                console.log("success in user creation");
                successCallback(response);
            }, function (response) {
                console.log("failure in user creation : " + JSON.stringify(response));
                failureCallback(response);
            });
        };

        factory.getUsername = function () {
            return factory.username;
        };

        //EMPLOYEE'S METHODS
        //^^^^^^^^^^^^^^^^^^

        factory.getUnassignedJobs = function (latitude, longitude, radius, scb, ecb) {
            $http({
                method: 'GET',
                url: factory.serverAddress + "/api/employee/" + latitude + "/" + longitude + "/" + radius,
                headers: {
                    'x-access-token': factory.token
                }
            }).then(function (response) {
                var jobs = response.data.records;
                for (i in jobs) {
                    jobs[i].distance = getDistance(latitude, longitude, jobs[i].latitude, jobs[i].longitude).toPrecision(4);
                }
                scb(response.data.records);
            }, function (response) {
                ecb(response.data);
            });
        };

        factory.getJobsOfEmployee = function (scb, ecb) {
            $http({
                method: 'GET',
                url: factory.serverAddress + "/api/employee/",
                headers: {
                    'x-access-token': factory.token
                }
            }).then(function (response) {
                scb(response.data.records);
            }, function (response) {
                ecb(response.data);
            });
        };

        factory.bidForJob = function (jobID, msg, scb, ecb) {
            $http({
                method: 'POST',
                url: factory.serverAddress + "/api/employee/" + jobID,
                headers: {
                    'x-access-token': factory.token
                },
                data: {
                    message: msg
                }
            }).then(function (response) {
                scb(response.data);
            }, function (response) {
                ecb(response.data);
            });
        };

        //EMPLOYER'S METHODS
        //^^^^^^^^^^^^^^^^^^

        factory.createJob = function (lat, lon, titl, desc, scb, ecb) {
            $http({
                method: 'POST',
                url: factory.serverAddress + "/api/employer/",
                headers: {
                    'x-access-token': factory.token
                },
                data: {
                    latitude: lat,
                    longitude: lon,
                    description: desc,
                    title: titl
                }
            }).then(function (response) {
                scb(response.data);
            }, function (response) {
                ecb(response.data);
            });
        };

        factory.getJobsOfEmployer = function (scb, ecb) {
            $http({
                method: 'GET',
                url: factory.serverAddress + "/api/employer/",
                headers: {
                    'x-access-token': factory.token
                }
            }).then(function (response) {
                scb(response.data.records);
            }, function (response) {
                ecb(response.data);
            });
        };

        factory.assignJob = function (jobID, employee, scb, ecb) {
            $http({
                method: 'PUT',
                url: factory.serverAddress + "/api/employer/" + jobID + "/" + employee,
                headers: {
                    'x-access-token': factory.token
                }
            }).then(function (response) {
                scb(response.data);
            }, function (response) {
                ecb(response.data);
            });
        };

        factory.logout = function () {
            factory.token = factory.username = factory.latitude = factory.longitude = null;
        };
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function (loc) {
        //         factory.curLat = loc.coords.latitude;
        //         factory.curLon = loc.coords.longitude;
        //     }, function () {
        //         console.log("location unavailable");
        //     });
        // }
        //factory.refreshToken();
        return factory;
    }]);
