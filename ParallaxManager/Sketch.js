/**
 * RibbonPaintCanvas
 * Mario Gonzalez
 * http://ribbonpaint.com
 */
(function(){
	var onLoad = function( event ) {
		var container =	document.getElementById('parallaxContainer');
		var parallaxManager = new Sketch.ParrallaxManager();
		parallaxManager.initMouseEvents(container);
		var mousePosition = new Sketch.Point(0,0);
		
		var len = 80;
		var maxSize = 50;
		for(var i = 0; i < len; ++i) {
			var size = Math.random() * maxSize;
			var div = document.createElement("div");
			div.style.width = Math.round(size)+ "px";
			div.style.height = Math.round(size) + "px"
			div.style.background = "#" + (Math.round(Math.random()*255*255*255)).toString(16);
 			div.style.position = "absolute";
			
			var ratio = (1.0 - (size/maxSize)); // smaller number = 'further away'
			var halfWidth = window.innerWidth/2;
			var halfHeight = window.innerHeight/2;
			var offset = new Sketch.Point(Math.random() *5, 0) 
			parallaxManager.addChild( div, 1, new Sketch.Point(ratio, ratio*0.1), offset);
			container.appendChild( div );
		}
		
		
		// Loop
		(function loop() {
			var halfWidth = 1000;
			var halfHeight = window.innerHeight;
			var targetX = ( (parallaxManager._mousePosition.x-halfWidth) / window.innerWidth ) * halfWidth;
			var targetY = ( (parallaxManager._mousePosition.y-halfHeight) / window.innerHeight ) * halfHeight;
			var ease = 0.1;
			
			parallaxManager._position.x -= (parallaxManager._position.x-targetX) * ease;
			parallaxManager._position.y -= (parallaxManager._position.y-targetY) * ease;
			
			parallaxManager.update();
			window.requestAnimationFrame( loop, null );
		})();
	};


	function initMouseEvents( container ) {
			
	}
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
	Sketch.ParrallaxManager = function() {
		this._objects = [];
		this._mousePosition = new Sketch.Point();
		this._position = new Sketch.Point();
		this._lastPosition = new Sketch.Point();
	};

	Sketch.ParrallaxManager.prototype = {
		
		initMouseEvents: function( container ) {
			var that = this;
			document.addEventListener('mousedown', function(e) { that.onMouseDown(e) }, false);
			document.addEventListener('mousemove', function(e) { that.onMouseMove(e) }, false);
			document.addEventListener('mouseup', function(e) { that.onMouseUp(e) }, false);
		},
		
		addChild : function( aChild, zIndex, parallaxRatio, positionOffset ) {

			// zIndex = 1; // Z not implemented yet
		
			var parallaxObject = new Sketch.ParallaxObject( aChild, parallaxRatio, positionOffset)
			this._objects.push(parallaxObject);
		
		
			var pos = this._position.clone();
			pos.x = pos.x * parallaxRatio.x + positionOffset.x;
			pos.y = pos.y * parallaxRatio.y + positionOffset.y
			
			parallaxObject.setPosition(pos.x, pos.y);
		},
	
	
		update: function( delta ) {
			var pos = this._position.clone();

			if( pos.isEqual(this._lastPosition) ) // Nothing changed 
			{
				this._lastPosition.x = pos.x;
				this._lastPosition.y = pos.y;
				return;	
			}

			var len = this._objects.length;
			for(var i = 0; i < len; ++i) {
				var parallaxObject = this._objects[i];

				var x = -pos.x + pos.x * parallaxObject._parallaxRatio.x + parallaxObject._offset.x;
				var y = -pos.y + pos.y * parallaxObject._parallaxRatio.y + parallaxObject._offset.y;			

				parallaxObject.setPosition(x, y);
			}
			
			this._lastPosition.x = pos.x;
			this._lastPosition.y = pos.y;
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
	};
	
	Sketch.ParallaxObject = function( child, parallaxRatio, offset ) {
		this._child = child;
		this._position = new Sketch.Point();
		this._parallaxRatio = parallaxRatio;
		this._offset = offset;
	};
	Sketch.ParallaxObject.prototype = { 
		_child			: null,
		_position		: null,
		_parallaxRatio	: null,
		_offset			: null,	
		
		setPosition		: function(x, y) {
			this._position = new Sketch.Point(x, y);
 			this._child.style.left = Math.round(x) + "px";
	 		this._child.style.top = Math.round(y) + "px";
		}
	}
	
}());