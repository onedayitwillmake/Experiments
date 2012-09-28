
var binarySearch = function( key, theArray ) {
	var lo = 0;
	var hi = theArray.length - 1;
	while( lo <= hi ) {
		var mid = Math.floor( lo + (hi-lo) / 2 );
		if( key < theArray[mid] ) hi = mid - 1;
		else if ( key > theArray[mid] ) lo = mid + 1
		else return mid;
	}
}

var theArray = [];
for(var i = 0; i < 100; ++i ) 
	theArray.push( i );

console.log( binarySearch(45, theArray) );



var unsortedA = [];
for(var i = 0; i <= 200000; ++i) {
	unsortedA.push( i);
}

unsortedA.sort();

var start = Date.now();
var key = binarySearch(unsortedA, 3);
var end = Date.now();

console.log("BinarySearch=", end-start, " Found="+key);
