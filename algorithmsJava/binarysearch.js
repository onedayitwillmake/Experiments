function binarySearch( array, key ) {
	var lo = 0;
	var hi = array.length - 1;
	while( lo <= hi ) {
		var mid = lo + Math.floor( (hi+lo) / 2);
		if( key < array[mid] ) hi = mid -1;
		else if( key > array[mid] ) lo = mid + 1;
		return mid;
	}
}



for(var i = 0; i < 2000000; ++i) {
	unsortedA.push( Math.round( Math.random() * 2000 ) );
}
var start = Date.now();
unsortedA.sor();
var end = Date.now();
