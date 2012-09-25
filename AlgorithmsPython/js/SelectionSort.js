
var demo = Sketch.create({

    _unsortedArray: [],
    _sortedArray: [],


    // Override props in Sketch
    container: document.getElementById( 'container' ),
    autoclear: true,
    fullscreen: false,
    width: document.getElementById( 'container').offsetWidth,
    height: document.getElementById( 'container').offsetHeight,

	setup: function() {
        window.addEventListener("focus", function(e) {console.log("GAINED");  demo.start(); }, true);
        window.addEventListener("blur", function(e) { console.log("LOST"); demo.stop(); }, true);


        this._unsortedArray = this.shuffle("selectionsort".toUpperCase().split("") ) ;
        this._sortedArray = [];
        this._i = 0;
        this._minIndex = 0;
        this._stepper = 0;
        this._counter = 30;

        this._director= new CAAT.Director() .initialize( this._width, this._height, this.container, null );

        setTimeout(function(){
            var font_baumans = new CAAT.Font().
                setFont('"Play"').
                setFontSize(100,"px").
                setFillStyle( gradient ).
                setStrokeStyle('#bbb').
                setStrokeSize(.5).
                createDefault(2);
        }, 100);


//        var gui = new dat.GUI();
	},

	update: function() {
        if( ++this._stepper % this._counter != 0 ) return;

		var n = this._unsortedArray.length;
        if( this._i < n ) {
            this._minIndex = this._i;
            for(var j = this._i + 1; j < n; ++j ) {
                if( this._unsortedArray[ j ].charCodeAt(0) < this._unsortedArray[this._minIndex].charCodeAt(0) ) {
                    this._minIndex = j;
                }
            }

            // Swap
            var temp = this._unsortedArray[ this._i ];
            this._unsortedArray[ this._i ] = this._unsortedArray[ this._minIndex ];
            this._unsortedArray[ this._minIndex ] = temp;
            this._i++;
        }

//        console.log( this._unsortedArray );
	},

	// Event handlers
	keydown: function() {
		if ( this.keys.C )
			this.clear();
	},

    mousedown: function( e ) {
        var touch = demo.touches[0];
    },

	// Mouse & touch events are merged, so handling touch events by default
	// and powering sketches using the touches array is recommended for easy
	// scalability. If you only need to handle the mouse / desktop browsers,
	// use the 0th touch element and you get wider device support for free.
	touchmove: function( e ) {
	},

    touchend: function( e ) {
    },

	draw: function( ctx ) {
        ctx.font = 'bold 44px Play';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(this._unsortedArray.join(""), 20, 200);
    },

    /**
     *
     * @param o
     * @return {*}
     */
    shuffle: function( o ) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
});

demo.start();