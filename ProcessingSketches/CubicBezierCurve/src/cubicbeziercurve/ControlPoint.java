package cubicbeziercurve;

import processing.core.PApplet;
import toxi.color.TColor;
import toxi.geom.Circle;
import toxi.geom.Vec2D;

public class ControlPoint {
	private Circle _circle;
	private TColor	_color;
	private int		__color;
	private Boolean isSelectable = false;
	
	public ControlPoint( Vec2D aPoint ) {
		setCircle( new Circle( aPoint.x, aPoint.y, 20 )  );
		setHue( 1.0f );		
	}
	
	public void draw() {
		CubicBezierCurve app = CubicBezierCurve.APP;
		app.fill( __color );
		app.ellipse(_circle.x, _circle.y, _circle.getRadius(), _circle.getRadius() );
	}

	///// ACCESSORS
	public Circle getCircle() { return this._circle; }
	public void setCircle(Circle aCircle) { _circle = aCircle; };
	public void setHue( float aHue ) {
		setColor( TColor.newHSV(aHue, 0.6f, 1.0f) );
	}
	
	public void setColor(TColor aColor) { 
		this._color = aColor; 
		__color = this._color.toARGB();
		
		PApplet.println( __color ); 
	}
	public int getColor() { return __color; };
	public float x() { return _circle.x; };
	public float y() { return _circle.y; };
	public void setPosition(Vec2D aPosition ) {
		_circle.x = aPosition.x;
		_circle.y = aPosition.y;
	}
	
	public void setIsSelectable(Boolean isSelectable) { this.isSelectable = isSelectable; }
	public Boolean containsPoint( Vec2D aPoint) { 
		return this._circle.containsPoint( aPoint );
	}
}
