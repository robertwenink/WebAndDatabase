var fs = require('fs');
var net = require('net');

var file = process.argv[2];
var port = process.argv[3];
var server = net.createServer( function(connection){
    console.log("Subscriber connected!");

    connection.write
})