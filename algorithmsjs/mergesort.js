
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


var unsortedA = [];
var unsortedB = [];
for(var i = 0; i < 20000000; ++i) {
	unsortedA.push( Math.round( Math.random() * 2000 ) );
	unsortedB.push( Math.round( Math.random() * 2000 ) );
}

var start = Date.now();
unsortedA.mergesort()
var end = Date.now();
console.log("MergeSort = " , end-start );


var start = Date.now();
unsortedB.sort();
var end = Date.now();
console.log("RegSort = " , end-start );
