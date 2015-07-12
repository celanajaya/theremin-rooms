var socket = io.connect();

socket.on('connect', function() {
	// var room = location.pathname.slice(1);

	console.log("Connected to Server");

	soundboard.on('play', function(start, end, instrument) {
		socket.emit('clientMusic', [start, end, instrument]);
	});

	socket.on('serverSounds', function(data){
		console.log("sounds coming in...");
		soundboard.play.apply(this, data);
	});

	// socket.emit('wantToJoinRoom', room);

	// socket.on('dataStorage', function(dataStorage){
	// 	dataStorage.forEach(function(drawingData){
	// 		soundboard.play.apply(this, drawingData);
	// 	});
	// });
});