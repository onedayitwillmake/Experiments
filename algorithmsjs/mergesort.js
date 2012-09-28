
/*
Array.prototype.mergesort =  function(){
	var tempArray = [];
	this._mergesort( tempArray, 0, this.length -  1 );
	return this;
}
Array.prototype._mergesort = function( tempArray, lowerBound, upperBound ) {
	if( lowerBound == upperBound )	
		return;


	var mid = Math.floor( (lowerBound + upperBound) / 2 );


	this._mergesort( tempArray, lowerBound, mid );
	this._mergesort( tempArray, mid+1, upperBound);
	this._merge( tempArray, lowerBound, mid+1, upperBound );
}
Array.prototype._merge = function( tempArray, low, mid, upper ) {
	var tempLow = low;
	var tempMid = mid - 1;
	var index = 0;

	while( low <= tempMid && mid <= upper ) {
		if(this[low] < this[mid] ) {
			tempArray[index++] = this[low++];
		} else {
			tempArray[index++] = this[mid++]
		}
	}

	while( low <= tempMid ) {
		tempArray[index++] = this[low++];
	}

	while( mid <= upper ) {
		tempArray[index++] = this[mid++];
	}

	for( var i = 0; i < upper - tempLow + 1; i++) {
		this[tempLow+i] = tempArray[i];
	}
}

var mergesort = function( array ) {
	var tempArray = [];
	_mergesort( array, tempArray, 0, array.length - 1 );
	return array;
}

function _mergesort( array, tempArray, lowerBound, upperBound ) {
	if( lowerBound == upperBound ) return;
	var mid = Math.floor( (lowerBound + upperBound) / 2 );
	_mergesort( array, tempArray, lowerBound, mid );
	_mergesort( array, tempArray, mid+1, upperBound );
	_merge( array, tempArray, lowerBound, mid+1, upperBound );
}

function _merge( array, tempArray, lowerBound, mid, upperBound ) {
	var tempLow = lowerBound;
	var tempMid = mid - 1;
	var index = 0;

	while( lowerBound <= tempMid && mid <= upperBound ) {
		if( array[lowerBound] < array[mid] ) {
			tempArray[index++] = array[lowerBound++];
		} else {
			tempArray[index++] = array[mid++];
		}
	}

	while( lowerBound <= tempMid ) {
		tempArray[ index++ ] = array[lowerBound++];
	}

	while( mid <= upperBound ) {
		tempArray[ index++ ] = array[mid++];
	}

	for( var i = 0; i < upperBound - tempLow + 1; i++ ) {
		array[tempLow+i] = tempArray[i];
	}
}
*/

function mergesortSingle( array ) {
	var mid = Math.floor( array.length / 2 );
	var left = array.slice(0, mid);
	var right = array.slice(mid);
	if( left.length > 1 ) left = mergesort( left );
	if( right.length  > 1 ) right = mergesort( right );

	result = [];
	while( left.length && right.length ) {
		if( left[left.length - 1 ] > right[ right.length - 1 ] ) {
			result.push( left.pop() )
		} else {
			result.push( right.pop() );
		}
	}

	result.reverse();
	if( left.length ) return left.concat( result );
	else return right.concat(result);
}

var unsortedA = [];
var unsortedB = [];
for(var i = 0; i < 2000000; ++i) {
	unsortedA.push( Math.round( Math.random() * 2000 ) );
	// unsortedB.push( Math.round( Math.random() * 2000 ) );
}
unsortedB = unsortedA.concat();

var start = Date.now();
unsortedB.sort();
var end = Date.now();
console.log("RegSort = " , end-start );

var start = Date.now();
// unsortedA.mergesort()
unsortedA = mergesort( unsortedA );

var end = Date.now();
console.log("MergeSort = " , end-start);



