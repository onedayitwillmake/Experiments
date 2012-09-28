import java.util.Arrays;
public class BinarySearch {

    public static int rank( int key, int[] a) {
        int lo = 0;
        int hi = a.length - 1;
        while( lo <= hi ) {
            int mid = lo + (hi-lo)/2;
            if( key < a[mid] ) hi = mid - 1;
            else if( key > a[mid] ) lo = mid + 1;
            else return mid;
        }

        return -1;
    }

    public static int ranks( int key, int[] a ) {
        int lo = 0;
        int hi = a.length - 1;
        int mid = 0;
        boolean found = false;

        while( lo <= hi ) {
            mid = lo + (hi-lo) / 2;
            if( key < a[mid] ) hi = mid - 1;
            else if( key > a[mid] ) lo = mid + 1;
            else {
                found = true;
                break;
            }
        }

        if( found ) {

            int lessThan = 0;
            for(int i = 0; i < mid; ++i )
                if(a[i] != a[mid]) lessThan++;

            return lessThan;
        }

        return -1;
    }

    public static void main( String[] args) {

        int[] whitelist = In.readInts( args[0] );
        Arrays.sort( whitelist );

        int lower = ranks(StdIn.readInt(), whitelist);
        StdOut.println("Lower=" + lower );

//    	 System.out.println( whitelist[0] );
//        while( !StdIn.isEmpty() ) {
//            int key = StdIn.readInt();
//            if( rank(key, whitelist) < 0 ) {
//                StdOut.println( key );
//            }
//        }
    }
}