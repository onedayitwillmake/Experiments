var alphabet = "abcdefghijklmnopqrstuvwxyz"
for( var i = 0; i < 20; ++i ) {
	alphabet += alphabet;
}

console.log(alphabet.length);
function reverse( aString ) {
	var newString = "";
	for(var i = aString.length - 1; i >= 0; --i) {
		newString += aString[i];
	}

	return newString;
}

var start = Date.now();
reverse( alphabet );
var end = Date.now();
console.log( (end - start) + "ms");