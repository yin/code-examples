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

function Environment() {
	$.extend(this, {
		agents: [],
		width: 0;
		height: 0,
		queryNearest: function(x, y) {
			var minDist = false;
			var minIndex = false;
			for(var i = 0, l = this.agents.length; i < l; i++) {
				var agent = this.agents[i];
				var dist = this.dist(x, y, agent.x, agent.y);
				if (minIndex == false || minDist > dist) {
					minDist = dist;
					minIndex = i;
				}
			}
			return minIndex != false ? this.agents[minIndex] : null;
		},
		dist: function(x0, y0, x1, y1) {
			return Math.sqrt((x1 - x0)**2 + (y1 - y0)**2);
		}
	});
}

function Agent(env) {
	$.extend(this, {
		env: env,
		x: Math.random() * env.width,
		y: Math.random() * env.height,
		vx: Math.random() - .5,
		vy: Math.random() - .5,
		color: get_random_color,
		state: {},
		
		update: function(env) {
			var nearest = env.queryNearest(this.x, this.y);
			var dvx = (this.x - nearest.x) / 100;
			var dvy = (this.y - nearest.y) / 100;
			this.vx += dvx;
			this.vy += dvy;
			this.x += this.vx;
			this.y += this.vy;
		},
		draw: function(ctx) {
			ctx.stroke = this.color;
			ctx.fill = this.color;
			ctx.arc(this.x, this.y, 10, 0, 0);
		}
	});
}

var world = new Environment();

var onImageLoad = function(){
    console.log("IMAGE!!!");
};

var setup = function() {
    var body = document.body;
    canvas = document.createElement('canvas');

    ctx = canvas.getContext('2d');
    
    world.width = canvas.width = 800;
    world.height = canvas.height = 600;

    body.appendChild(canvas);
    alert(0);
    
    for(var i = 0; i < 100; i++) {
        world.agents.push(new Agent(world));
    }
    setInterval(update, frame_rate);
};

var update = function(){
    // Draw each frame in order, looping back around to the 
    // beginning of the animation once you reach the end.
    // Draw each frame at a position of (0,0) on the canvas.
  
    // Try your code with this call to clearRect commented out
    // and uncommented to see what happens!
    //
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for(var i = 0, l = world.agents.length; i < l; i++) {
        var agent = world.agents[i];
        agent.update(world);
        agent.draw(ctx);
    }
};


// We'll call your setup function in our test code, so
// don't call it in your code.
//setup();

// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

