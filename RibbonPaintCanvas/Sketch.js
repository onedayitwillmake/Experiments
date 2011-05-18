// Lots of 'trying out stuff' below, so view at your own peril
(function(){
	var onLoad = function( event ) {
		// Create canvas element
		var canvas = document.createElement('canvas');
		canvas.id = "container";
		canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
		document.body.appendChild( canvas );

		var context = canvas.getContext("2d");
		var ribbonPaint = new Sketch.RibbonPaint( canvas );

		// Loop
		(function loop() {
			context.clearRect(0, 0, canvas.width, canvas.height);
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
		_bristleCount		: 1,
		_brushRadius		: 10,
		_filamentSpacing    : 50,
		_filamentCount      : 3,
		_frictionMin		: 0.7,
		_frictionRange		: 0.2,
		_gravity			: 0,

		initMouseEvents: function() {
			var that = this;
			this._canvas.addEventListener('mousedown', function(e) { that.onMouseDown(e) }, false);
			this._canvas.addEventListener('mousemove', function(e) { that.onMouseMove(e) }, false);
			this._canvas.addEventListener('mouseup', function(e) { that.onMouseUp(e) }, false);
		},

		createBrush: function() {
			if(this._lines.length != 0)
				this._lines = [];

			for (var i = 0; i < this._bristleCount; ++i) {
				var radius =  this._brushRadius;
				var radian = Math.random() * Math.PI * 2;

				//linePointer
				var line = new Sketch.Line();
				line.x = Math.cos(radian) * radius;
				line.y = Math.sin(radian) * radius;

				line.segmentLength = this._filamentSpacing;
				line.segmentNum = this._filamentCount;
				line.gravity = this._gravity;
				line.friction = Sketch.Utils.randRange( this._frictionMin, this._frictionMin+this._frictionRange );
				line.init();
				console.info(line);
				this._lines.push( line );
			}
		},

		update: function() {
			for(var i = 0; i < this._bristleCount; ++i) {
				this._lines[i].update( this._mousePosition, 0.5 );
			}
		},

		draw: function() {

			if(!this._press) {
				this._context.beginPath();
				this._context.closePath();
			}

			for(var i = 0; i < this._bristleCount; ++i ) {
				this._lines[i].draw( this._context );
			}
		},

		onMouseDown: function(event) {
			this._press = true;

			// Clear background
			this._context.beginPath();
			this._context.closePath();
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
		}
	};

///// LINE
	Sketch.Line = function () {

	};

	Sketch.Line.prototype = {
		segmentNum		: 5,
		segmentLength	: 5,
		gravity			: 10,
		friction		: 3,
		x				: 0,
		y				: 0,
		oldX			: 0,
		oldY			: 0,

		_segments		: [],

		init: function() {
			var i = 0;

			this._segments.push( new Sketch.Segment( 0 ) );

			for (i=1; i < this.segmentNum; ++i) {
				var segment = new Sketch.Segment(this.segmentLength * (i*0.5) );
				this._segments.push( segment );
			}
		},

		update: function( toPosition, damping ) {
			this.oldX += (toPosition.x - this.oldX) * damping;
			this.oldY += (toPosition.y - this.oldY) * damping;

			this.drag( this._segments[0], this.oldX, this.oldY);

			for (var i = 1; i < this.segmentNum; ++i) {
				var segmentA = this._segments[i];
				var segmentB = this._segments[i-1];
				this.drag( segmentA, segmentB.x, segmentB.y );
			}
		},

		draw: function( context ) {
			context.moveTo( this._segments[0].x, this._segments[0].y );
				for(var i = 1; i < this.segmentNum; ++i) {
					context.lineTo( this._segments[i].x, this._segments[i].y )
				}
			context.strokeStyle = "#FF0000";
			context.stroke();
		},

		drag: function( segment, xpos, ypos ) {
			segment.update();

			var dx		= xpos - segment.x;
			var dy		= ypos - segment.y;
			segment.angle	= Math.atan2(dy, dx);
//			console.log(segment.angle);

			var pin = segment.getPin();
			var w = pin.x - segment.x;
			var h = pin.y - segment.y;

			segment.x = xpos - w;
			segment.y = ypos - h;
			segment.setVector();

			segment.vx *= this.friction;
			segment.vy *= this.friction;
			segment.vy += this.gravity;
		}
	};

///// SEGMENT
	Sketch.Segment = function ( aLength ) {
		this.segmentLength = aLength;

		this.angle = 0.0;
		this.x = Sketch.Utils.randRange(1.0, 1.5);
		this.y = Sketch.Utils.randRange(1.0, 1.5);

		this.vx = Sketch.Utils.randRange(0.0, 1.0);
		this.vy = Sketch.Utils.randRange(0.0, 1.0);
		this.prevY = Sketch.Utils.randRange(0.0, 1.0);
		this.prevX = Sketch.Utils.randRange(0.0, 1.0);
	};

	Sketch.Segment.prototype = {
		/**{
		private var segmentLeng	:Number;
		public  var vx			:Number = 0;
		public  var vy			:Number = 0;

		private var prevX		:Number = 0;
		private var prevY		:Number = 0;

		public function Segment( segmentLeng:Number ):void
		{
			this.segmentLeng = segmentLeng;
		}

		public function next():void
		{
			x += vx;
			y += vy;
		}

		public function setVector():void
		{
			if( prevX ) vx = x - prevX;
			if( prevY ) vy = y - prevY;

			prevX = x;
			prevY = y;
		}

		public function getPin():Point
		{
			var angle	:Number = rotation * Math.PI / 180;
			var xpos	:Number = x + Math.cos( angle ) * segmentLeng;
			var ypos	:Number = y + Math.sin( angle ) * segmentLeng;

			return new Point( xpos, ypos );
		}
	}
		 */
		segmentLength: 0,
		angle		: 0,
		x			: 0,
		y			: 0,
		vx			: 0,
		vy			: 0,
		prevX		: 0,
		prevY		: 0,

		update: function() {
			this.x += this.vx;
			this.y += this.vy;
		},

		setVector: function() {
			if(this.prevX && this.prevY) {
				this.vx = (this.x - this.prevX);
				this.vy = (this.x - this.prevY);
			}
			this.prevX = this.x;
			this.prevY = this.y;
		},

		getPin: function() {
			var xpos = this.x + Math.cos( this.angle ) * this.segmentLength;
			var ypos = this.y + Math.sin( this.angle ) * this.segmentLength;

			return new Sketch.Point( xpos, ypos );
		}
	};
}());

