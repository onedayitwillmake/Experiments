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
        this._auto = true;
        this._currentlyDraggedPoint = null;

        var radius = 10;

        var D = null;
        for(var i = 0; i < 3; ++i) {
            // Use previous point if it existed
            var A = D || this.createAndAddRandomPoint(radius);
            var B = this.createAndAddRandomPoint(radius*0.75);
            var C = this.createAndAddRandomPoint(radius*0.75);
            var D = this.createAndAddRandomPoint(radius);

            this.createSplineSegmentWithControlPoints( A, B, C, D );
        }

        var gui = new dat.GUI();
        gui.add(this, '_T', 0, 1).name("T");
        gui.add(this, '_auto').name("Auto");
    },

    update: function() {
        if( this._auto )
            this._T += 0.002;

        this._T %= 1;
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
        // Draw the spline-segments
        var splineT = this._T * this._splineSegments.length;
        for( i = 0, len = this._splineSegments.length; i < len; ++i ) {
            var localT;
            if( splineT > i+1 ) localT = 1;       // If splineT = 2.6 and we're at the 2nd object - localT = 1
            else if( splineT < i ) localT = 0;  // Coinciding with above, if we're at the 3rd object - localT = 0
            else localT = splineT-i;

            this._splineSegments[i].evaluateAt( localT );
            this._splineSegments[i].draw( ctx );
        }
    },

    ///// SPLINE CREATION
    createSplineSegmentWithControlPoints: function(a, b, c, d) {
        var splineSegment = new Curves.CubicBezierCurve(a,b,c, d);
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
        angle += 0.25 + random(0.6);

        var padding = 200;
        var x = this.width/2 + Math.cos(angle) * padding + random(padding*0.5);
        var y = this.height/2 + Math.sin(angle) * padding + random(padding*0.25);
        return this.createControlPointAtXY(x, y, radius);
    }
});

demo.start();