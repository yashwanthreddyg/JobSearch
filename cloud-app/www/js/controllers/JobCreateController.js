angular.module('JobSearch')
    .controller('JobCreateController', ['NetworkService',
        '$routeParams',
        '$location',
        '$rootScope',
        function (NetworkService, $routeParams, $location, $rootScope) {
            var self = this;
            self.map = null;
            self.marker = null;
            self.job = {
                latitude: null,
                longitude: null,
                title: null,
                description: null
            };
            self.addJob = function () {
                var scb = function () {
                    alert("job creation successful");
                    $location.path("/employer/jobs");

                    $rootScope.isLoading = false;
                };
                var ecb = function () {

                    alert("job creation failed");
                    $rootScope.isLoading = false;
                };
                if (self.job.latitude && self.job.longitude && self.job.description && self.job.title) {

                    $rootScope.isLoading = true;
                    NetworkService.createJob(self.job.latitude, self.job.longitude, self.job.title,
                        self.job.description, scb, ecb);
                }
            };
            if (!NetworkService.latitude) {
                navigator.geolocation.getCurrentPosition(function (loc) {

                    self.job.latitude = loc.coords.latitude;
                    self.job.longitude = loc.coords.longitude;
                    // NetworkService.getUnassignedJobs(loc.coords.latitude, loc.coords.longitude, self.distance * 1000, scb, ecb);
                }, function (error) {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            alert("The request to get user location timed out.");
                            break;
                        case error.UNKNOWN_ERROR:
                            alert("An unknown error occurred.");
                            break;
                    }
                }, {timeout: 10000, enableHighAccuracy: true});
            } else {
                self.job.latitude = NetworkService.latitude;
                self.job.longitude = NetworkService.longitude;
            }
            // self.postMapReady = function () {
            //     self.map.clear();
            //     var latLng = new plugin.google.maps.LatLng(self.job.latitude, self.job.longitude);
            //     self.map.addMarker({
            //         'position': latLng
            //     }, function (marker) {
            //         marker.showInfoWindow();
            //         marker.setDraggable(true);
            //         self.marker = marker;
            //     });
            // };

            self.showMap = function () {
                if (self.map) {
                    // self.postMapReady();

                    self.map.clear();
                    var latLng = new plugin.google.maps.LatLng(self.job.latitude, self.job.longitude);
                    self.map.addMarker({
                        'position': latLng
                    }, function (marker) {
                        marker.showInfoWindow();
                        marker.setDraggable(true);
                        self.marker = marker;
                    });
                    self.map.showDialog();
                    self.map.animateCamera({
                        'target': new plugin.google.maps.LatLng(self.job.latitude, self.job.longitude),
                        'tilt': 60,
                        'zoom': 18,
                        'bearing': 359
                    });
                }
            };

            self.onMapReady = function () {
                self.map.addEventListener(plugin.google.maps.event.MAP_CLOSE, function () {
                    self.marker.getPosition(function (latlong) {
                        self.job.latitude = latlong.lat;
                        self.job.longitude = latlong.lng;
                    });
                });
            };

            // var mapCanvas = $('map_canvas');
            document.addEventListener("deviceready", function () {
                var div = document.getElementById("map_canvas");
                // console.log("device ready jobview");
                self.map = plugin.google.maps.Map.getMap(div);
                self.map.addEventListener(plugin.google.maps.event.MAP_READY, self.onMapReady);
            }, false);
        }
    ]);
