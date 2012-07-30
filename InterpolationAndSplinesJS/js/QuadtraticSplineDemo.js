var angle= Math.random() * Math.PI*2;
var demo = Sketch.create({
    _T      : 0,
    _points: [],
    _currentlyDraggedPoint: null,
    _splineSegments: null,

    // Override props in Sketch
    container: document.getElementById( 'container' ),
    autoclear: true,
    fullscreen: false,
    width: document.getElementById( 'container').offsetWidth,
    height: document.getElementById( 'container').offsetHeight,

    setup: function() {
        window.addEventListener("focus", function(e) {console.log("GAINED");  demo.start(); }, true);
        window.addEventListener("blur", function(e) { console.log("LOST"); demo.stop(); }, true);

        this._splineSegments = [];
        this._T = 0.5;
        this._currentlyDraggedPoint = null;

        var radius = 10;
        var A = this.createAndAddRandomPoint(radius);
        var B = this.createAndAddRandomPoint(radius);
        var C = this.createAndAddRandomPoint(radius);
        var D = this.createAndAddRandomPoint(radius);
        var E = this.createAndAddRandomPoint(radius);
        var F = this.createAndAddRandomPoint(radius);
        var G = this.createAndAddRandomPoint(radius);



        this.createSplineSegmentWithControlPoints( A, B, C ); // abc
        this.createSplineSegmentWithControlPoints( C, D, E ); // cde
        this.createSplineSegmentWithControlPoints( E, F, G ); // efg

        var gui = new dat.GUI();
        gui.add(this, '_T', 0, 1).name("T");
        console.log(  );
    },

    update: function() {
        if( !this.dragging || (this.dragging && this._currentlyDraggedPoint ) )
            this._T += 0.006;

        this._T %= 1;
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

        // Draw the spline-segments
        var splineT = this._T * this._splineSegments.length;
        for( i = 0, len = this._splineSegments.length; i < len; ++i ) {

            var localT;
            if( splineT > i+1 ) localT = 1;       // If splineT = 2.6 and we're at the 2nd object - localT = 1
            else if( splineT < i ) localT = 0;  // Coinciding with above, if we're at the 3rd object - localT = 0
            else localT = splineT-i;

            this._splineSegments[i].evaluateAt( localT );
            this._splineSegments[i].draw( ctx )
        }
    },

    ///// SPLINE CREATION
    createSplineSegmentWithControlPoints: function(a, b, c) {
        var splineSegment = new Curves.QuadtraticBezierCurve(a,b,c);
        this._splineSegments.push( splineSegment );
        return splineSegment;
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
        angle += 0.25 + random(1);

        var padding = 200;
        var x = this.width/2 + Math.cos(angle) * padding + random(padding*0.25);
        var y = this.height/2 + Math.sin(angle) * padding + random(padding*0.25);
        return this.createControlPointAtXY(x, y, radius);
    }
});

demo.start();