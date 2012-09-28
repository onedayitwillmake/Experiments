
public class LinkedList {
	private class Node {
		public Object	value;
		public Node		next;
		public Node( Object value, Node next ) {
			this.value = value;
			this.next = next;
		}
	}
	
	/***********/
	Node _head;
	Node _tail;
	int _length;
	
	public LinkedList() {
		
	}
	
	public void insert( Object value ) {
		Node node = new Node( value, null );
		if( this._tail != null ) {
			this._tail.next = node;
			this._tail = node;
		} else {
			this._head = this._tail = node;
		}
	}
	
	public void reverse() {
		Node previous = null;
		Node oldNext = null;
		
		while( this._head != null ) {
			oldNext = this._head.next;
			this._head.next = previous;
			previous = this._head;
			this._head = oldNext;
		}
		
		this._head = previous;
	}
	
	public String toString() {
		String s = "";
		
		Node node = this._head;
		while( node != null ) {
			Node b = node;
			s += b.value.toString() + "->";
			node = b.next;
		}
		
		return s;
	}
	
	/*
	 * insert / remove / head / tail
	 */

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		LinkedList list = new LinkedList();
		
		String[] letters = {"a","b","c","d","e","f"};
		for(String letter : letters ) {
			list.insert( letter );
		}
		
		System.out.println(list);
		list.reverse();
//		list.reverseRecursive( null, null);
		System.out.println( list );
	}

}
