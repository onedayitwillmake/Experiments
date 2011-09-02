var Quad = function (x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3) {

	var scope = this;

	THREE.Geometry.call(this);

	v(   x0,   y0,   z0 );
	v(   x1,   y1,   z1 );
	v(   x2,   y2,   z2 );
	v(   x3,   y3,   z3 );

	f3( 0, 1, 2 );
	f3( 1, 3, 2 );

	this.computeCentroids();
	this.computeFaceNormals();

	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	}

	function f3( a, b, c ) {

		scope.faces.push( new THREE.Face3( a, b, c ) );

	}

}

Quad.prototype = new THREE.Geometry();
Quad.prototype.constructor = Quad;