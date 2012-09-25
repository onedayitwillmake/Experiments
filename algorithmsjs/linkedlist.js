function LinkedList() {
	this.head = null;
	this.tail = null;
	this.length = 0;
}
LinkedList.prototype.tail = null;
LinkedList.prototype.append = function( node ) {
	if(this.tail) {
		this.tail.next = node;
		this.tail = node;
	} else {
		this.head = this.tail = node;
	}
	this.length++;
}

LinkedList.prototype.reverse = function (){
	var temp = null;
	var prev = null;

	while( this.head ) {
		temp = this.head.next;
		this.head.next = prev;
		prev = this.head;
		this.head = temp;
	}

	this.head = prev;
}

LinkedList.prototype.reverseRecursive = function( head, temp, prev ) {
	temp = this.head.next;
	this.head.next = prev;
	prev = this.head;
	this.head = temp;

	if( this.head ) {
		this.reverseRecursive( this.head, temp, prev )
	} else {
		this.head = prev;
	}
}

LinkedList.prototype.toString = function () {
	var node = this.head;
	var s = "";
	while( node ) {
		var b = node;
		node = b.next;
		s += b.value + "->"
	}
	return s;
}

function ListNode(value, next) {
	this.value = value;
	this.next = next;
}

var letterString = "abcdefg";
var letterArray = letterString.split('');

var linkedList = new LinkedList();
for(var i = 0; i < letterArray.length; i++ ) {
	linkedList.append( new ListNode(letterArray[i], null ) );
}



console.log( linkedList.toString() )
linkedList.reverseRecursive();
console.log("REVERSE!");
console.log( linkedList.toString() )


