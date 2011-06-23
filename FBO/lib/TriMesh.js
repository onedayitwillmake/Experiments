(function(){
    ZOA.namespace("ZOA");

    ZOA.TriMesh = function() {
         this.clear();
    };

    ZOA.TriMesh.prototype = {
        vertices      : [],
        normals       : [],
        colorsRGB     : [],
        colorsRGBA    : [],
        texCoords     : [],
        indices       : [],

		//////////
		// VERTICES
		//////////
        appendVertex: function( vertex ) {
            this.vertices.push(vertex.x, vertex.y, vertex.z);
        },
        appendVertexXYZ: function( x, y, z ) {

            this.vertices.push(x, y, z);
        },
        appendVertices: function( v ) {
            var len = v.length;
            for(; v < len; ++v ) {
                this.vertices.push(v.x, v.y, v.z);
            }
        },
        getVertices: function() { return this.vertices; },
        getNumVertices: function() { return this.vertices.length; },

		//////////
		// NORMALS
		//////////
		appendNormal: function( n ) {
			this.normals.push(n.x, n.y, n.z);
		},
        appendNormalXYZ: function( x, y, z ) {
			this.normals.push( x, y, z);
		},
        appendNormals: function( normalArr ) {
            var len = normalArr.length;
            for( var i = 0; i < len; ++i ) {
				this.normals.push(normalArr[i].x, normalArr[i].y, normalArr[i].z);
            }
        },
		getNormals: function(){ return this.normals; },

		//////////
		// COLORRGB
		//////////
        appendColorRGBA: function( r, g, b, a ) {
            this.colorsRGBA.push(r, g, b, a);
        },
        getColorsRGBA: function() { return this.colorsRGBA; },

		//////////
		// UV
		//////////
		appendTexCoords: function( u,v ) {
			this.texCoords.push(u, v);
		},
		getTexCoords: function() { return this.texCoords; },

		//////////
		// TRIANGLES
		//////////
        appendTriangle: function( A, B, C) {
            this.indices.push(A, B, C);
        },
        getNumIndices: function() { return this.indices.length; },
        getIndices: function(){ return this.indices; },

        clear: function() {
            this.vertices = [];
            this.normals = [];
            this.colorsRGB = [];
            this.colorsRGBA = [];
            this.texCoords = [];
            this.indices = [];
        }
    }
})();
