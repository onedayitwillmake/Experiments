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
		document.body.appendChild( canvas );

		var context = canvas.getContext("2d");
		context.globalCompositeOperation = "darker";
		var ribbonPaint = new Sketch.RibbonPaint( canvas );

		// GUIDAT HELPER
		var GuiDatController = new Sketch.GUIHelper( ribbonPaint );


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
		this._lines = [];
		this._mousePosition = new Sketch.Point(0, 0);

		this._canvas = aCanvas;
		this._context = this._canvas.getContext("2d");

		this.createBrush();
		this.initMouseEvents();
	};

	Sketch.RibbonPaint.prototype = {
		_lines			: [],
		_mousePosition	: Sketch.Point.ZERO,
		_press			: false,

		_canvas			: null,
		_context		: null,

		// Brush props
		_bristleCount		: 10,
		_brushRadius		: 4,
		_filamentSpacing    : 30,
		_filamentCount      : 10,
		_frictionMin		: 0.9,
		_frictionMax		: 0.92,
		_gravity			: 0,

		initMouseEvents: function() {
			var that = this;
			this._canvas.addEventListener('mousedown', function(e) { that.onMouseDown(e) }, false);
			this._canvas.addEventListener('mousemove', function(e) { that.onMouseMove(e) }, false);
			this._canvas.addEventListener('mouseup', function(e) { that.onMouseUp(e) }, false);
		},

		createBrush: function() {
			this._lines = [];

			for (var i = 0; i < this._bristleCount; ++i) {
				var radius = Math.random() * this._brushRadius;
				var radian = Math.random() * Math.PI * 2;

				//linePointer
				var line = new Sketch.Line();
				line.position.x = Math.cos(radian) * radius;
				line.position.y = Math.sin(radian) * radius;

				line.segmentLength = this._filamentSpacing;
				line.segmentNum = this._filamentCount;
				line.gravity = this._gravity;
				line.friction = Sketch.Utils.randRange( this._frictionMin, this._frictionMax );
				line.init();

				this._lines.push( line );
			}
		},

		update: function() {
			for(var i = 0; i < this._bristleCount; ++i) {
				this._lines[i].update( this._mousePosition, 0.2 );
			}
		},

		draw: function() {
			if(!this._press) { // Clear background
				this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
			}

			this._context.beginPath();
			this._context.closePath();
			for(var i = 0; i < this._bristleCount; ++i ) {
				this._lines[i].draw( this._context );
			}
		},

		onMouseDown: function(event) {
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
				this._lines[i].dealloc();
				delete this._lines[i];
			}
			this._lines = null;
			this._bristleCount = 0;
		}
	};

///// LINE
	Sketch.Line = function () {
		this.position = new Sketch.Point();
		this.prevPosition = new Sketch.Point();
	};

	Sketch.Line.prototype = {
		segmentNum		: 0,
		segmentLength	: 0,
		gravity			: 0,
		friction		: 0,
		position		: Sketch.Point.ZERO,
		prevPosition	: Sketch.Point.ZERO,

		_segments		: [],

		init: function() {
			var i = 0;

			this._segments = [];
			this._segments.push( new Sketch.Segment( this.segmentLength * 0.1 ) );

			for (i=1; i < this.segmentNum; ++i) {
				var segment = new Sketch.Segment(this.segmentLength * (i * 0.6) );
				this._segments.push( segment );
			}
		},

		update: function( toPosition, damping ) {
			this.prevPosition.x += (toPosition.x - this.prevPosition.x) * damping;
			this.prevPosition.y += (toPosition.y - this.prevPosition.y) * damping;

			this.drag( this._segments[0], this.prevPosition.x, this.prevPosition.y);

			for (var i = 1; i < this.segmentNum; ++i) {
				var segmentA = this._segments[i];
				var segmentB = this._segments[i-1];
				this.drag( segmentA, segmentB.position.x, segmentB.position.y );
			}
		},

		draw: function( context ) {
			context.moveTo( this.position.x + this._segments[0].position.x, this.position.y + this._segments[0].position.y );
				for(var i = 1; i < this.segmentNum; ++i) {
					context.lineTo( this.position.x + this._segments[i].position.x, this.position.y + this._segments[i].position.y )
				}
			context.strokeStyle = "rgba(25, 25, 25, 0.1)";
			context.stroke();
		},

		drag: function( segment, xpos, ypos ) {
			segment.update();

			var dx		= xpos - segment.position.x;
			var dy		= ypos  - segment.position.y;
			segment.angle	= Math.atan2(dy, dx);

			var pin = segment.getPin();
			var w = pin.x - segment.position.x;
			var h = pin.y - segment.position.y;

			segment.position.x = xpos - w;
			segment.position.y = ypos - h;
			segment.setVector();

			segment.vx *= this.friction;
			segment.vy *= this.friction;
			segment.vy += this.gravity;
		},

		dealloc: function() {
			for(var i = 0; i < this.segmentNum; ++i) {
				this._segments[i].dealloc();
				delete this._segments[i];
			}

			this._segments = null;
			this.position = null;
			this.prevPosition = null;
		}
	};

///// SEGMENT
	Sketch.Segment = function ( aLength ) {
		this.segmentLength = aLength;

		this.angle = 0.0;
		this.position = new Sketch.Point( Sketch.Utils.randRange(1.0, 1.5), Sketch.Utils.randRange(1.0, 1.5) );
		this.vx = 0;
		this.vy = 0;
		this.prevX = 0;
		this.prevX = 0;
	};

	Sketch.Segment.prototype = {
		segmentLength: 0,
		angle		: 0,
		position	: Sketch.Point.ZERO,
		vx			: 0,
		vy			: 0,
		prevX		: 0,
		prevY		: 0,

		update: function() {
			this.position.x += this.vx;
			this.position.y += this.vy;
		},

		setVector: function() {
			var damping = 0.99;
			if(this.prevX && this.prevY) {
				this.vx += ((this.position.x - this.prevX) - this.vx) * damping;
				this.vy += ((this.position.y - this.prevY) - this.vy) * damping;
			}
			this.prevX = this.position.x;
			this.prevY = this.position.y;
		},

		getPin: function() {
			var xpos = this.position.x + Math.cos( this.angle ) * this.segmentLength;
			var ypos = this.position.y + Math.sin( this.angle ) * this.segmentLength;

			return new Sketch.Point( xpos, ypos );
		},

		dealloc: function() {
			this.position = null;
		}
	};
}());