var setup = function() {
    var soundRequest = new XMLHttpRequest();
    soundRequest.open('GET', 'zombie_fight.mp3', true);
    soundRequest.responseType = 'arraybuffer';
	soundRequest.onload = function () {

		try {
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			var context = new AudioContext();

			var mainNode = context.createGainNode(0);
			mainNode.connect(context.destination);

			var clip = context.createBufferSource();

			context.decodeAudioData(soundRequest.response, function (buffer) {
				clip.buffer = buffer;
				clip.gain.value = 1.0;
				clip.connect(mainNode);
				clip.loop = false;
				clip.noteOn(0);
			}, function (data) {});
		}
		catch(e) {
			console.warn('Web Audio API is not supported in this browser');
		}
	};

	soundRequest.send();
};
