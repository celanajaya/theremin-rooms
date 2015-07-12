
//turning on/connecting the oscillator

oscillator = audioCtx.createOscillator();
gainNode = audioCtx.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = instrument;
oscillator.frequency.value = e.pageX / canvas.width * 3000 + 55;
oscillator.start();
currentMousePosition.x = e.pageX - this.offsetLeft;
currentMousePosition.y = e.pageY - this.offsetTop;