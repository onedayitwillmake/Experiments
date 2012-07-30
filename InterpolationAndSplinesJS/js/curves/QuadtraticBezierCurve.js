/**
 *  Quadtratic Bezier Curve is just a blend of two Linear Bezier Curves
 */
window.namespace("Curves");

(function(){
    Curves.QuadtraticBezierCurve = function(A, B, C){
        this._A = A;
        this._B = B;
        this._C = C;

        this._solvedP = new Curves.ControlPoint(this._A.getPos().x, this._A.getPos().y, this._A.getRadius() * 0.5);

        this._pointAB = new Curves.ControlPoint( this._A.getPos().x, this._A.getPos().x, this._A.getRadius() * 0.3 );
        this._pointAB.setColor = this._A.getColor();

        this._pointBC = new Curves.ControlPoint( this._B.getPos().x, this._B.getPos().x, this._A.getRadius() * 0.3 );
        this._pointBC.setColor = this._B.getColor();
    };

    Curves.QuadtraticBezierCurve.prototype = {
        // @type {Curves.ControlPoint}
        _A: null,

        // @type {Curves.ControlPoint}
        _C: null,

        // @type {Curves.ControlPoint}
        _B: null,

        // @type {Curves.ControlPoint}
        _pointAB: null,

        // @type {Curves.ControlPoint}
        _pointBC: null,

        // @type {Curves.ControlPointD}
        _solvedP: null,

        // @type {Number}
        _t: 0,

        evaluateAt: function( t ) {
            this._t = t;
            this._solvedP.setPos( this.getQuadraticBezierABC( this._A.getPos(), this._B.getPos(), this._C.getPos(), this._t ) );
        },

        /**
         * @param {CanvasRenderingContext2D} ctx
         */
        draw: function( ctx ){

            // Draw the curve using canvas
            demo.strokeStyle = this._A.getColor();
            demo.lineWidth = 0.75;
            demo.beginPath();
            demo.moveTo(this._A.getPos().x, this._A.getPos().y);
            demo.quadraticCurveTo(this._B.getPos().x, this._B.getPos().y, this._C.getPos().x, this._C.getPos().y );
            demo.stroke();

            demo.lineWidth = 0.5;

            // Draw where our final point is after we've evaluated the QuadtraticCurve for T
            this._solvedP.draw(ctx);


            // Draw relationship between the simple Linear Bezier Curve AB
            this._pointAB.setPos( this.solveLinear( this._A.getPos(), this._B.getPos(), this._t ) );
            this._pointAB.draw( ctx );

            // Draw relationship between the simple Linear Bezier Curve BC
            this._pointBC.setPos( this.solveLinear( this._B.getPos(), this._C.getPos(), this._t ) );
            this._pointBC.draw( ctx );

            // Draw a line between them to show that it is the tangent of the quadtratic curve
            if( this._t > 0 && this._t < 1)
            this.drawLine( ctx, "#FF0000", this._pointAB.getPos(), this._pointBC.getPos() );


            // Draw lines between the two knots
            demo.lineWidth = 0.25;
            this.drawLine( ctx, "#FFFFFF", this._A.getPos(), this._B.getPos() );
            this.drawLine( ctx, "#FFFFFF", this._B.getPos(), this._C.getPos() );

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

        /**
         * Gets point P at time T for a Quadratic Bezier Curve ABC
         * @param A
         * @param B
         * @param C
         * @param t
         * @return {toxi.geom.Vec2D}
         */
        getQuadraticBezierABC: function( A, B, C, t ) {
            var s = 1.0 - t;
            var s2 = s*s;
            var t2 = t*t;

            var x = s2*A.x + (2*(s*t))*B.x + t2*C.x;
            var y = s2*A.y + (2*(s*t))*B.y + t2*C.y;

            return new toxi.geom.Vec2D(x,y);
        },

        solveLinear: function ( A, B, t) {
            var s = 1.0 - t;
            var x = ( A.x * s ) + (B.x * t);
            var y = ( A.y * s ) + (B.y * t );

            return new toxi.geom.Vec2D(x,y);
        }
    };
})();