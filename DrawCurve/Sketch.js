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

		var aList = [];
		var colors = [
				"rgba(0, 255, 255, 1.0)",
				"rgba(255, 0, 255, 1.0)",
				"rgba(255, 255, 0, 1.0)"
		];
		for(var i = 0; i < colors.length; ++i) {
			var sketch = new Sketch.Drawer( canvas );
			sketch._radius = canvas.width/4;
			sketch._angle = i * 0.5;
			sketch._color = colors[i];
			sketch._speed = Math.random() < 0.5 ? 0.002 : -0.002;
			aList.push( sketch );
		}

		// Loop
		(function loop() {
			context.clearRect(0, 0, canvas.width, canvas.height);

			context.fillStyle = "#000000";
			context.rect(0, 0, canvas.width, canvas.height);
			context.fillRect(0, 0, cn)
			context.globalCompositeOperation = "darker";

			for(var i = 0; i < colors.length; ++i) {
				aList[i].createControlPoints();
				aList[i].drawLine();
			}
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

///// Drawer
	Sketch.Drawer = function( aCanvas ) {
		this._canvas = aCanvas;
		this._context = aCanvas.getContext("2d");
	};

	Sketch.Drawer.prototype = {
		_canvas			: null,
		_context		: null,
		_radius			: 200,
		_angle			: 0,
		_speed			: 0,
		_color			: "rgba(128, 128, 128, 0.5)",
		_points			: [],

		POINT_COUNT		: 3,

		createControlPoints: function() {
			this._points = [];
			this._angle += this._speed;
			for( var i = 0; i < Sketch.Drawer.prototype.POINT_COUNT; ++i ) {

				var x = Math.cos( i / Sketch.Drawer.prototype.POINT_COUNT * Math.PI * 2 + this._angle) * this._radius;
				var y = Math.sin( i / Sketch.Drawer.prototype.POINT_COUNT * Math.PI * 2 + this._angle) * this._radius;

				var controlPoint = new Sketch.Point(x, y);
				controlPoint.translate( this._canvas.width / 2, this._canvas.height / 2);

				this._points.push( controlPoint );
			}
		},


		drawLine: function() {
			var pc = Sketch.Drawer.prototype.POINT_COUNT;

			this._context.beginPath();
			this._context.moveTo( this._points[1].x, this._points[1].y );
			for(i = 0; i < pc; ++i ) {
				var pA = (i + pc) % pc;
                var pB = (pA + 1) % pc;
                var pC = (pB + 1) % pc;
                var pD = (pC + 1) % pc;
				var cp = this.getCurvePoint( this._points[pA], this._points[pB], this._points[pC], this._points[pD] );

				this._context.quadraticCurveTo( cp[0].x, cp[0].y, cp[1].x, cp[1].y );
				this._context.quadraticCurveTo( cp[2].x, cp[2].y, this._points[pC].x, this._points[pC].y );
			}
			this._context.closePath();
			this._context.strokeStyle = this._color;
			this._context.fillStyle = this._context.strokeStyle;
			this._context.fill();
			this._context.stroke();

			// Draw control points
			for(var i = 0; i < pc; ++i ) {
				this._context.moveTo( this._points[i].x, this._points[i].y );
				this._context.arc( this._points[i].x, this._points[i].y, 8, 0, Math.PI*2, false );
				this._context.stroke();
			}
		},

		getCurvePoint: function( a, b, c, d ) {
			var beforeA = new Sketch.Point(a.x, a.y);
			var targetA = new Sketch.Point(b.x, b.y);
			var targetB = new Sketch.Point(c.x, c.y);
			var afterB = new Sketch.Point(d.x, d.y);

			var connect = targetA.getDistance( targetB );

			var controlPointA = {};
			controlPointA.r = targetB.getAngleBetween(beforeA );
			controlPointA.p = targetA.getDistance( beforeA );

			var controlPointB = {};
			controlPointB.r = targetA.getAngleBetween(afterB );
			controlPointB.p = targetB.getDistance( afterB );

			var ratio = controlPointA.p / (controlPointA.p + controlPointB.p );

			controlPointA.l = connect/2*ratio;
			controlPointA.x = targetA.x + controlPointA.l * Math.cos( controlPointA.r );
			controlPointA.y = targetA.y + controlPointA.l * Math.sin( controlPointA.r );

			controlPointB.l = connect/2*(1.0-ratio);
			controlPointB.x = targetB.x + controlPointB.l*Math.cos( controlPointB.r );
			controlPointB.y = targetB.y + controlPointB.l*Math.sin( controlPointB.r );

			var centerPoint = new Sketch.Point(
					controlPointA.x + (controlPointB.x - controlPointA.x)*ratio,
					controlPointA.y + (controlPointB.y - controlPointA.y)*ratio
					);

			return [controlPointA, centerPoint, controlPointB];
		}
	};
}());