/**
 *  A ControlPoint along a curve
 */
window.namespace("Curves");

(function(){
    Curves.ControlPoint = function(x, y, aRadius ){
        this._radius = aRadius || proto.DEFAULT_RADIUS;
        this._circle = new toxi.geom.Circle(x, y, this._radius );

        this._color = random( proto.COLOURS.concat().splice( 1, proto.COLOURS.length-1 ) );
        this._isDraggable = true;
    };

    Curves.ControlPoint.prototype = {
        DEFAULT_RADIUS: 5,
        COLOURS: [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ],

        // @type {Boolean}
        _isDraggable: true,


    /////
        drag: function( touch ) {
            if( !this._isDraggable ) return;

            this._circle.x = touch.x;
            this._circle.y = touch.y;
        },

        /**
         * @param {CanvasRenderingContext2D} ctx
         */
        draw: function( ctx ){
            ctx.beginPath();
            ctx.arc( this._circle.x, this._circle.y, this._circle.radius.x, 0, TWO_PI );
            ctx.fillStyle = this._color;
            ctx.fill();
        },

    ///// ACCESSORS
        getPosition: function(){ return this._circle; },
        setPosition: function( aPosition ) { this._circle.x = aPosition.x; this._circle.y = aPosition.y },

        getColor: function(){ return this._color; },
        setColor: function( aColor ){ this._color = aColor; },

        getRadius: function(){ return this._radius; },

        containsPoint: function(p){ return this._circle.containsPoint(p); }
    }

    var proto = Curves.ControlPoint.prototype;
})();