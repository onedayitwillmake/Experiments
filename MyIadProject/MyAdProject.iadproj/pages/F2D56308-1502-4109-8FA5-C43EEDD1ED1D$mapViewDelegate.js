
this.onDidReceiveResponseData = function (event) {
	
	 var mapElement, collection, nodes, node, annotations, savedValues, len, i;
	
	 mapElement = event.ad.sender.mapElement;
	 collection = event.ad.responseXML.getElementsByTagName('StoreLocations')[0];
	 nodes = collection.childNodes;
	
	 // Check for nodes:
	 if (!nodes) {
		 return;
	 }
	
	 // Collect an array of iAP.MapAnnotations:
	 annotations = [];
	 for (i=0, len = nodes.length; i<len; i+=1) {
	
		 // Use an XML node of type 'Element':
		 node = nodes[i];
		 if (node.nodeType !== 1) {
			 continue;
		 }
		
		 // Collect values with an object:
		 savedValues = {identifier: node.attributes.id.value};
		
		 // Drill into this node's children to collect values:
		 Array.prototype.map.call(node.childNodes, function (subnode) {
			 if (subnode.nodeType !== 1) {
				 return;
			 }
			 if (subnode.childNodes.length === 0) {
				 return;
			 }
			 savedValues[subnode.nodeName] = subnode.childNodes[0].nodeValue;
		 });
		
		 // Derive the address field from the address components:
		 if (savedValues.street && savedValues.city) {
			 savedValues.address = savedValues.street + ' ' + savedValues.city;
			 if (savedValues.state) {
				 savedValues.address += ', ' + savedValues.state;
			 }
			 if (savedValues.zip) {
				 savedValues.address += ' ' + savedValues.zip;
			 }
		 }
		
		 // Add the MapView object's standard values:
		 savedValues.listener = this;
		 savedValues.customPinImage = this.pinImage;
		 savedValues.xOffset = this.pinOffsetX;
		 savedValues.yOffset = this.pinOffsetY;
		
		 // Try to get a title from the name if there isn't one:
		 if (savedValues.name && (!savedValues.title)) {
			 savedValues.title = savedValues.name;
		 }
		 if (savedValues.title != null) {
			 annotations.push(iAP.MapAnnotation(savedValues));
		 }
	 }
	
	 if (annotations.length > 0) {
		 // Add annotations to the map element:
		 mapElement.addAnnotations(annotations);
	 }
	 else {
		 this.zoomToRadius(0.2);
	 }
};

this.onAnnotationCalloutTapped = function (event) {
	
	// Get the annotation:
	var mapView = event.ad.sender;
	var annotation = mapView.mapElement.getAnnotationById(event.ad.annotationId);

	// Provide the detail page with the annotation:
	var detailPage = iAd.ViewController.instances['MapDetail'];
	
	if ( detailPage == null ) {
		alert('Cannot find page named \'MapDetail\'');
		return;
	}

	detailPage.annotation = annotation;

	// Transition to the detail page
	this.viewController.transitionToViewControllerWithID('MapDetail');
};

