var frame = 0;
var frame_rate = 1000.0/15;
var canvas = null;
var ctx = null;
var assets = ['img00.png',
              'img01.png',
              'img02.png',
              'img03.png',
              'img04.png',
              'img05.png',
              'img06.png',
              'img07.png',
              'img08.png'
             ];
var frames = [];

var onImageLoad = function(){
    console.log("IMAGE!!!");
};

var setup = function() {
    var body = document.body;
    canvas = document.createElement('canvas');

    ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 600;

    body.appendChild(canvas);

    // Load each image URL from the assets array into the frames array 
    // in the correct order.
    // Afterwards, call setInterval to run at a framerate of 30 frames 
    // per second, calling the animate function each time.
    // YOUR CODE HERE
    for (var i = 0; i < assets.length; i++) {
        frames[i] = new Image();
        frames[i].src = assets[i];
        frames[i].onload = onImageLoad;
    }
    setInterval(animate, frame_rate);
};

var animate = function(){
    // Draw each frame in order, looping back around to the 
    // beginning of the animation once you reach the end.
    // Draw each frame at a position of (0,0) on the canvas.
  
    // Try your code with this call to clearRect commented out
    // and uncommented to see what happens!
    //
    //ctx.clearRect(0,0,canvas.width, canvas.height);
  
    // YOUR CODE HERE
    if (frame < frames.length) {
        ctx.drawImage(frames[frame], 40, 80);
    }
    frame = (frame + 1) % (frames.length + 5);
};


// We'll call your setup function in our test code, so
// don't call it in your code.
//setup();

