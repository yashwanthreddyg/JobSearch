angular.module('JobSearch')
    .controller('JobViewController', ['NetworkService',
        '$routeParams',
        '$location',
        '$rootScope',
        function (NetworkService, $routeParams, $location, $rootScope) {
            var self = this;
            self.map = null;
            self.bidMessage = "";
            self.job = $rootScope.job;
            if (self.job.employerUsername == NetworkService.getUsername()) {
                self.job.isOwner = true;
            }
            else{
                self.job.isOwner = false;
            }
            // self.job = {
            //     employerUsername: "abcduser",
            //     jobDescription: "this is lol2 job",
            //     bids: [
            //         {
            //             job_id: "bde9535e-c3a3-4485-9005-80711dfc2ab1",
            //             bidder: "sampleuser01",
            //             msg: "Hi I'm sampleuser01 want job",
            //             bidID: "e7cce39f-4e97-4389-8231-33d051ebcc12",
            //             timeOfCreation: "2016-04-04T15:47:49.000Z"
            //         },
            //         {
            //             job_id: "bde9535e-c3a3-4485-9005-80711dfc2ab1",
            //             bidder: "sampleuser01",
            //             msg: "Hi I'm sampleuser01 want job",
            //             bidID: "e7cce39f-4e97-4389-8231-33d051ebcc12",
            //             timeOfCreation: "2016-04-04T15:47:49.000Z"
            //         },
            //         {
            //             job_id: "bde9535e-c3a3-4485-9005-80711dfc2ab1",
            //             bidder: "sampleuser01",
            //             msg: "Hi I'm sampleuser01 want job",
            //             bidID: "e7cce39f-4e97-4389-8231-33d051ebcc12",
            //             timeOfCreation: "2016-04-04T15:47:49.000Z"
            //         }
            //     ],
            //     job_id: "bde9535e-c3a3-4485-9005-80711dfc2ab1",
            //     title: "cook",
            //     timeOfCreation: "2016-04-03T21:05:08.000Z",
            //     latitude: 17.446448,
            //     longitude: 78.371659,
            //     isOwner: false
            //     ,
            //     assignedTo: "abcduser",
            //     assignedAt: "2016-04-04T15:48:43.000Z"
            // };
            self.onMapReady = function () {
                var latLng = new plugin.google.maps.LatLng(self.job.latitude, self.job.longitude);
                self.map.clear();
                self.map.addMarker({
                    'position': latLng,
                    'title': self.job.title
                }, function (marker) {
                    marker.showInfoWindow();
                });
            };
            self.showMap = function () {
                if (self.map) {
                    self.map.showDialog();
                    self.map.animateCamera({
                        'target': new plugin.google.maps.LatLng(self.job.latitude, self.job.longitude),
                        'tilt': 60,
                        'zoom': 18,
                        'bearing': 359
                    });
                }
            };
            self.approveBid = function (user) {
                console.log("call to approve");
                NetworkService.assignJob(self.job.job_id, user, function () {
                    self.job.assignedTo = user;
                }, function () {
                    alert("approve failure");
                });
            };

            self.addBid = function () {
                if (self.bidMessage) {
                    NetworkService.bidForJob(self.job.job_id, self.bidMessage, function () {
                        alert("bid added");
                        self.job.bids.push(
                            {
                                bidder: NetworkService.getUsername(),
                                msg: self.bidMessage
                            }
                        );
                        self.bidMessage = "";
                    }, function () {
                        alert("bid adding failed");
                    });
                }
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