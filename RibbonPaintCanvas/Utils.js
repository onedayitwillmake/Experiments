(function(){
	Sketch.Utils = {};
	Sketch.Utils.randRange = function( a, b ) {
		return Math.random()*(b-a) + a;
	}
})();