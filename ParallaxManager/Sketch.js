/**
 *
 * Mario Gonzalez
 * http://ribbonpaint.com
 */
(function(){
	var onLoad = function( event ) {
		var container =	document.getElementById('parallaxContainer');
        container.style.width = window.innerWidth-20 + "px";
        container.style.height = window.innerHeight-20 + "px";

		var parallaxManager = new Sketch.ParrallaxManager();

		parallaxManager.initMouseEvents(container);
		var mousePosition = new Sketch.Point(0,0);
		
		var len = 200;
		var maxSize = 100;
		for(var i = 0; i < len; ++i) {
			var size = Math.random() * maxSize;
			var div = document.createElement("div");
			div.style.width = Math.round(size)+ "px";
			div.style.height = Math.round(size) + "px";
			div.style.background = "#" + (Math.round(Math.random()*255*255*255)).toString(16); // Random color
            div.className += " parallaxObject";

			var ratio = Math.random();//1.0 - (size/maxSize);           // smaller number = 'further away'
			var halfWidth = window.innerWidth/2;
			var halfHeight = window.innerHeight/2;

            // Offset is where this object is relative to the
//			var offset = new Sketch.Point(Math.random() * halfWidth + halfWidth/2, Math.random() * halfHeight + halfHeight)
			var offset = new Sketch.Point(i * size, 0  );


            parallaxManager.addChild( div, 1, new Sketch.Point(ratio, ratio), offset);
			container.appendChild( div );
		}
		
		
		// Loop
		(function loop() {
			var xWidth = 5000;
			var halfHeight = 1500;

            var deltaX = (parallaxManager._mousePosition.x - window.innerWidth/2);
            deltaX /= window.innerWidth;

			var targetX = (deltaX * xWidth) + (xWidth/2);
			var targetY = ( parallaxManager._mousePosition.y / window.innerHeight ) * halfHeight;
			var ease = 0.05;
			
			parallaxManager._position.x -= (parallaxManager._position.x-targetX) * ease;
			parallaxManager._position.y -= (parallaxManager._position.y-targetY) * ease;

			parallaxManager.update();
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
	Sketch.ParrallaxManager = function() {
		this._objects = [];
		this._mousePosition = new Sketch.Point();
		this._position = new Sketch.Point();
		this._lastPosition = new Sketch.Point();
	};

	Sketch.ParrallaxManager.prototype = {
		
		initMouseEvents: function( container ) {
			var that = this;
			container.addEventListener('mousedown', function(e) { that.onMouseDown(e) }, false);
			container.addEventListener('mousemove', function(e) { that.onMouseMove(e) }, false);
			container.addEventListener('mouseup', function(e) { that.onMouseUp(e) }, false);
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

//            console.log("offsetx: " , e.offsetX, e.screenX);
			// Get the mouse position relative to the canvas element.
			if (e.layerX || e.layerX == 0) { // Firefox
				x = e.layerX;
				y = e.layerY;
			} else if (e.offsetX || e.offsetX == 0) { // Opera
				x = e.offsetX;
				y = e.offsetY;
			}

	
			this._mousePosition.x = e.screenX;
			this._mousePosition.y = e.screenY;
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