(function(){
	CanvasPS3 = (typeof CanvasPS3 === 'undefined') ? {} : CanvasPS3;
	var onLoad = function( event ) {
		// Create canvas element
		var canvas = document.createElement('canvas');
		canvas.width = (window.innerWidth-25);
		canvas.height = (document.body.scrollHeight-25);
		document.getElementById('container').appendChild( canvas );

		var context = canvas.getContext("2d");
		context.lineWidth = 1;
		context.strokeStyle ="rgb(255,255, 255,255)";


		var t = Math.random() * 1000;
		var tn = 0;
		var n = 8;

		// Loop
		(function loop() {

// 			context.globalCompositeOperation = "source-over";
			// Clear top
			context.fillStyle = "rgba(0, 0, 0,0.005)";
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.globalCompositeOperation = "lighter";


			context.save();
			context.translate(0, canvas.height/2);
			var points = [];
			var pointCount = 8;
			var rise = 400;
			var lineWidth = canvas.width;
			points[ 0 ] = {x: canvas.width+100, y:0};
			for ( var i = 1; i < pointCount; i++ ) {
				var noise = CanvasPS3.noise( i * 0.3 + tn, t, t*0.2);
				var nX = lineWidth-(i/pointCount * lineWidth);
				var nY = noise * rise - (rise*0.5) + 200;
				points[ i ] = { x: Math.floor(nX), y: Math.floor(nY) };
			}
			points[ i ] = {x: -100, y:0};

			var spline = new Spline();
			var position = spline.get2DPoint( points, 0);
			var oldPosition = points[0];
			var smoothing = 8;
			var previousMidpoint = null;
			

			for(i = 0; i < pointCount*smoothing; ++i) {
				var hsv = CanvasPS3.HSVRGB((t*360*0.5) % 360, 50, 100);
				position = spline.get2DPoint( points, i/(pointCount*smoothing) );
				
				// context.moveTo( oldPosition.x, oldPosition.y );
				//context.lineTo( position.x, position.y );
				// Midpoint
				var point = {x:oldPosition.x + (position.x - oldPosition.x) * .5,
							y: oldPosition.y + (position.y - oldPosition.y) * .5};

			
				context.strokeStyle = "rgba(" + hsv[0] + "," + hsv[1] +"," + hsv[2] + "," + 0.1 + ")";
				context.beginPath();
				var oldPosition = oldPosition,
					position = position;

				// Midpoint
				var midpoint = {x:oldPosition.x + (position.x - oldPosition.x) * .5,
							y: oldPosition.y + (position.y - oldPosition.y) * .5};


				/**
				 * Draw a quadratic bezier curve to the next point in the path
				 */
				if(previousMidpoint) // All except the first one
 				{
 					context.moveTo(previousMidpoint.x, previousMidpoint.y);
 					context.quadraticCurveTo(oldPosition.x, oldPosition.y,midpoint.x, midpoint.y);
 				} else {
 					context.moveTo(oldPosition.x, oldPosition.y);
 					context.lineTo(midpoint.x, midpoint.y);
 				}
				context.closePath();
				context.stroke();
				
				previousMidpoint = midpoint;
				oldPosition.x = position.x;
				oldPosition.y = position.y;
			}
			context.restore();
			t += 0.005;
			tn += 0.01;
			// Loop
			window.requestAnimationFrame( loop, null );
		})();
	};

	function Spline() {

		var c = [], v2 = { x: 0, y: 0 },
		point, intPoint, weight;

		this.get2DPoint = function ( points, k ) {

			point = ( points.length - 1 ) * k;
			intPoint = Math.floor( point );
			weight = point - intPoint;

			c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
			c[ 1 ] = intPoint;
			c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
			c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

			v2.x = interpolate( points[ c[ 0 ] ].x, points[ c[ 1 ] ].x, points[ c[ 2 ] ].x, points[ c[ 3 ] ].x, weight );
			v2.y = interpolate( points[ c[ 0 ] ].y, points[ c[ 1 ] ].y, points[ c[ 2 ] ].y, points[ c[ 3 ] ].y, weight );
			
		
			return v2;
		}

		// Catmull-Rom

		function interpolate( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5;
			var v1 = ( p3 - p1 ) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

	// http://mrl.nyu.edu/~perlin/noise/
	(function(){
		var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
			 23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
			 174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
			 133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
			 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
			 202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
			 248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
			 178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
			 14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
			 93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

		for (var i=0; i < 256 ; i++) {

			p[256+i] = p[i];

		}

		function fade(t) {

			return t * t * t * (t * (t * 6 - 15) + 10);

		}

		function lerp(t, a, b) {

			return a + t * (b - a);

		}

		function grad(hash, x, y, z) {

			var h = hash & 15;
			var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
			return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

		}

		// Retrieve the namespace
		CanvasPS3.noise  = function (x, y, z) {

			var floorX = ~~x, floorY = ~~y, floorZ = ~~z;

			var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

			x -= floorX;
			y -= floorY;
			z -= floorZ;

			var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;

			var u = fade(x), v = fade(y), w = fade(z);

			var A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

			return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
							grad(p[BA], xMinus1, y, z)),
						lerp(u, grad(p[AB], x, yMinus1, z),
							grad(p[BB], xMinus1, yMinus1, z))),
					lerp(v, lerp(u, grad(p[AA+1], x, y, zMinus1),
							grad(p[BA+1], xMinus1, y, z-1)),
						lerp(u, grad(p[AB+1], x, yMinus1, zMinus1),
							grad(p[BB+1], xMinus1, yMinus1, zMinus1))));

		};

		CanvasPS3.HSVRGB = function(h, s, v)
		{
			var r, g, b;
			var i;
			var f, p, q, t;

			// Make sure our arguments stay in-range
			h = Math.max(0, Math.min(360, h));
			s = Math.max(0, Math.min(100, s));
			v = Math.max(0, Math.min(100, v));

			// We accept saturation and value arguments from 0 to 100 because that's
			// how Photoshop represents those values. Internally, however, the
			// saturation and value are calculated from a range of 0 to 1. We make
			// That conversion here.
			s /= 100;
			v /= 100;

			if(s == 0) {
				// Achromatic (grey)
				r = g = b = v;
				return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
			}

			h /= 60; // sector 0 to 5
			i = Math.floor(h);
			f = h - i; // factorial part of h
			p = v * (1 - s);
			q = v * (1 - s * f);
			t = v * (1 - s * (1 - f));

			switch(i) {
				case 0:
					r = v;
					g = t;
					b = p;
					break;

				case 1:
					r = q;
					g = v;
					b = p;
					break;

				case 2:
					r = p;
					g = v;
					b = t;
					break;

				case 3:
					r = p;
					g = q;
					b = v;
					break;

				case 4:
					r = t;
					g = p;
					b = v;
					break;

				default: // case 5:
					r = v;
					g = p;
					b = q;
			}

			return [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
		}
	})();


	window.addEventListener('DOMContentLoaded', onLoad, true);

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

}
}());