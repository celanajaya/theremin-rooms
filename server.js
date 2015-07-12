var path = require('path');

var http = require('http');
var server = http.createServer();

var express = require('express');
var app = express();

var socketio = require('socket.io');

server.on('request', app);

var io = socketio(server);

// var recordingSession = {};

io.on("connection", function(socket){
	var room = null;
	console.log("A new client has joined: " + socket.id);

	// socket.on("wantToJoinRoom", function(roomName){
	// 	room = roomName;
	// 	socket.join(roomName);
	// 	console.log("A new client joined Room: " + room);
	// 	// if (!recordingSession[roomName]) {
	// 	// 	recordingSession[roomName] = [];
	// 	// }
	// 	// socket.emit('recordingSession', recordingSession[roomName]);
	// });

	socket.on('clientMusic', function(data){
		// recordingSession[room].push(data);
		socket.broadcast.emit('serverSounds', data);
		console.log(data);
	});
	
	socket.on('disconnect', function(){
		console.log(socket.id + " has left :(");
	})
});


server.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'browser')));

//wildcard, allows people to visit any url on your domain
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});