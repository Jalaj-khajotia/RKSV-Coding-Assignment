'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('rksv-assignment');

app.controller('mainCtrl', function($scope, $http, socket, socketFactory) {
    var plot = [];

    $http.get("http://kaboom.rksv.net/api/historical?interval=1")
        .success(function(data) {
            for (var i = 0; i < data.length; i++) {
                var temp = data[i].split(',');
                //console.info(temp[3]);
                var tempdata = [parseInt(temp[0]), parseInt(temp[4])];
                plot.push(tempdata);
            }
            $scope.data = [{
                "key": "Day Close",
                "values": plot
            }];
            // console.info(plot);
        })
        .error(function(data, status, headers, config) {
            console.log(status + " Data: " + data);
        });
    ConnectSocket();

    function ConnectSocket() {
        var myIoSocket = io.connect('http://kaboom.rksv.net/watch');

        var mySocket = socketFactory({
            ioSocket: myIoSocket
        });
        var socket = mySocket.ioSocket;
        mySocket.on('data', function(data) {
            console.info(data);
            $scope.currentPrice = '$' + data.split(',')[4];
            mySocket.emit('CLIENT_ACKNOWLEDGEMENT', function(data) {
                var CLIENT_ACKNOWLEDGEMENT = 1;
                console.log(data);
            });

        });

        mySocket.on('connect', function() { // TIP: you can avoid listening on `connect` and listen on events directly too!
            mySocket.emit('ping', {});
            mySocket.emit('sub', {
                state: true
            });
        });


        mySocket.on('error', function(data) {
            console.error(data);
        });
    }

    $scope.options = {
        chart: {
            type: 'stackedAreaChart',
            height: 250,
            margin: {
                top: 10,
                right: 20,
                bottom: 40,
                left: 30
            },
            x: function(d) {
                return d[0];
            },
            y: function(d) {
                return d[1];
            },
            useVoronoi: false,
            clipEdge: false,
            duration: 100,
            useInteractiveGuideline: true,
            xAxis: {
                showMaxMin: true,
                tickFormat: function(d) {
                    return d3.time.format('%x')(new Date(d))
                }
            },
            yAxis: {
                tickFormat: function(d) {
                    return d3.format(',0.00001')(d * 0.01);
                }
            },
            zoom: {
                enabled: false,
                scaleExtent: [1, 6],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: false,
                unzoomEventType: 'dblclick.zoom'
            }
        }
    };

    console.info('hi');
});