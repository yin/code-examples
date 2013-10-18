var run = true;
var frame = 0;
var frame_rate = 1000.0/30;
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
		width: 0,
		height: 0,
		queryNearest: function(x, y, minDist, maxDist, is) {
			var nearDist = false;
			var nearIndex = false;
			for(var i = 0, l = this.agents.length; i < l; i++) {
				var agent = this.agents[i];
				if(is === agent)
				  continue;
				
				var d = dist(x, y, agent.state.pos.x, agent.state.pos.y);
				if((nearIndex == false || nearDist > d) && d >= minDist && d <= maxDist) {
					nearDist = dist;
					nearIndex = i;
				}
			}
			return nearIndex != false ? this.agents[nearIndex] : null;
		},
		update: function() {
			for(var i = 0, l = world.agents.length; i < l; i++) {
			        var agent = world.agents[i];
			        $.extend(agent.state, agent.next);
			}
		}
	});
}

function Agent() {
	$.extend(this, {
		state: {},
		init: function(env) {
			this.state = {
				world: env,
				pos: {
					x: env.width/2,//Math.random() * env.width,
					y: Math.random() * env.height / 4 + env.height / 2,
					vx: Math.random() - .5,
					vy: Math.random() - .5
				},
				style: {
					color: get_random_color
				}
			};
		},
		update: function() {
			var env = this.state.world;
			var pos = this.state.pos;
			var next_pos = {};
			this.next = {};
			var nearest = env.queryNearest(this.state.pos.x, this.state.pos.y, 0, 75, this);
			if (nearest != null) {
				var dvx = (this.state.pos.x - nearest.state.pos.x) / env.width;
				var dvy = (this.state.pos.y - nearest.state.pos.y) / env.height;
				next_pos = {
					vx: pos.vx + dvx,
					vy: pos.vy + dvy,
					x: pos.x + pos.vx,
					y: pos.y + pos.vy
				};
			} else {
				next_pos = {
					vx: pos.vx * 0.97,
					vy: pos.vy * 0.97,
					x: pos.x + pos.vx,
					y: pos.y + pos.vy
				};
			}
		
			var s = dist(0, 0, next_pos.vx, next_pos.vy);
			if (s > 1) {
				next_pos.vx = next_pos.vx / s * 1;
				next_pos.vy = next_pos.vy / s * 1;
			}
			if (next_pos.x < 0) {
			  next_pos.x += env.width;
			}
			if (next_pos.y < 0) {
			  next_pos.y += env.height;
			}
			if (next_pos.x > env.width) {
			  next_pos.x -= env.width;
			}
			if (next_pos.y > env.height) {
			  next_pos.y -= env.height;
			}
			this.next = {
				pos: next_pos,
				buddy: nearest
			};
		},
		draw: function(ctx) {
			ctx.strokeStyle = this.state.style.color;
			ctx.fillStyle = this.state.style.color;
			ctx.fillRect(this.state.pos.x - 5, this.state.pos.y - 5, 11, 11);
			if (this.state.buddy != null) {
				ctx.beginPath();
				ctx.moveTo(this.state.pos.x, this.state.pos.y);
				ctx.lineTo(this.state.buddy.state.pos.x, this.state.buddy.state.pos.y);
				ctx.stroke();
			}
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
    
    for(var i = 0; i < 65; i++) {
    	var agent = new Agent(world);
    	agent.init(world);
        world.agents.push(agent);
    }
    setInterval(update, frame_rate);
};

var update = function(){
    if (!run)
  	return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0, l = world.agents.length; i < l; i++) {
        var agent = world.agents[i];
        agent.update();
    }
    world.update();
    for(var i = 0, l = world.agents.length; i < l; i++) {
        var agent = world.agents[i];
        agent.draw(ctx);
    }
};


// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

var dist = function(x0, y0, x1, y1) {
	var dx = x1 - x0;
	var dy = y1 - y0;
	return Math.sqrt(dx*dx + dy*dy);
}

