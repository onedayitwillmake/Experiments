
public class QuickSort {

	public static void qsort( int[] array, int lo, int hi ) {
		int p;
		if( (hi-lo) > 0 ) {
			p = partition( array, lo, hi );
			qsort( array, lo, p-1 );
			qsort( array, p+1, hi );
		}
	}

	
	public static int partition( int[] array, int lo, int hi ) {
		int i, p, firstHigh;
		
		p = hi;
		firstHigh = lo;
		
		for(i = lo; i < hi; i++ ) {
			if( array[i] < array[p] ) {
				swap( array, i, firstHigh );
				firstHigh++;
			}	
		}
		
		swap( array, p, firstHigh);
		return firstHigh;
	}
	
	public static void swap(int[] array, int i, int j ) {
		int t = array[i];
		array[i] = array[j];
		array[j] = t;
	}
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		int[] numbers = {2, 4, 3, 6, 5};
		QuickSort.qsort(numbers, 0, numbers.length - 1 );
		
		for( int n : numbers ) {
			System.out.println( n );
		}
	}
}
