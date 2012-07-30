 /**
 * A Cubic Bezier Curve, is just a blend of 2 Quadtratic Bezier Curves
 * A Quadtratic Bezier Curve is just a blend of 2 Linear Bezier Curve
 * A Linear Bezier Curve is just a straight line along AB at time T
 *
 * In a sense you can think of a Cubic Bezier Curve, as a blend of a 6 linear curves like this
 * To give you finally a new point P, which interpolates off

     // A		B		C		D		// Cubic Control Points
     //		E		F		G			// Linear bezier curve points E F G between control points @ T
     //			Q		R				// Linear bezier curve points Q R between above two points @ T
     //				P					// Final point on curve - Linear bezier curve P between Q R  @ T

 * @author onedayitwillmake - Mario Gonzalez http://onedayitwillmake.com
 */
window.namespace("Curves");

(function(){
    Curves.CubicBezierCurve = function(A, B, C, D){
        this._A = A;
        this._B = B;
        this._C = C;
        this._D = D;

        var pointRadius = this._A.getRadius();

        // Interpolated control points
        this._E = new Curves.ControlPoint( this._A.getPos().x, this._A.getPos().x, pointRadius * 0.3 );
        this._F = new Curves.ControlPoint( this._B.getPos().x, this._B.getPos().x, pointRadius * 0.3 );
        this._G = new Curves.ControlPoint( this._C.getPos().x, this._C.getPos().x, pointRadius * 0.3 );

        // Points EFG make 2 Lines, we interpolate between those two lines along t
        // to get 2 new points Q R
        this._Q = new Curves.ControlPoint(0, 0, pointRadius * 0.3 );
        this._R = new Curves.ControlPoint(0, 0, pointRadius * 0.3 );

        // Finally we interpolate between QR to get solvedP
        this._solvedP = new Curves.ControlPoint(0,0, pointRadius * 0.5);
    };

    Curves.CubicBezierCurve.prototype = {
        // @type {Curves.ControlPoint}
        _A: null,

        // @type {Curves.ControlPoint}
        _B: null,

        // @type {Curves.ControlPoint}
        _C: null,

        // @type {Curves.ControlPoint}
        _D: null,

        // @type {Curves.ControlPoint}
        _E: null,

        // @type {Curves.ControlPoint}
        _F: null,

        // @type {Curves.ControlPoint}
        _G: null,

        // @type {Curves.ControlPoint}
        _Q: null,

        // @type {Curves.ControlPoint}
        _R: null,

        // @type {Curves.ControlPointD}
        _solvedP: null,

        // @type {Number}
        _t: 0,

        evaluateAt: function( t ) {
            this._t = t;
            this._solvedP.setPos( this.solveCubicBezierABCD( this._A.getPos(), this._B.getPos(), this._C.getPos(), this._D.getPos(), this._t ) );
        },

        /**
         * @param {CanvasRenderingContext2D} ctx
         */
        draw: function( ctx ){
            this.drawLine( ctx, this._A.getColor(), this._A.getPos(), this._B.getPos() );
            this.drawLine( ctx, this._B.getColor(), this._B.getPos(), this._C.getPos() );
            this.drawLine( ctx, this._C.getColor(), this._C.getPos(), this._D.getPos() );

            // Draw the curve using canvas
            demo.lineWidth = 1;
            demo.strokeStyle = "#777777";
            demo.beginPath();
            demo.moveTo(this._A.getPos().x, this._A.getPos().y);
            demo.bezierCurveTo(
                this._B.getPos().x, this._B.getPos().y,
                this._C.getPos().x, this._C.getPos().y,
                this._D.getPos().x, this._D.getPos().y );
            demo.stroke();


            // Show the correlation between the simple LinearBezierCurve AC
            var linearAB = this.solveLinearBezierAB( this._A.getPos(), this._B.getPos(), this._t );
            this._E.setPos( linearAB );
            this._E.draw( ctx );

            // Show the correlation between the simple LinearBezierCurve BC
            var linearBC = this.solveLinearBezierAB(this._B.getPos(), this._C.getPos(), this._t );
            this._F.setPos(linearBC );
            this._F.draw( ctx );

            // Show the correlation between the simple LinearBezierCurve CD
            var linearCD = this.solveLinearBezierAB(this._C.getPos(), this._D.getPos(), this._t );
            this._G.setPos( linearCD );
            this._G.draw( ctx );


            // Draw a line between them to show that it is the tangent of the quadtratic curve
//            demo.lineWidth = 0.25;
            if( this._t > 0 && this._t < 1)  {
                this.drawLine( ctx, "#FFFFFF", linearAB, linearBC );
                this.drawLine( ctx, "#FFFFFF", linearBC, linearCD );
            }


            // Interpolate along the AB-BC interpolation
            var linearEF = this.solveLinearBezierAB( linearAB, linearBC, this._t );
            this._Q.setPos( linearEF );
            this._Q.draw( ctx );

            // Interpolate along the BC CD interpolation
            var linearFG = this.solveLinearBezierAB( linearBC, linearCD, this._t );
            this._R.setPos( linearFG );
            this._R.draw( ctx );

            // Finally - interpolate along the EF FG interpolation
            this.drawLine( ctx, "#CCCCCC", linearEF, linearFG );

            demo.lineWidth = 0.5;
            // Draw where our final point is after we've evaluated the QuadtraticCurve for T
            this._solvedP.setPos( this.solveCubicBezierABCD(this._A.getPos(), this._B.getPos(), this._C.getPos(), this._D.getPos(), this._t ) );
            this._solvedP.draw(ctx);


            this._A.draw( ctx );
            this._B.draw( ctx );
            this._C.draw( ctx );
            this._D.draw( ctx );
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


        solveCubicBezierABCD: function( p0, p1, p2, p3, t ) {
            var t2 = t*t;
            var t3 = t*t*t;

            var s = 1.0-t;
            var s2 = s*s;
            var s3 = s*s*s;

            var x = s3*p0.x + ((3*s2*t)*p1.x) + ((3*s*t2)*p2.x) + t3* p3.x;
            var y = s3*p0.y + ((3*s2*t)*p1.y) + ((3*s*t2)*p2.y) + t3* p3.y;

            return new toxi.geom.Vec2D(x,y);
        },

        /**
         * Gets point P at time T for a Quadratic Bezier Curve ABC
         * @param A
         * @param B
         * @param C
         * @param t
         * @return {toxi.geom.Vec2D}
         */
        solveQuadtraticABC: function( A, B, C, t ) {
            var s = 1.0 - t;
            var s2 = s*s;
            var t2 = t*t;

            var x = s2*A.x + (2*(s*t))*B.x + t2*C.x;
            var y = s2*A.y + (2*(s*t))*B.y + t2*C.y;

            return new toxi.geom.Vec2D(x,y);
        },

        solveLinearBezierAB: function ( A, B, t) {
            var s = 1.0 - t;
            var x = ( A.x * s ) + (B.x * t);
            var y = ( A.y * s ) + (B.y * t );

            return new toxi.geom.Vec2D(x,y);
        }
    }
})();