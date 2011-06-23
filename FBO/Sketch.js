/**
 * RibbonPaintCanvas
 * Mario Gonzalez
 * http://ribbonpaint.com
 */
(function(){
	var onLoad = function( event ) {
		var canvas = document.createElement('canvas'); // Create canvas element
		canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
		document.body.insertBefore( canvas, document.getElementById("linklist") );

		var context = canvas.getContext("2d");
		var ribbonPaint = new Sketch.RibbonPaint( canvas );

		// Loop
		(function loop() {
			window.requestAnimationFrame( loop, null );
		})();
	};
	window.addEventListener('DOMContentLoaded', onLoad, true);

}());

(function(){
	Sketch = Sketch || {};
	Sketch.FBOTest = function( aCanvas ) {
	};

	Sketch.FBOTest.prototype = {
	};
}());