function binarySearch( array, key ) {
	var lo = 0;
	var hi = array.length - 1;
	mid = 0;
	while( lo <= hi ) {
		var mid = lo + Math.floor( (hi-lo) / 2);
		console.log("array[mid]="array[mid);
		if( key < array[mid] ) hi = mid -1;
		else if( key > array[mid] ) lo = mid + 1;
		else return mid;
	}

	return -1;
}


var unsortedA = [];
for(var i = 0; i <= 200000; ++i) {
	unsortedA.push( i);
}

unsortedA.sort();

var start = Date.now();
var key = binarySearch(unsortedA, 3);
var end = Date.now();

console.log("BinarySearch=", end-start, " Found="+key);
