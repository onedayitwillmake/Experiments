/**
 * Good basic starting point for a THREE.JS sketch
 */
(function(){
	var Sketch = function(){
		this.onBeforeStart();
	};

	var projector = new THREE.Projector();
	var mouse = new THREE.Vector2();
	Sketch.prototype.onBeforeStart = function() {
		var that = this;
		var onContentLoaded = function(){
			window.removeEventListener('DOMContentLoaded', onContentLoaded);
			that.onLoaded();
		};
		window.addEventListener('DOMContentLoaded', onContentLoaded, true);
		window.addEventListener('mousemove', function(event) {
			event.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		}, true);
	};



	Sketch.prototype.onLoaded = function() {
		var width = window.innerWidth - 10;
		var height = window.innerHeight - 10;

		this._domElement = document.getElementById("threecontainer");
		this._domElement.style.width = width + "px";
		this._domElement.style.height = height  + "px";
		this._scene = new THREE.Scene();

		this._renderer = new THREE.WebGLRenderer({antialias: true});

		this._renderer.autoClear = false;
		this._renderer.sortObjects = true;
		this._renderer.setClearColor(new THREE.Color(0x0), 1);
		this._renderer.setSize( width, height );
		this._renderer.domElement.tabIndex = "1";
		this._domElement.appendChild(this._renderer.domElement);

		this._camera = new THREE.Camera( 65, width/height, 1, 5000 );
		this._camera.position.y = 0;
		this._camera.position.z = 1000;

		this._ambientLight = new THREE.AmbientLight(0x111111);
		this._scene.addLight(this._ambientLight);

		//this._pointLight = new THREE.PointLight(0xFFFFFF, 0.5, 0);
		//this._pointLight.position.set(0, 0, 1000);
		//this._scene.addLight(this._pointLight);

		this.setupStats();

		var geometry = new THREE.CubeGeometry( 5, 5, 5, 2, 2, 2 );
		this._cube = new THREE.Mesh( geometry, [new THREE.MeshLambertMaterial( {
			color: 0xFF0000,
			shading: THREE.SmoothShading,

		})] );
		this._cube.position.set(0, 0,0);

		//this._scene.addObject( this._cube );



		this.geometry = new THREE.Geometry();
		this.createRibbonGeometry();

		var that = this;
		(function loop() {
			that.update();
			that.render();
			window.requestAnimationFrame(loop);
		})();

		//
		//this.update();
	};

	Sketch.prototype.createRibbonGeometry = function(){
		var i = 0, x = 0, y = 0, z = 0;
		var h = 0;
		var vector = null;
		var geometry = new THREE.Geometry();
		var color = null;




		this._geometry = new THREE.PlaneGeometry(1, 1, 1, 25);
		this._geometry.dynamic = true;

		this._mesh = new THREE.Mesh(this._geometry, [new THREE.MeshLambertMaterial({
					color: 0xFF0000,
					shading: THREE.SmoothShading,
					blending: THREE.AdditiveBlending,
					//wireframe: true,
					map: THREE.ImageUtils.loadTexture("texture.png")
				})]);

		this._mesh.doubleSided = true;
		this._mesh.position.set(0, 0,0);

		this._scene.addChild( this._mesh );
	};

	Sketch.prototype.createQuad = function(){
		var a = new THREE.Vector3(0, 0, 0);
		var b = new THREE.Vector3(0, 0, 0);
		var c = new THREE.Vector3(0, 0, 0);
		var d = new THREE.Vector3(0, 0, 0);
		var s = new Quad(
				a.x, a.y, a.z,
				b.x, b.y, b.z,
				c.x, c.y, c.z,
				d.x, d.y, d.z
		);
	},

	/**
	 * Creates a Stats.js instance and adds it to the page
	 */
	Sketch.prototype.setupStats = function() {
		var container = document.createElement('div');
		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '5px';
		this.stats.domElement.style.left= '5px';
		container.appendChild(this.stats.domElement);
		document.body.appendChild(container);
	};

	Sketch.prototype.update = function() {


		var vector = new THREE.Vector3( mouse.x, mouse.y, (mouse.y+1)/2 );
		projector.unprojectVector( vector, this._camera );
		//console.log(vector.x, vector.y, vector.z)

		var len = this._geometry.vertices.length;
		for( var i = 0; i < len; i+=2) {
			if( i === 0 ) {
				var index = 4;
				var range = 0.5;

				var vectorA = vector.clone();
				vectorA.y -= 1;
				this._geometry.vertices[i].position = vectorA.clone();



				var vectorB = vector.clone();
				vectorB.y += 1;
				this._geometry.vertices[i+1].position = vectorB.clone();

				continue;
			}

			for( var n = i; n < i+2; n++ ) {
				var prev = n-2;
				var glide = 0.4;
				this._geometry.vertices[n].position.x -= (this._geometry.vertices[n].position.x - this._geometry.vertices[prev].position.x) * glide;
				this._geometry.vertices[n].position.y -= (this._geometry.vertices[n].position.y - this._geometry.vertices[prev].position.y) * glide;
				this._geometry.vertices[n].position.z -= (this._geometry.vertices[n].position.z - this._geometry.vertices[prev].position.z) * glide;
			}
		}




		this._geometry.__dirtyVertices = true;
		this._geometry.computeFaceNormals();

		this.stats.update();
		this._cube.rotation.y += 0.02;
	};

	Sketch.prototype.render = function() {
		this._renderer.clear();
		this._renderer.render(this._scene, this._camera);
	};




	window.sketchInstance = new Sketch();
})();