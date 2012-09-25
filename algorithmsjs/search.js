var util = require('util');

NODE_STATE_EXPLORED = 0;
NODE_STATE_DISCOVERED = 1;

var graph = {
	"a": ["b", 5, "d", 3],
	"b": ["c", 1],
	"c": ["e", 6, "g", 8],
	"d": ["e", 2, "f", 2],
	"e": ["b", 4],
	"f": ["g", 3],
	"g": ["e", 4]
}

function Node( id, state, parent, action, edges, pathCost ) {
	this.id = id;
	this.state = state;
	this.parent = parent;
	this.action = action;
	this.edges = edges;
	this.pathCost = pathCost;
}

Node.prototype.clone = function() {
	return new Node( this.id, this.state, this.parent, this.action, this.edges, this.pathCost );
}



function Edge( start, end, cost ) {
	this.start = start;
	this.end = end;
	this.cost = cost;
}

allNodes = {};
for( var nodeName in graph ) {
	var nodeInfo = graph[nodeName];

	var edges = [];
	for(var i = 0; i < nodeInfo.length; i+=2) {
		var anEdge = new Edge( nodeName, nodeInfo[i], nodeInfo[i+1] ) ;
		edges.push( anEdge );
	}

	allNodes[nodeName] = new Node( nodeName, null, null, null, edges, 0 );
}


var frontier = [ getNode('c') ];
var explored = {};
var goal = getNode("a");

function ufs() {
	if( frontier.length == 0 ) return null;

	while( node = frontier.pop() ) {

		if(node.id == goal.id) {
			return node;
		}

		// Add to explored
		explored[node.id] = node;

		for(var i = 0, len = node.edges.length; i < len; ++i ) {
			var edgeNode = getNode( node.edges[i].end ).clone();
			edgeNode.parent = node;
			edgeNode.pathCost += edgeNode.parent.pathCost + node.edges[i].cost;
			console.log("Edge=", edgeNode.id, "cost=", edgeNode.pathCost);

			var otherNode = null;
			var found = frontier.some(function( item, index ){ 
				if( item.id == edgeNode.id ) {
					otherNode = item;
					return true;
				}
			})

			if( !found && !explored[edgeNode.id]) {
				frontier.push( edgeNode );
			} else if( found && otherNode.pathCost > edgeNode.parent.pathCost + edgeNode.pathCost ) {
				console.log('replace')
				frontier[ frontier.indexOf( otherNode ) ] = edgeNode;
			}
		}

		// Sort the objects base on path cost
		frontier.sort(function( a, b ){
			if (a.pathCost < b.pathCost) return 1;
			else if (b.pathCost < a.pathCost) return -1;
			else return 0;
		})
	}
}

function getNode( nodeName ) {
	return allNodes[ nodeName ];
}

var solution = ufs();
var node = solution;
while( node ) {
	var b = node;
	node = b.parent;
	console.log( b.id );
}