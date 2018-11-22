var fs = require('fs');
var net = require('net');

var file = process.argv[2];
var port = process.argv[3];
var server = net.createServer( function(connection){
    console.log("Subscriber connected!");

    connection.write("Watching " + file);

    var watcher = fs.watch(file, function(){
        connection.write("File has changed at "+ Date.now()+"\n");
    });

    connection.on("close", function(){
        console.log("Subscriber disconnected");
        watcher.close();
    });
});

server.listen(port, function(){
    console.log("Listening to subscribers");
});