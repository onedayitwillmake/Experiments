(function(){
    ZOA.namespace("ZOA.utils");
	console.log(ZOA)
    ZOA.utils.Primitives = function() {

    };

    ZOA.utils.Primitives.prototype = {
		drawCube: function( center, size, mesh ) {
//			var c = {x: 0, y: 0, z:0};
//			var size = {x: 1, y: 1, z:0.5};

			var sx = size.x * 0.5;
			var sy = size.y * 0.5;
			var sz = size.z * 0.5;
			// 24*3
			var vertices = [center.x + 1.0 * sx,center.y + 1.0 * sy,center.z + 1.0 * sz,	center.x + 1.0 * sx,center.y + -1.0 * sy,center.z + 1.0 * sz,	center.x + 1.0 * sx,center.y + -1.0 * sy,center.z + -1.0 * sz,	center.x + 1.0 * sx,center.y + 1.0 * sy,center.z + -1.0 * sz,		// +X
				center.x + 1.0 * sx,center.y + 1.0 * sy,center.z + 1.0 * sz,	center.x + 1.0 * sx,center.y + 1.0 * sy,center.z + -1.0 * sz,	center.x + -1.0 * sx,center.y + 1.0 * sy,center.z + -1.0 * sz,	center.x + -1.0 * sx,center.y + 1.0 * sy,center.z + 1.0 * sz,		// +Y
				center.x + 1.0 * sx,center.y + 1.0 * sy,center.z + 1.0 * sz,	center.x + -1.0 * sx,center.y + 1.0 * sy,center.z + 1.0 * sz,	center.x + -1.0 * sx,center.y + -1.0 * sy,center.z + 1.0 * sz,	center.x + 1.0 * sx,center.y + -1.0 * sy,center.z + 1.0 * sz,		// +Z
				center.x + -1.0 * sx,center.y + 1.0 * sy,center.z + 1.0 * sz,	center.x + -1.0 * sx,center.y + 1.0 * sy,center.z + -1.0 * sz,	center.x + -1.0 * sx,center.y + -1.0 * sy,center.z + -1.0 * sz,	center.x + -1.0 * sx,center.y + -1.0 * sy,center.z + 1.0 * sz,	// -X
				center.x + -1.0 * sx,center.y + -1.0 * sy,center.z + -1.0 * sz,	center.x + 1.0 * sx,center.y + -1.0 * sy,center.z + -1.0 * sz,	center.x + 1.0 * sx,center.y + -1.0 * sy,center.z + 1.0 * sz,	center.x + -1.0 * sx,center.y + -1.0 * sy,center.z + 1.0 * sz,	// -Y
				center.x + 1.0 * sx,center.y + -1.0 * sy,center.z + -1.0 * sz,	center.x + -1.0 * sx,center.y + -1.0 * sy,center.z + -1.0 * sz,	center.x + -1.0 * sx,center.y + 1.0 * sy,center.z + -1.0 * sz,	center.x + 1.0 * sx,center.y + 1.0 * sy,center.z + -1.0 * sz];	// -Z
			// Create the vertices
			for (var i = 0; i < vertices.length; i += 3) {
				mesh.vertices.push(vertices[i], vertices[i + 1], vertices[i + 2])
			}

			// Create the triangles from the elements
			// 6 * 6 - or (6 sides) * (2 triangles) * (3 vertices)
			var elementsA = [0, 1, 2, 0, 2, 3,
							4, 5, 6, 4, 6, 7,
							8, 9,10, 8, 10,11,
							12,13,14,12,14,15,
							16,17,18,16,18,19,
							20,21,22,20,22,23 ];

			for(i = 0; i < elementsA.length; i+=3) {
				mesh.appendTriangle( elementsA[i], elementsA[i+1], elementsA[i+2] );
			}

			// CREATE NORMALS
			// 24 * 3 -
			var normals = [1,0,0,	1,0,0,	1,0,0,	1,0,0,
								  0,1,0,	0,1,0,	0,1,0,	0,1,0,
									0,0,1,	0,0,1,	0,0,1,	0,0,1,
								  -1,0,0,	-1,0,0,	-1,0,0,	-1,0,0,
								  0,-1,0,	0,-1,0,  0,-1,0,0,-1,0,
								  0,0,-1,	0,0,-1,	0,0,-1,	0,0,-1];
			for(i = 0; i < normals.length; i+=3) {
				mesh.appendNormalXYZ( normals[i], normals[i+1], normals[i+2] );
			}

			// 24*4 - (6 sides) * (4 vertices) * (4 - RGBA)
			var colors = [
				255,0,0,255,	255,0,0,255,	255,0,0,255,	255,0,0,255,	// +X = red
				0,255,0,255,	0,255,0,255,	0,255,0,255,	0,255,0,255,	// +Y = green
				0,0,255,255,	0,0,255,255,	0,0,255,255,	0,0,255,255,	// +Z = blue
				0,255,255,255,	0,255,255,255,	0,255,255,255,	0,255,255,255,	// -X = cyan
				255,0,255,255,	255,0,255,255,	255,0,255,255,	255,0,255,255,	// -Y = purple
				255,255,0,255,	255,255,0,255,	255,255,0,255,	255,255,0,255];	// -Z = yellow


			colors = [
				1,0,0,1,	1,0,0,1,	1,0,0,1,	1,0,0,1,	// +X = red
				0,1,0,1,	0,1,0,1,	0,1,0,1,	0,1,0,1,	// +Y = green
				0,0,1,1,	0,0,1,1,	0,0,1,1,	0,0,1,1,	// +Z = blue
				0,1,1,1,	0,1,1,1,	0,1,1,1,	0,1,1,1,	// -X = cyan
				1,0,1,1,	1,0,1,1,	1,0,1,1,	1,0,1,1,	// -Y = purple
				1,1,0,1,	1,1,0,1,	1,1,0,1,	1,1,0,1 	// -Z = yellow
			];
			for(i = 0; i < colors.length; i+=4) {
				mesh.appendColorRGBA( colors[i], colors[i+1], colors[i+2], colors[i+3] );
//				mesh.appendColorRGBA( Math.random(), Math.random(), Math.random(), Math.random())
			}

			// UV
			// 24*4 - ?
			var UVArray = [0,1,	1,1,	1,0,	0,0,
								1,1,	1,0,	0,0,	0,1,
								0,1,	1,1,	1,0,	0,0,
								1,1,	1,0,	0,0,	0,1,
								1,0,	0,0,	0,1,	1,1,
								1,0,	0,0,	0,1,	1,1 ];
			for(i = 0; i < UVArray.length; i+=2) {
				mesh.appendTexCoords( UVArray[i], UVArray[i+1] );
			}
		},

		sphere: function( radius, quality, mesh ) {

			var qualityX = quality;
			var qualityY = quality;
			for (var i = 0; i <= qualityX; i++)
			{
				var theta = i * Math.PI / qualityX;
				var sinTheta = Math.sin(theta);
				var cosTheta = Math.cos(theta);

				for (var j = 0; j <= qualityY; j++)
				{
					var phi = j * 2 * Math.PI / qualityY;

					var x = Math.cos(phi) * sinTheta;
					var y = cosTheta;
					var z = Math.sin(phi) * sinTheta;
					var u = 1 - (j / qualityY);
					var v = 1 - (i / qualityX);

					mesh.appendTexCoords(u, v);
					mesh.appendNormalXYZ(x, y, z);
					mesh.appendVertexXYZ(radius * x, radius * y, radius * z);
					mesh.appendColorRGBA( Math.cos(Math.sin(x*Math.PI*2)), Math.sin(Math.cos(y*Math.PI*2)), Math.cos(Math.cos(z*Math.PI*2)), 1 );


					if (i < qualityX && j < qualityY)
					{
						var first = (i * (qualityY + 1)) + j;
						var second = first + qualityY + 1;

						mesh.appendTriangle( first, second, first+1 );
						mesh.appendTriangle( second, second+1, first+1 );
					}
				}
			}
		}
    }
})();