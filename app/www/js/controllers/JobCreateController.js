angular.module('JobSearch')
    .controller('JobCreateController', ['NetworkService',
        '$routeParams',
        '$location',
        '$scope',
        function (NetworkService, $routeParams, $location, $scope) {
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
                };
                var ecb = function () {
                };
                if (self.job.latitude && self.job.longitude && self.job.description && self.job.title) {
                    NetworkService.createJob(self.job.latitude, self.job.longitude, self.job.title,
                        self.job.description, scb, ecb);
                }
            }
            navigator.geolocation.getCurrentPosition(function (loc) {

                self.job.latitude = loc.coords.latitude;
                self.job.longitude = loc.coords.longitude;
                // NetworkService.getUnassignedJobs(loc.coords.latitude, loc.coords.longitude, self.distance * 1000, scb, ecb);
            }, function (error) {
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

            self.postMapReady = function () {
                self.map.clear();
                var latLng = new plugin.google.maps.LatLng(self.job.latitude, self.job.longitude);
                self.map.addMarker({
                    'position': latLng
                }, function (marker) {
                    marker.showInfoWindow();
                    marker.setDraggable(true);
                    self.marker = marker;
                });
            };

            self.showMap = function () {
                if (self.map) {
                    // self.postMapReady();
                    // self.map.showDialog();
                    // self.map.animateCamera({
                    //     'target': new plugin.google.maps.LatLng(self.job.latitude, self.job.longitude),
                    //     'tilt': 60,
                    //     'zoom': 18,
                    //     'bearing': 359
                    // });
                    self.map.clear();
                    var latLng = new plugin.google.maps.LatLng(self.job.latitude, self.job.longitude);
                    self.map.addMarker({
                        'position': latLng
                    }, function (marker) {
                        marker.showInfoWindow();
                        marker.setDraggable(true);
                        self.marker = marker;
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
