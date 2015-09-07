//
window.soundboard = new window.EventEmitter();

(function () {

    // the waveform
    var instrument = "sine";

    //audio context for the canvas
    var audioCtx = new AudioContext();
    var gainNode;
    var oscillator;


    var canvas = document.querySelector('#sound');
    var board = document.querySelector('#board');
    var boardStyle = getComputedStyle(board);

    canvas.width = parseInt(boardStyle.getPropertyValue('width'));
    canvas.height = parseInt(boardStyle.getPropertyValue('height'));

    var ctx = canvas.getContext('2d');

    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    var currentMousePosition = {
        x: 0,
        y: 0
    };

    var lastMousePosition = {
        x: 0,
        y: 0
    };

    var playing = false;

    var instrumentElements = [].slice.call(document.querySelectorAll('.marker'));

    instrumentElements.forEach(function (el) {
        el.addEventListener('click', function () {
            if (this.id !== "clear") {
                instrument = this.id;
                document.querySelector('.selected').classList.remove('selected');
                this.classList.add('selected');
            }
            else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    });

    canvas.addEventListener('mousedown', function (e) {
        playing = true;
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = instrument;
        oscillator.frequency.value = e.pageX / canvas.width * 3000 + 55;
        oscillator.start();
        currentMousePosition.x = e.pageX - this.offsetLeft;
        currentMousePosition.y = e.pageY - this.offsetTop;
    });

    canvas.addEventListener('mouseup', function () {
        playing = false;
        oscillator.disconnect(gainNode);
        oscillator = undefined;
    });

    canvas.addEventListener('mousemove', function (e) {

        if (!playing) return;

        lastMousePosition.x = currentMousePosition.x;
        lastMousePosition.y = currentMousePosition.y;

        currentMousePosition.x = e.pageX - this.offsetLeft;
        currentMousePosition.y = e.pageY - this.offsetTop;

        soundboard.play(lastMousePosition, currentMousePosition, instrument, true);
    });


    soundboard.play = function (start, end, inst, shouldBroadcast) {
        // Draw the line between the start and end positions
        // that is colored with the given color.
        if (!oscillator) {
            oscillator = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
        };

        oscillator.frequency.value = end.x / canvas.width * 3000 + 55;
        gainNode.gain.value = Math.abs(end.y - canvas.height) / canvas.height * 0.99;

        function random(number1,number2) {
            var randomNo = number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
            return randomNo;
        };

        var color = Math.floor((gainNode.gain.value/0.99)*30);
 
        ctx.globalAlpha = 0.3;
 
        for(var i=1; i<=15; i+=2) {
            ctx.beginPath();
            ctx.fillStyle = 'rgb(' + 100 + (i*10) + ',' + Math.floor((gainNode.gain.value/0.99)*255) + ',' + Math.floor((oscillator.frequency.value/3000)*255) + ')';
            ctx.arc(end.x + random(0,50), end.y + random(0,50), color / 2 + i, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
            ctx.fill();  
            ctx.closePath();
        }

        if (shouldBroadcast) {
            soundboard.emit('play', start, end, inst);
        }
        
    };

})();