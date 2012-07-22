package cubicbeziercurve;

import java.util.ArrayList;

import processing.core.PApplet;
import processing.core.PVector;
import toxi.geom.Circle;
import toxi.geom.Vec2D;

/**
 * A Cubic Bezier Curve, is a blend of 2 Quadtratic Bezier Curves
 * A Quadtratic Bezier Curve is a blend of 2 Linear Bezier Curve
 * A Linear Bezier Curve is a straight line along AB at time T
 * 
 * In a sense you can think of a Cubic Bezier Curve, as a blend of a 6 linear curves like this
 * To give you finally a new point P, which interpolates off
 * 
	// A		B		C		D		// Cubic Control Points
	//		E		F		G			// Linear bezier curve points E F G between control points @ T
	//			Q		R				// Linear bezier curve points Q R between above two points @ T
	//				P					// Final point on curve - Linear bezier curve P between Q R  @ T
 * 
 * @author onedayitwillmake - Mario Gonzalez http://onedayitwillmake.com
 *
 */


@SuppressWarnings("serial")
public class CubicBezierCurve extends PApplet {
	private ArrayList<ControlPoint> points;
	
	public ControlPoint A, B, C, D;
	public ControlPoint E, F, G;
	public ControlPoint Q, R;
	public ControlPoint P;
	
	private float __T = 0.0f;
	
	// Dragging
	private ControlPoint _currentDraggedPoint = null;
	
	public static CubicBezierCurve APP;
	public void setup() {
		
		APP = this;
		size(1280, 800);
		smooth();
		noStroke();
		
		
		// A		B		C		D		// Cubic Control Points
		//		E		F		G			// Linear bezier curve points E F G between control points @ T
		//			Q		R				// Linear bezier curve points Q R between above two points @ T
		//				P					// Final point on curve - Linear bezier curve P between Q R  @ T

		
		__T = 0.5f;
		points = new ArrayList<ControlPoint>();
		A = createAndAddRandomPoint(); A.setHue( 0.0f );
		B = createAndAddRandomPoint(); B.setHue( 0.1f );
		C = createAndAddRandomPoint(); C.setHue( 0.1f );
		D = createAndAddRandomPoint(); D.setHue( 0.0f );
		
//		E(t) = sA + tB
		E = createAndAddPoint( getLinearBezierAB(A, B, __T ) ); E.setHue( 0.25f );
		
//		F(t) = sB + tC
		F = createAndAddPoint( getLinearBezierAB(B, C, __T ) ); F.setHue( 0.25f );
		
//		G(t) = sC + tD
		G = createAndAddPoint( getLinearBezierAB(C, D, __T ) ); G.setHue( 0.25f );
		
//		Q(t) = sE + tF
		Q = createAndAddPoint( getLinearBezierAB(E, F, __T ) ); Q.setHue( 0.5f );
		
//		R(t) = sF + tG
		R = createAndAddPoint( getLinearBezierAB(F, G, __T ) ); R.setHue( 0.5f );
		
//		P(t) = sQ + tR
		P = createAndAddPoint( getLinearBezierAB(Q, R, __T ) ); P.setHue( 0.75f );
		
		
//		Combined all of those and we get - there's our "cubic" t3
//		￼￼￼P(t) = (s^3)A + 3(s^2*t)B + 3(s*t^2)C + (t^3)D
		
		
		updateControlPoints();
	}
	
	public void updateControlPoints() {
		// A		B		C		D		// Cubic Control Points
		//		E		F		G			// Linear bezier curve points E F G between control points @ T
		//			Q		R				// Linear bezier curve points Q R between above two points @ T
		//				P					// Final point on curve - Linear bezier curve P between Q R  @ T

		E.setPosition( getLinearBezierAB(A, B, __T ) );
		F.setPosition( getLinearBezierAB(B, C, __T ) );
		G.setPosition( getLinearBezierAB(C, D, __T ) );
		
		Q.setPosition( getLinearBezierAB(E, F, __T ) );
		R.setPosition( getLinearBezierAB(F, G, __T ) );
		
		P.setPosition( getLinearBezierAB(Q, R, __T ) );
	}
	
