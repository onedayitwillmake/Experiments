// Lots of 'trying out stuff' below, so view at your own peril
(function(){
	var onLoad = function( event ) {
		// Create canvas element
		var canvas = document.createElement('canvas');
		canvas.width = 465;
		canvas.height = 465;
		document.getElementById('container').appendChild( canvas );

		var context = canvas.getContext("2d");
		this._context = context;

		var fluid = new Sketch.Fluid;
		fluid.setCanvas( canvas);
		fluid.pour();

		// Loop
		(function loop() {
			context.clearRect(0, 0, canvas.width, canvas.height);
			fluid.update();
			window.requestAnimationFrame( loop, null );
		})();
	};

	window.addEventListener('DOMContentLoaded', onLoad, true);


	if ( !window.requestAnimationFrame ) {
			window.requestAnimationFrame = ( function() {
			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	})();

}
}());

(function(){
	Sketch = Sketch || {};

///// Fluid
	Sketch.Fluid = function() {
		var size = 465;
		Sketch.Fluid.prototype.INV_GRID_SIZE = 1.0 / (size/Sketch.Fluid.prototype.NUM_GRIDS);

		this._particles = [];
		this._numParticles = 0;
		this._neighbors = [];
		this._numNeighbors = 0;
		this._nighbors = [];
		this._grids = [];

		for(var i = 0; i < Sketch.Fluid.prototype.NUM_GRIDS; ++i) {
			 this._grids[i] = [];
			for(var j = 0; j < Sketch.Fluid.prototype.NUM_GRIDS; ++j) {
				this._grids[i][j] = new Sketch.Grid();
			}
		}

		this._count = 0;
	};

	Sketch.Fluid.prototype = {
		GRAVITY					: 0.05,
		RANGE					: 16,
		RANGE2					: 16*16,
		DENSITY					: 2.5,
		PRESSURE				: 1,
		PRESSURE_NEAR			: 1,
		VISCOSITY				: 0.1,
		NUM_GRIDS				: 29,
		INV_GRID_SIZE			: 0,

		_particles				: [],
		_numParticles			: 0,
		_neighbors				: [],
		_numNeighbors			: 0,
		_count					: 0,
		_grids					: [],

		_press					: false,
		_mouseX					: 100,
		_mouseY					: 100,

		// DRAWING
		_context				: null,
		pour: function() {
			for(var i = -2; i < 2; ++i) {
				var xx = this._mouseX + i * 5;
				this._particles[this._numParticles++] = new Sketch.Particle(xx, this._mouseY, this._count);
				this._particles[this._numParticles - 1].vy = 5;
			}
		},

		update: function() {
			if(this._press)
				this.pour();

			this._count++;
			this.updateGrids();
			this.findNeighbors();
			this.calcForce();

			for(var i = 0; i < this._numParticles; i++) {
				var p = this._particles[i];
				p.update();
				this._context.fillStyle = "rgb(255, 0, 0)";
				this._context.fillRect( p.x, p.y, 10, 10);
			}
		},

		draw: function() {

		},

		updateGrids: function() {
			var i;
            var j;
            for(i = 0; i < Sketch.Fluid.prototype.NUM_GRIDS; i++)
                for(j = 0; j < Sketch.Fluid.prototype.NUM_GRIDS; j++)
                   this._grids[i][j].numParticles = 0;

			for( i = 0; i < this._numParticles; ++i ) {
				var p = this._particles[i];
				p.fx = p.fy = p.density = p.densityNear = 0;
				p.gx = (p.x * Sketch.Fluid.prototype.INV_GRID_SIZE) << 0;
				p.gy = (p.y * Sketch.Fluid.prototype.INV_GRID_SIZE) << 0;

				if(p.gx < 0) p.gx = 0;
				if(p.gy < 0) p.gy = 0;
				if(p.gx > Sketch.Fluid.prototype.NUM_GRIDS - 1) p.gx = Sketch.Fluid.prototype.NUM_GRIDS - 1;
				if(p.gy > Sketch.Fluid.prototype.NUM_GRIDS - 1) p.gy = Sketch.Fluid.prototype.NUM_GRIDS - 1;
			}
		},

		findNeighbors: function() {
			var numNeighbors = 0;
			for(var i = 0; i < this._numParticles; ++i) {
				var p = this._particles[i];
				var xMin = p.gx != 0;
				var xMax = p.gx != Sketch.Fluid.prototype.NUM_GRIDS - 1;
				var yMin = p.gy != 0;
				var yMax = p.gy != Sketch.Fluid.prototype.NUM_GRIDS - 1;


				this.findNeighborsInGrid(p, this._grids[p.gx][p.gy]);
				if(xMin) this.findNeighborsInGrid(p, this._grids[p.gx - 1][p.gy]);
				if(xMax) this.findNeighborsInGrid(p, this._grids[p.gx + 1][p.gy]);
				if(yMin) this.findNeighborsInGrid(p, this._grids[p.gx][p.gy - 1]);
				if(yMax) this.findNeighborsInGrid(p, this._grids[p.gx][p.gy + 1]);
				if(xMin && yMin) this.findNeighborsInGrid(p, this._grids[p.gx - 1][p.gy - 1]);
                if(xMin && yMax) this.findNeighborsInGrid(p, this._grids[p.gx - 1][p.gy + 1]);
                if(xMax && yMin) this.findNeighborsInGrid(p, this._grids[p.gx + 1][p.gy - 1]);
                if(xMax && yMax) this.findNeighborsInGrid(p, this._grids[p.gx + 1][p.gy + 1]);
				this._grids[p.gx][p.gy].add(p);
			}
		},

		findNeighborsInGrid: function( pi, g ) {
			 for(var j = 0; j < g._numParticles; j++) {
                var pj = g._particles[j];
                var distance = (pi.x - pj.x) * (pi.x - pj.x) + (pi.y - pj.y) * (pi.y - pj.y);
                if(distance < Sketch.Fluid.prototype.RANGE2) {
                    if(this._neighbors.length == this._numNeighbors)
                        this._neighbors[this._numNeighbors] = new Sketch.Neighbor();

                    this._neighbors[this._numNeighbors++].setParticle(pi, pj);
                }
            }
		},

		calcForce: function() {
			for(var i =0; i < this._numNeighbors; ++i ) {
				this._neighbors[i].calcForce();
			}
		},

		onMouseDown: function(event) {
			this._press = true;
		},

		onMouseMove: function(e) {
			var x, y;

			// Get the mouse position relative to the canvas element.
			if (e.layerX || e.layerX == 0) { // Firefox
				x = e.layerX;
				y = e.layerY;
			} else if (e.offsetX || e.offsetX == 0) { // Opera
				x = e.offsetX;
				y = e.offsetY;
			}

			this._mouseX = x;
			this._mouseY = y;
		},

		onMouseUp: function(event) {
		   this._press = false;
		},

		setCanvas: function( aCanvas) {
			this._context = aCanvas.getContext("2d");

			var that = this;
			aCanvas.addEventListener('mousedown', function(e) { that.onMouseDown(e) }, false);
			aCanvas.addEventListener('mousemove', function(e) { that.onMouseMove(e) }, false);
			aCanvas.addEventListener('mouseup', function(e) { that.onMouseUp(e) }, false);
		}
	};

///// Particle
	Sketch.Particle = function( x1, y1 ) {
		this.x = x1;
		this.y = y1;
		this.gx = 0;
		this.gy = 0;
		this.vx = 0;
		this.vy = 0;
		this.fx = 0;
		this.fy = 0;
		this.density = 0;
		this.densityNear = 0;
		this.type = 1;
	};

	Sketch.Particle.prototype = {
		update: function() {
			this.vy += Sketch.Fluid.prototype.GRAVITY;
			if(this.density > 0 ) {
				this.vx += this.fx / ( this.density * 0.9 + 0.1 );
				this.vy += this.fy / ( this.density * 0.9 + 0.1 );
			}

			this.x += this.vx;
			this.y += this.vy;

			if(this.x < 5) this.vx += (5-this.x) * 0.5 - this.vx * 0.5;
			if(this.x > 460) this.vx += (460-this.x) * 0.5 - this.vx * 0.5;
			if(this.y < 5) this.vy += (5 - this.y) * 0.5 - this.vy * 0.5;
        	if(this.y > 460) this.vy += (460 - this.y) * 0.5 - this.vy * 0.5;
		}
	};

///// Neighbor
	Sketch.Neighbor = function() {
	};
	Sketch.Neighbor.prototype = {
		p1			: null,
		p2			: null,
		distance	: 0,
		nx			: 0,
		ny			: 0,
		weight		: 0,

		setParticle: function( p1, p2 ) {

			this.p1 = p1;
			this.p2 = p2;
			this.nx = p1.x - p2.x;
			this.ny = p1.y - p2.y;
			this.distance = Math.sqrt(this.nx * this.nx + this.ny * this.ny) + 0.0001;
			this.weight = 1 - this.distance / Sketch.Fluid.prototype.RANGE;

			var density = this.weight * this.weight; // 普通の圧力カーネルは距離の二乗
			p1.density += density;
			p2.density += density;
			density *= this.weight * Sketch.Fluid.prototype.PRESSURE_NEAR; // 粒子が近づきすぎないよう近距離用のカーネルを計算
			p1.densityNear += density;
			p2.densityNear += density;
			var invDistance = 1 / this.distance;
			this.nx *= invDistance;
			this.ny *= invDistance;
		},

		calcForce: function() {
			var p = (this.p1.density + this.p2.density - Sketch.Fluid.prototype.DENSITY * 1.5) * Sketch.Fluid.prototype.PRESSURE;
			var pn = (this.p1.densityNear + this.p2.densityNear) * Sketch.Fluid.prototype.PRESSURE_NEAR; // 基準密度に関係なく近づきすぎたら跳ね返す！
			var pressureWeight = this.weight * (p + this.weight * pn); // 結果としてかかる圧力
			var viscosityWeight = this.weight * Sketch.Fluid.prototype.VISCOSITY;
			var fx = this.nx * pressureWeight;
			var fy= this.ny * pressureWeight;
			fx += (this.p2.vx - this.p1.vx) * viscosityWeight; // 単純に粘性項を解く
			fy += (this.p2.vy - this.p1.vy) * viscosityWeight;
			this.p1.fx += fx;
			this.p1.fy += fy;
			this.p2.fx -= fx;
			this.p2.fy -= fy;
		}
	};

///// Grid
	Sketch.Grid = function() {
		this._particles = [];
		this._numParticles = 0;
	};

	Sketch.Grid.prototype = {
		_particles			: [],
		_numParticles		: 0,

		add: function(p) {
			this._particles[ this._numParticles++ ] = p;
		}
	};
}());