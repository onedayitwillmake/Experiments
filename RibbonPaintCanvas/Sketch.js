/**
 * RibbonPaintCanvas
 * Mario Gonzalez
 * http://ribbonpaint.com
 */
(function(){
	var onLoad = function( event ) {
		// Create canvas element
		var canvas = document.createElement('canvas');
		canvas.id = "container";
		canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
		document.body.insertBefore( canvas, document.getElementById("linklist") );

		var instructions = document.getElementById('instructions');
		instructions.style.setProperty('margin-left', window.innerWidth/2 - (instructions.offsetWidth/2) + "px");



		var context = canvas.getContext("2d");
		var ribbonPaint = new Sketch.RibbonPaint( canvas );

		// GUIDAT HELPER
		var guiController = new Sketch.GUIHelper( ribbonPaint );
		guiController.adjustInstructionsColor();



		// Loop
		(function loop() {
			ribbonPaint.update();
			ribbonPaint.draw();
			window.requestAnimationFrame( loop, null );
		})();
	};



	if ( !window.requestAnimationFrame ) {
			window.requestAnimationFrame = ( function() {
				return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
					window.setTimeout( callback, 1000 / 60 );
				};
		})();


		window.addEventListener('DOMContentLoaded', onLoad, true);
	}
}());

(function(){
	Sketch = Sketch || {};
	Sketch.RibbonPaint = function( aCanvas ) {
		this._bristles = [];
		this._mousePosition = new Sketch.Point(0, 0);

		this._canvas = aCanvas;
		this._context = this._canvas.getContext("2d");

		this.createBrush();
		this.initMouseEvents();
	};

	Sketch.RibbonPaint.prototype = {
		_bristles			: [],
		_mousePosition	: Sketch.Point.ZERO,
		_press			: false,

		_canvas			: null,
		_context		: null,

		// Brush props
		_bristleCount		: 3,
		_brushRadius		: 0,
		_filamentSpacing    : 12,
		_filamentCount      : 15,
		_frictionMin		: 0.82,
		_frictionMax		: 0.92,
		_gravity			: 0.002,

		ALPHA				: 0.1,
		FADE				: true,
		CURVES				: true,
		ONBLACK			: true,

		initMouseEvents: function() {
			var that = this;
			this._canvas.addEventListener('mousedown', function(e) { that.onMouseDown(e) }, false);
			this._canvas.addEventListener('mousemove', function(e) { that.onMouseMove(e) }, false);
			this._canvas.addEventListener('mouseup', function(e) { that.onMouseUp(e) }, false);

			this._canvas.addEventListener("touchstart", that.touchHandler, true);
			this._canvas.addEventListener("touchmove", that.touchHandler, true);
			this._canvas.addEventListener("touchend", that.touchHandler, true);
			this._canvas.addEventListener("touchcancel", that.touchHandler, true);

			// Save image with S
			document.addEventListener('keydown', function(e) {
				if(e.keyCode != '83') return;
				window.location = that._canvas.toDataURL();
			}, false);
		},

		/**
		 * Convert touch to mouse events
		 * @param event
		 */
		touchHandler: function( event ) {
			var touches = event.changedTouches,
					first = touches[0],
					type = "";


			//console.log("event",)
			event.preventDefault();
			//return;
			switch(event.type) {
				case "touchstart": type = "mousedown"; break;
				case "touchmove":  type ="mousemove"; break;
				case "touchend":   type ="mouseup"; break;
				default: return;
			}

			// Pass off as mouse event
			var fakeMouseEvent = document.createEvent("MouseEvent");
			fakeMouseEvent.initMouseEvent(type, true, true, window, 1,
					first.screenX, first.screenY,
					first.clientX, first.clientY, false,
					false, false, false, 0, null);

			first.target.dispatchEvent(fakeMouseEvent);
		},

		strategyGetCompositionFunction: function() {
			return Sketch.RibbonPaint.prototype.ONBLACK ? "lighter" : "darker";
		},
		strategyGetClearFunction: function() {
			if(Sketch.RibbonPaint.prototype.ONBLACK) {
				return function() {
					this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
					this._context.fillStyle = "#000000";
					this._context.fillRect(0,0, this._canvas.width, this._canvas.height);
				}
			} else {
				return function() {
					this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
				}
			}
		},

		createBrush: function() {
			this._context.globalCompositeOperation = this.strategyGetCompositionFunction();
			this.clearFunction = this.strategyGetClearFunction();

			this._bristles = [];

			for (var i = 0; i < this._bristleCount; ++i) {
				var radius = Math.random() * this._brushRadius;
				var radian = Math.random() * Math.PI * 2;

				//linePointer
				var line = new Sketch.Bristle();
				line.position.x = Math.cos(radian) * radius;
				line.position.y = Math.sin(radian) * radius;

				line.filamentLength = this._filamentSpacing;
				line.filamentCount = this._filamentCount;
				line.gravity = this._gravity;
				line.friction = Sketch.Utils.randRange( this._frictionMin, this._frictionMax );
				line.init();

				this._bristles.push( line );
			}
		},

		update: function() {
			for(var i = 0; i < this._bristleCount; ++i) {
				this._bristles[i].update( this._mousePosition, 0.2 );
			}
		},

		draw: function() {
			if(!this._press) { // Clear background
				this.clearFunction();
			}

			this.clearFunction();
			// Darker when not drawing
			var alpha = this._press ? Sketch.RibbonPaint.prototype.ALPHA : 0.5;

			for(var i = 0; i < this._bristleCount; ++i ) {
				this._bristles[i].draw( this._context, alpha );
			}
		},

		onMouseDown: function(event) {
			this.clearFunction();
			this._press = true;
		},

		onMouseMove: function(e) {
			var x, y;

			// Get the mouse position relative to the canvas element.
			if (e.layerX || e.layerX == 0) { // Firefox
				x = e.layerX;
				y = e.layerY;
			} else if (e.offsetX || e.offsetX == 0) { // Opera
				x = e.offsetX;
				y = e.offsetY;
			}

			this._mousePosition.x = x;
			this._mousePosition.y = y;
		},

		onMouseUp: function(event) {
		   this._press = false;
		},

		dealloc: function() {
			for(var i = 0; i < this._bristleCount; ++i ) {
				this._bristles[i].dealloc();
				delete this._bristles[i];
			}
			this._bristles = null;
			this._bristleCount = 0;
		}
	};

///// Bristle
	Sketch.Bristle = function () {
		this.position = new Sketch.Point();
		this.prevPosition = new Sketch.Point();
	};

	Sketch.Bristle.prototype = {
		filamentCount	: 0,
		filamentLength	: 0,
		gravity			: 0,
		friction		: 0,
		position		: Sketch.Point.ZERO,
		prevPosition	: Sketch.Point.ZERO,

		alphaFunction	: null,
		_filaments		: [],

		init: function() {
			var i = 0;

			this.colorFunction = this.strategyGetColorRGB();
			this.alphaFunction = this.strategyCreateAlphaFunction();
			this.draw = this.strategyCreatePathFunction();

			this._filaments = [];
			this._filaments.push( new Sketch.Filament( this.filamentLength * 0.1 ) );

			for (i=1; i < this.filamentCount; ++i) {
				var segment = new Sketch.Filament(this.filamentLength * (i * 0.6) );
				this._filaments.push( segment );
			}
		},

		update: function( toPosition, damping ) {
			this.prevPosition.x += (toPosition.x - this.prevPosition.x) * damping;
			this.prevPosition.y += (toPosition.y - this.prevPosition.y) * damping;

			this.drag( this._filaments[0], this.prevPosition.x, this.prevPosition.y);

			for (var i = 1; i < this.filamentCount; ++i) {
				var segmentA = this._filaments[i];
				var segmentB = this._filaments[i-1];
				this.drag( segmentA, segmentB.position.x, segmentB.position.y );
			}
		},


		draw: function(){}, // To be replaced via stategy at init time

		drag: function( segment, xpos, ypos ) {
			segment.update();

			var dx		= xpos - segment.position.x;
			var dy		= ypos  - segment.position.y;
			segment.angle	= Math.atan2(dy, dx);

			var pin = segment.getAnchor();
			var w = pin.x - segment.position.x;
			var h = pin.y - segment.position.y;

			segment.position.set( xpos - w, ypos - h);
			segment.setVelocity();

			segment.velocity.multiply(this.friction);
			segment.velocity.y += this.gravity;
		},

		/**
		* Returns a function that will determin the alpha of the curve (fade or not)
		*/
		strategyCreateAlphaFunction: function() {
			if(Sketch.RibbonPaint.prototype.FADE) {
				return function(i, alpha) {
					return this.colorFunction() + ((1.0-(i/this.filamentCount))*alpha + 0.005) + ")";
				};
			} else {
				return function(i, alpha) {
					return this.colorFunction() + alpha + ")";
				};
			}
		},

		/**
		* Returns a function (used at init time) that will create the path of the brush
		*/
 		strategyCreatePathFunction: function() {
 			if(Sketch.RibbonPaint.prototype.CURVES) {
	 			// Smooth curve function
				return function(context, alpha) {
					var i = 0;
					var control = null;
					var previousControl = null;
					var oldPosition = new Sketch.Point(this.position.x + this._filaments[0].position.x, this.position.y + this._filaments[0].position.y);


					for(i = 1; i < this.filamentCount; ++i) {
						context.beginPath();
						context.closePath();

						control = new Sketch.Point(0, 0);
						control.x = ( oldPosition.x + (this.position.x + this._filaments[i].position.x) ) * 0.5;
						control.y = ( oldPosition.y + (this.position.y + this._filaments[i].position.y) ) * 0.5;

						if(previousControl) {
							context.moveTo(previousControl.x, previousControl.y);
							context.quadraticCurveTo(oldPosition.x, oldPosition.y,control.x, control.y);
						}

						context.strokeStyle = "red";//this.alphaFunction(i, alpha);
						context.stroke();

						oldPosition.set( this.position.x + this._filaments[i].position.x, this.position.y + this._filaments[i].position.y );
						previousControl = control;
					}
				}
 			} else {
	 			return function(context, alpha) { // Regular line segments
					context.beginPath();
					context.moveTo( this.position.x + this._filaments[0].position.x, this.position.y + this._filaments[0].position.y );
						for(i = 1; i < this.filamentCount; ++i) {
							context.lineTo( this.position.x + this._filaments[i].position.x, this.position.y + this._filaments[i].position.y );
						}
					context.strokeStyle = this.alphaFunction(i, alpha);
					context.stroke();
					context.closePath();
				}
 			}
 		},

		strategyGetColorRGB: function() {
			if(Sketch.RibbonPaint.prototype.ONBLACK) {
				return function() { return "rgba(255, 0, 100, "; }
			} else {
				return function() { return "rgba(25, 25, 25, "; };
			}
		},

		/**
		* Deallocate memory
		*/
		dealloc: function() {
			for(var i = 0; i < this.filamentCount; ++i) {
				this._filaments[i].dealloc();
				delete this._filaments[i];
			}

			this.draw = null;
			this.alphaFunction = null;
			this.colorFunction = null;
			this._filaments = null;
			this.position = null;
			this.prevPosition = null;
		}
	};

///// Filament
	Sketch.Filament = function ( aLength ) {
		this.filamentLength = aLength;

		this.angle = 0.0;
		this.position = new Sketch.Point( Sketch.Utils.randRange(1.0, 1.5), Sketch.Utils.randRange(1.0, 1.5) );
		this.velocity = new Sketch.Point( 0, 0 );
		this.previousPosition = this.position.clone();
	};

	Sketch.Filament.prototype = {
		filamentLength		: 0,
		angle				: 0,
		position			: Sketch.Point.ZERO,
		previousPosition	: Sketch.Point.ZERO,
		velocity			: Sketch.Point.ZERO,

		update: function() {
			this.position.translatePoint( this.velocity );
		},

		setVelocity: function() {
			var damping = 0.99;
			this.velocity.x += ((this.position.x - this.previousPosition.x) - this.velocity.x) * damping;
			this.velocity.y += ((this.position.y - this.previousPosition.y) - this.velocity.y) * damping;
			this.previousPosition.x = this.position.x;
			this.previousPosition.y = this.position.y;
		},

		getAnchor: function() {
			var xpos = this.position.x + Math.cos( this.angle ) * this.filamentLength;
			var ypos = this.position.y + Math.sin( this.angle ) * this.filamentLength;

			return new Sketch.Point( xpos, ypos );
		},

		dealloc: function() {
			this.position = null;
		}
	};
}());
