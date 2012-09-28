var STATE_UNDISCOVERED = 0;
var STATE_DISCOVERED = 1;
var STATE_PROCESSED = 2;


function Vertex( id, edges ) {
	this.id = id;
	this.edges = edges;
	this.state = STATE_UNDISCOVERED;
	this.parent = null;
}

var graph = {
				 1: [6, 2, 5],
				 2: [1, 3, 5],
				 3: [2,4],
				 4: [3, 5],
				 5: [1,2,4],
				 6: [1]
			 }

// Create the graph
var vertices = {};
for( var vertexInfo in graph ) {
	var aVertex = new Vertex( vertexInfo, graph[vertexInfo] );
	vertices[vertexInfo] = aVertex;
}


var rootNode = 6;
var goalNode = 3;
var frontier = [ vertices[6] ];
var explored = {};

function bfs() {
	
	while( frontier.length != 0 ) {

		var node = frontier.pop();
		explored[node.id] = node;

		for(var i = 0, len = node.edges.length; i < len; ++i ) {
			var child = vertices[ node.edges[i] ];	
			
			if( frontier.indexOf( child.id ) == -1 && !explored[ child.id ] ) {
				child.parent = node;
				if( child.id == goalNode ) {
					return child;
				}

				frontier.push( child );
			}
		}
	}


	return null;
}


var solution = bfs();
var node = solution;
while( node ) {
	var b  = node;
	node = b.parent;
	;console.log( b.id )
}
//console.log( solution );