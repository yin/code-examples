/**
 * jQuery plugin: Draws graphs into a canvas
 * @author: MAtej Gagyi (yin)
 * @date: Nov 2011
 */

(function($) {
	$.fn.graph = function() {
		$(this).each(function() {
			if(this.tagName != "canvas")
				return;

			var self = this,
				ctx = this.getContext('2d'),
				chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
				charsNext = 0,
				nodes = $([]),
				edges = $([]),
				state = null,
				selection = null;
			
			var states = {
				init: function() {
					setState('free')
				},
				free: {
					mousedown: function(e) {
						var x = e.layerX,
							y = e.layerY,
							found = getNodeAt(x, y);
					
						if (found != null) {
							setState('selectOrDrag', {f: found, e: e});
						} else {
							var node = { x: x, y: y, name: nextChar() }
							nodes.push(node)
							
							if (e.ctrlKey && selection) {
								var edge = [ selection, node ];
								edges.push(edge);
								console.log('edge:'+edge[0]+':'+edge[1]);
							}
							selection = node;
							console.log('node:' + node.name);
						}
					}
				},
				selectOrDrag: {
					init: function(prev, param) {
						var found = param.f,
							event = param.e,
							node = found.n,
							x = event.layerX,
							y = event.layerY;
						param.dx = node.x - x,
						param.dy = node.y - y;
						selection = node;
					},
					mousemove: function(event, param) {
						setState('drag', param)
					},
					mouseup: function(event, param) {
						setState('joinWith', {what: param.f.n});
					}
				},
				drag: {
					init: function(prev, param) {
						var event = param.e;
						this.mousemove(event, param)
					},
					mousemove: function(event, param) {
						var found = param.f,
							dx = param.dx,
							dy = param.dy,
							node = found.n,
							x = event.layerX,
							y = event.layerY;
						node.x = x + dx;
						node.y = y + dy;
					},
					mouseup: function(event, param) {
						setState('free');
					}
				},
				joinWith: { 
					init: function(prev, param) {
						var node = param.what;
						node.fillStyle = 'rgb(255, 245, 150)';
					},
					mousedown: function(e, param) {
						var first = param.what,
							x = e.layerX, y = e.layerY,
							other = getNodeAt(x, y);
						if (other != null && first != other) {
							var edge = [ first, other.n ];
							try {
								edges.each(function(item) {
									if (item[0] == edge[0] && edge[1] == edge[2])
										throw edge;
								});
								edges.push(edge);
								console.log("new edge:"+edge[0].name+':'+edge[1].name);
							} catch(thrown) {
								// new edge has been 'thrown' out...
							}
						}
						setState('free');
					},
					leave: function(next, param) {
						var node = param.what;
						console.log('joinWith.leave('+node.name+')');
						node.fillStyle = null;
					},

				}
			};
			
			states.init();

			function setState(to) {
				var param = arguments[1],
					old = state,
					next = states[to];
				
				console.log("state => " + to + ': ', param)

				if (old && old.leave) {
					old.leave(next)
				}
				for (var handler in old) {
					if (handler == 'init' || handler == 'leave')
						continue;
					$(self).unbind(handler);
				}
				
				if (next && next.init) {
					if (param) {
						next.init(old, param)
					} else {
						next.init(old)
					}
				}
				if (next.leave) {
					next.leave = (function(me, leave, param) {
						return function(next) {
							leave.apply(me, [next, param]);
							me.leave = leave;
						}
					} )(next, next.leave, param);
				}
				for (var handler in next) {
					if (handler == 'init' || handler == 'leave')
						continue;
					$(self).bind(handler, (function(handler) {
						return function(e) {
							console.log("Event: " + e.type);
							handler.apply(state, [e, param]);
							// TODO(yin): Add damage-flag, later -region
							// TODO(yin): FPS limit. I love Earth.
							drawGraph(nodes);
						}
					} )(next[handler]) );
				}
				state = next;
			}
	
			function getNodeAt(x, y) {
				var ret = null,
					min2 = 4*14*14;
				nodes.each(function(i, n) {
					var dx = n.x-x,
						dy = n.y-y,
						r2 = dx*dx + dy*dy;
					if(r2 <= min2) {
						ret = {i: i, n: n};
						min2 = r2;
					}
				})
				return ret;
			}
			
			function nextChar() {
				return chars[charsNext++ % chars.length];
			}

			function drawGraph() {
				ctx.clearRect(0, 0, $(self).width(), $(self).height());
				nodes.each(function(i, n) {
					drawNode(n)
				})
				edges.each(function(i, e) {
					drawEdge(e)
				})
			}
			function drawNode(node) {
				ctx.beginPath();
				ctx.arc(node.x, node.y,	14,	0, 360, 0);
				if (node.fillStyle) {
					var _=ctx.fillStyle;
					ctx.fillStyle = node.fillStyle;
					ctx.fill();
					ctx.fillStyle = _;
				}
				ctx.stroke();
				
				ctx.font = '1.5em sans-serif';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(node.name, node.x, node.y);
			}
			function drawEdge(edge) {
				var n1 = edge[0], n2 = edge[1],
					dx = n2.x-n1.x, dy = n2.y-n1.y,
					dst = Math.sqrt(dx*dx+dy*dy),
					tx = dx / dst, ty = dy / dst;
				ctx.beginPath();
				ctx.moveTo(n1.x+tx*15, n1.y+ty*15)
				ctx.lineTo(n2.x-tx*15, n2.y-ty*15)
				ctx.stroke();
			}
			
			$.fn.getGraph = function() {
				nodes.each(function(i, node) {
					node.index = i;
				});
				return {
					nodes: nodes,
					edges: $.map(edges, function(edge) {
						return [[edge[0].index, edge[1].index]];
					})
				}
			};
		})
	}
})(jQuery);
