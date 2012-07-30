
var demo = Sketch.create({
    _T      : 0,
    _points: [],
    _currentlyDraggedPoint: null,
    _bezier: {},

    // Override props in Sketch
    container: document.getElementById( 'container' ),
    autoclear: true,
    fullscreen: false,
    width: document.getElementById( 'container').offsetWidth,
    height: document.getElementById( 'container').offsetHeight,

	setup: function() {
        window.addEventListener("focus", function(e) {console.log("GAINED");  demo.start(); }, true);
        window.addEventListener("blur", function(e) { console.log("LOST"); demo.stop(); }, true);

        this._points = [];
        this._bezier = {};
        this._T = 0.5;
        this._currentlyDraggedPoint = null;

        this._bezier.A = this.createAndAddRandomPoint(10);
        this._bezier.B = this.createAndAddRandomPoint(10);

        var gui = new dat.GUI();
        gui.add(this, '_T', 0, 1).name("T");
        console.log(  );
	},

	update: function() {
		// radius = 2 + Math.abs( Math.sin( demo.millis * 0.003 ) * 50 );
	},

	// Event handlers
	keydown: function() {
		if ( this.keys.C )
			this.clear();
	},

    mousedown: function( e ) {
        var touch = demo.touches[0];
        var touchPoint= new toxi.geom.Vec2D(touch.x, touch.y);

        this._currentlyDraggedPoint = null;
        this._points.forEach(function( cp, index, array ){
            if( cp.containsPoint( touchPoint ) )
                this._currentlyDraggedPoint = cp;
        }, this);
    },

	// Mouse & touch events are merged, so handling touch events by default
	// and powering sketches using the touches array is recommended for easy
	// scalability. If you only need to handle the mouse / desktop browsers,
	// use the 0th touch element and you get wider device support for free.
	touchmove: function( e ) {
        if(this.dragging && this._currentlyDraggedPoint)
            this._currentlyDraggedPoint.drag( demo.touches[0] );
	},

    touchend: function( e ) {
        console.log("touchend");
    },

	draw: function( ctx ) {
        // Draw the control points
        for( var i= 0, len = this._points.length; i < len; ++i ) {
            this._points[i].draw( ctx )
        }

        var cpos = this.getLinearBezierAB(this._bezier.A.getPos(), this._bezier.B.getPos(), this._T );
        var c = new Curves.ControlPoint(cpos.x, cpos.y, null);
        c._color = Curves.ControlPoint.prototype.COLOURS[0];
        c.draw( ctx );


        this.drawLine( ctx, this._bezier.A.getColor(), this._bezier.A.getPos(), this._bezier.B.getPos() )
	},

    /**
     * Gets the point P at time t for a Linear Bezier Curve
     * @param p0
     * @param p1
     * @param t
     * @return {*}
     */
    getLinearBezierAB: function( A, B, t ) {
        var s = 1.0 - t;
        var x = ( A.x * s ) + (B.x * t);
        var y = ( A.y * s ) + (B.y * t );

        return new toxi.geom.Vec2D(x,y);
    },

    /**
     * Draws a line between two points, and sets the color back after
     * @param ctx
     * @param color
     * @param start
     * @param end
     */
    drawLine: function( ctx, color, start, end ) {
        var oldColor = demo.strokeStyle;

        demo.strokeStyle = color;
        demo.beginPath();
        demo.moveTo(start.x, start.y);
        demo.lineTo(end.x, end.y);
        demo.stroke();

        demo.strokeStyle = oldColor;
    },


    ///// CONTROL POINT CREATION
    createControlPointAtPoint: function( aPoint, radius ) {
        this.createControlPointAtXY(aPoint.x, aPoint.y, radius );
    },

    createControlPointAtXY: function(x, y, radius) {
        var cp = new Curves.ControlPoint(x,y, radius );
        this._points.push( cp );
        return cp;
    },

    createAndAddRandomPoint: function(radius) {
        var padding = 100;
        var x = random(this.width - padding) + padding/2;
        var y = random(this.height-padding) + padding/2;
        return this.createControlPointAtXY(x, y, radius);
    }
});

demo.start();