	public void draw() {
		background(0xFFFFFF);
		noStroke();
		
		// Change T over time
		float frameAlpha = frameCount/2 % 100;
		__T = map(frameAlpha, 1, 100, 0, 1.0f);
		
		if( _currentDraggedPoint != null ) {
			_currentDraggedPoint.getCircle().x = mouseX;
			_currentDraggedPoint.getCircle().y = mouseY;
		}
		updateControlPoints();
		
		for (ControlPoint aControlPoint : points) {
			aControlPoint.draw();
		}
		
		drawLineAB( A, B );
		drawLineAB( B, C );
		drawLineAB( C, D );
		drawLineAB( E, F );
		drawLineAB( F, G );
		
		drawLineAB( Q, R );
		
		
		Vec2D lastPosition = getP(A.getCircle(), B.getCircle(), C.getCircle(), D.getCircle(), 0.0f);
		float iterations = 100.0f;
		for(int i = 0; i <= iterations; ++i ) {
			float t1 = (float)i/iterations;	
			Vec2D currentPosition = getP(A.getCircle(), B.getCircle(), C.getCircle(), D.getCircle(), t1);
			
			//println( currentPosition );
			stroke(64, 64, 64);
			line(lastPosition.x, lastPosition.y, currentPosition.x, currentPosition.y );
			lastPosition = currentPosition;
		}
		
	}
	
	private void drawLineAB( ControlPoint p0, ControlPoint p1 ) {
		stroke( p0.getColor() );
		line(p0.x(), p0.y(), p1.x(), p1.y());
	}
	
	// ￼P = (s * A) + (t * B);
	private Vec2D getLinearBezierAB( ControlPoint p0, ControlPoint p1, float t ) {
		float s = 1.0f - t;
		
		Vec2D aBlend = p0.getCircle().copy();
		aBlend.scaleSelf( s );
		
		Vec2D bBlend = p1.getCircle().copy();
		bBlend.scaleSelf( t );
		
		aBlend.addSelf( bBlend );
		
		return aBlend;
	}
	
	private Vec2D getP( Circle Apos, Circle Bpos, Circle Cpos, Circle Dpos, float t ) {
		//￼￼￼P(t) = (s^3)A + 3(s^2*t)B + 3(s*t^2)C + (t^3)D
		float s = 1.0f - t;
		Vec2D P = new Vec2D(0,0);
		
		float aFactor = (float)Math.pow(s, 3);
		Vec2D A1 = Apos.copy().scale(aFactor);
		
		float bFactor = 3.0f*((float)Math.pow(s,2)*t);
		Vec2D B1 = Bpos.copy().scale(bFactor);
		
		float cFactor = (float) (3.0f*(s*Math.pow(t,2)));
		Vec2D C1 = Cpos.copy().scale(cFactor);
		
		float dFactor = (float)Math.pow(t,3);
		Vec2D D1 = Dpos.copy().scale( dFactor );
		
		P.addSelf(A1);
		P.addSelf(B1);
		P.addSelf(C1);
		P.addSelf(D1);
		
		return P;
	}


	@Override
	public void mousePressed() {
		super.mousePressed();
		
		// Check if we clicked any of hte points
		Vec2D mousePoint = new Vec2D(mouseX, mouseY);
		for (ControlPoint aControlPoint : points) {
			if( aControlPoint.getCircle().containsPoint( mousePoint ) ) {
				_currentDraggedPoint = aControlPoint;
				return;
			}
		}
	}


	@Override
	public void mouseReleased() {
		// TODO Auto-generated method stub
		super.mouseReleased();
		_currentDraggedPoint = null;
	}


	///// POINT CREATION
	public ControlPoint createAndAddRandomPoint() {
		int padding = 100;
		
		Vec2D aPoint = new Vec2D( random(width - padding) + padding/2, random(height-padding) + padding/2);
		ControlPoint cp = new ControlPoint( aPoint );
		points.add( cp );
		return cp;
	}
	
	public ControlPoint createAndAddPoint( Vec2D aPoint ) { 
		ControlPoint cp = new ControlPoint( aPoint );
		points.add( cp );
		return cp;
	}
}
