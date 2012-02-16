/*

File: InsideRoom.js
Abstract: Class implementation for InsideRoom plugin.
Version: 1.0

Disclaimer: IMPORTANT:  This Apple software is supplied to you by Apple
Inc. ("Apple") in consideration of your agreement to the following
terms, and your use, installation, modification or redistribution of
this Apple software constitutes acceptance of these terms.  If you do
not agree with these terms, please do not use, install, modify or
redistribute this Apple software.

In consideration of your agreement to abide by the following terms, and
subject to these terms, Apple grants you a personal, non-exclusive
license, under Apple's copyrights in this original Apple software (the
"Apple Software"), to use, reproduce, modify and redistribute the Apple
Software, with or without modifications, in source and/or binary forms;
provided that if you redistribute the Apple Software in its entirety and
without modifications, you must retain this notice and the following
text and disclaimers in all such redistributions of the Apple Software.
Neither the name, trademarks, service marks or logos of Apple Inc. may
be used to endorse or promote products derived from the Apple Software
without specific prior written permission from Apple.  Except as
expressly stated in this notice, no other rights or licenses, express or
implied, are granted by Apple herein, including but not limited to any
patent rights that may be infringed by your derivative works or by other
works in which the Apple Software may be incorporated.

The Apple Software is provided by Apple on an "AS IS" basis.  APPLE
MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE, REGARDING THE APPLE SOFTWARE OR ITS USE AND
OPERATION ALONE OR IN COMBINATION WITH YOUR PRODUCTS.

IN NO EVENT SHALL APPLE BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) ARISING IN ANY WAY OUT OF THE USE, REPRODUCTION,
MODIFICATION AND/OR DISTRIBUTION OF THE APPLE SOFTWARE, HOWEVER CAUSED
AND WHETHER UNDER THEORY OF CONTRACT, TORT (INCLUDING NEGLIGENCE),
STRICT LIABILITY OR OTHERWISE, EVEN IF APPLE HAS BEEN ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

Copyright (C) 2006-2011 Apple Inc. All Rights Reserved.

*/

//= requires View EventTriage

/* ------------------------ InsideRoom ------------------------ */

/**
 *  @name InsideRoom
 *  @class
 *
 *  <p>The room is a 3D object that a user can pan around,
 *    like a Gallery. Tapping twice will toggle the zoom.
 *    Walls are comprised of child views.
 *    Floor and ceiling images can be set separately.</p>
 *
 *  @extends iAd.View
 *  @since iAd Producer 1.0
 *
 *  @param {Element} [layer] The markup representing this view.
 */

iAd.Class({
  name: 'InsideRoom',
  superclass: iAd.View,
  synthesizedProperties: [
    'selectedIndex',
    'cellCount',
    'selectedCell',
    'rotation',
    'scrubSensitivity',
    'initialIndex',
    'visibleCellIndex',
    'friction',
    'isMirroredCells',
    'isWrapAroundEnabled',
    'floorImage',
    'ceilingImage',
    'isZoomedIn'
  ],
  cssClassName: 'inside-room',
  mixins: [iAd.EventTriage]
});

// events
InsideRoom.DID_SELECT_VISIBLE_CELL = 'didSelectVisibleCell';
InsideRoom.synthesizedEvents = [InsideRoom.DID_SELECT_VISIBLE_CELL];

// constants
InsideRoom.HORIZONTAL_ORIENTATION = 'horizontal';
InsideRoom.VERTICAL_ORIENTATION = 'vertical';

/* ------------------------ iAd.View APIs ------------------------ */

InsideRoom.prototype.init = function (layer) {
  // defaults
  this._selectedIndex = -1;
  this._cellCount = 0;
  this._rotation = 0;
  this._initialIndex = 0;
  this._visibleCellIndex = null;
  this._scrubSensitivity = 0.25;
  this._orientation = InsideRoom.HORIZONTAL_ORIENTATION;
  this._isVertical = false;
  this._friction = 0.8;
  this._isWrapAroundEnabled = true;
  this._floorImage = null;
  this._ceilingImage = null;
  this._isZoomedIn = false;
  // store the last two points for velocity computation
  this.trackingPoints = [];
  this.rotationMultiplier = (1 - this._friction) * 17.5;
  this.callSuper(layer);
  // iAd.View property to turn on automatic event handlers
  this.userInteractionEnabled = true;
};

InsideRoom.prototype.setValueForAttribute = function (value, attribute) {
  if (attribute == 'ad-floor-image') {
    if (value) {
      value = new iAd.Image(value, this.layer.hasAttribute('ad-has-hidpi-version'));
    }
    this.floorImage = value;
  } 
  else if (attribute == 'ad-ceiling-image') {
    if (value) {
      value = new iAd.Image(value, this.layer.hasAttribute('ad-has-hidpi-version'));
    }
    this.ceilingImage = value;
  } 
  else {
    this.callSuper(value, attribute);
  }
};

InsideRoom.prototype.setupLayer = function () {
  // before we call super, we need to inject a hosting layer in case it's been omitted
  this.setupChildLayers();
  this.callSuper();
  // determine the number of pages we have
  this._selectedIndex = (this.cellCount > 0 ? 0 : -1);
  // set selectedCell
  if (this.subviews.length) {
    this.selectedCell = this.subviews[this.selectedIndex];
    this.visibleCell = this.selectedCell;
  }
  this.layout();
};

InsideRoom.prototype.layerWasInsertedIntoDocument = function () {
  this.callSuper();
  // move to the initial index
  this.setSelectedIndexAnimated(this.initialIndex, false, null);
};

/**
 *  Adds cells to hosting layer
 *  @private
 */
InsideRoom.prototype.setupChildLayers = function () {
  // first make sure we have a hosting layer
  this._hostingLayer = this.layer.querySelector('.ad-hosting-layer');
  if (this._hostingLayer === null) {
    this._hostingLayer = document.createElement('div');
    this._hostingLayer.addClassName('ad-hosting-layer');
    // move children into hosting layer  
    var childrenLayer = this.layer,
        childNode;
    while (childNode = childrenLayer.firstElementChild) {
      this._hostingLayer.appendChild(childNode);
    }
    this.layer.appendChild(this._hostingLayer);
  }
  this._hostingLayer.addEventListener('webkitTransitionEnd', this, false);
  // create floor
  this._floor = this.layer.querySelector('.inside-room-floor');
  if (!this._floor) {
    this._floor = document.createElement('div');
    this._floor.addClassName('inside-room-floor');
    this._hostingLayer.appendChild(this._floor);
  }
  // create ceiling
  this._ceiling = this.layer.querySelector('.inside-room-ceiling');
  if (!this._ceiling) {
    this._ceiling = document.createElement('div');
    this._ceiling.addClassName('inside-room-ceiling');
    this._hostingLayer.appendChild(this._ceiling);
  }
};

/**
 *  Sizes and positions hosting layer and cells
 *  @private
 */
InsideRoom.prototype.layout = function () {
  // size the hosting layer
  var computedStyle = window.getComputedStyle(this.layer);
  this.layerSize = new iAd.Size(parseInt(computedStyle.width, 10), parseInt(computedStyle.height, 10));
  var theta = Math.PI / this.cellCount;
  this.radius = this.layerSize.width / 2;
  // size the cells
  var cell, angle,
      cellWidth = Math.round(Math.tan(theta) * this.radius) * 2,
      cellSize = new iAd.Size(cellWidth, this.layerSize.height),
      cellX = iAd.Utils.px((this.layerSize.width - cellWidth) / 2);
  for (var i = 0, count = this.cellCount; i < count; i++) {
    cell = this.subviews[i];
    cell.size = cellSize;
    cell.layer.style.left = cellX;
    // rotate in 3d space
    angle = i * (360 / count) * -1;
    cell.layer.style.webkitTransform = 'rotateY(' + angle + 'deg) ' + iAd.Utils.t3d(0, 0, -this.radius);
  }
  this.layer.style.webkitPerspective = Math.round(this.radius * 3);
  // size and position ceiling and floor
  var capSize = this.radius * 2,
      capSizePx = iAd.Utils.px(capSize),
      capX = iAd.Utils.px(-(capSize - this.layerSize.width) / 2),
      capY = iAd.Utils.px(-capSize / 2);
  this._floor.style.width = capSizePx;
  this._ceiling.style.width = capSizePx;
  this._floor.style.height = capSizePx;
  this._ceiling.style.height = capSizePx;
  this._floor.style.left = capX;
  this._ceiling.style.left = capX;
  this._floor.style.bottom = capY;
  this._ceiling.style.top = capY;
  this.positionHostingLayer();
};

/**
 *  Positions hosting layer
 *  @private
 */
InsideRoom.prototype.positionHostingLayer = function () {
  var cameraZ = this.isZoomedIn ? this.radius : 0;
  this._hostingLayer.style.webkitTransform = iAd.Utils.t3d(0, 0, cameraZ) + ' rotateY(' + -this.rotation + 'deg)';
};

/* ------------------------ Synthesized APIs ------------------------ */

/**
 *  @name InsideRoom.prototype
 *  @property {iAd.View} cell The cell to be used for the wall in front.
 *  @property {int} aRotation The rotation of the room.
 *  @property {image} fImage The image for the floor pattern.
 *  @property {image} cImage The image for the ceiling pattern.
 *  @property {boolean} isZoomed The zoom of the view. Either walls are displayed at 100% size, or from further away.
 */

InsideRoom.prototype.setSelectedCell = function (cell) {
  if (this.selectedCell) {
    this.selectedCell.layer.removeClassName('ad-selected-cell');
  }
  this._selectedCell = cell;
  this.selectedCell.layer.addClassName('ad-selected-cell');
};

/**
 *  @name InsideRoom.prototype
 *  @returns {integer} The number of cells in the gallery view.
 */
InsideRoom.prototype.getCellCount = function () {
  return this.subviews.length;
};


InsideRoom.prototype.setRotation = function (aRotation) {
  // do nothing if we have a bad value
  if (isNaN(aRotation)) {
    return;
  }
  this._rotation = aRotation;
  this.positionHostingLayer();
};

InsideRoom.prototype.setFloorImage = function (fImage) {
  this.updatePanelImage(fImage, 'floor');
};

InsideRoom.prototype.setCeilingImage = function (cImage) {
  this.updatePanelImage(cImage, 'ceiling');
};

InsideRoom.prototype.setIsZoomedIn = function (isZoomed) {
  if (isZoomed === this.isZoomedIn) {
    return;
  }
  this._isZoomedIn = isZoomed;
  this.enableHostingLayerTransition();
  this.positionHostingLayer();
};


/* ------------------------ Private Methods ------------------------ */

/**
 *  @returns {Number} angle between point and component's center
 *  @private
 */
InsideRoom.prototype.getAngleFromPoint = function (point) {
  var axis = this.isVertical ? 'y' : 'x';
  return Math.acos((point[axis] - this.radius) / this.radius);
};

/**
 *  Changes the image of the ceiling or floor
 *  @param {image} value New panel image
 *  @param {string} panelName Either 'floor' or 'ceiling'
 *  @private
 */
InsideRoom.prototype.updatePanelImage = function(value, panelName) {
  var _panelImage = '_' + panelName + 'Image',
      _updatePanel = '_update' + panelName.charAt(0).toUpperCase() + panelName.substr(1);
  if (value !== this[_panelImage]) {
    this['_' + panelName].style.backgroundImage = '';
    this[_panelImage] = value;
    // update the HTML when the ceiling image is ready:
    if (!value || value.loaded) {
      this[_updatePanel]();
    }
    else {
      value.addPropertyObserver('loaded', this, _updatePanel);
    }
  }
};

/**
 *  Changes floor image
 *  @private
 */
InsideRoom.prototype._updateFloor = function () {
  var url = '';
  if (this.floorImage) {
    url = 'url(' + this.floorImage.resolvedURL + ')';
  }
  this._floor.style.backgroundImage = url;
};

/**
 *  Changes ceiling image
 *  @private
 */
InsideRoom.prototype._updateCeiling = function () {
  var url = '';
  if (this.ceilingImage) {
    url = 'url(' + this.ceilingImage.resolvedURL + ')';
  }
  this._ceiling.style.backgroundImage = url;
};

/* ------------------------ Cell API ------------------------ */

InsideRoom.prototype.getChildAtIndexPath = function (indexPath) {
  var index = indexPath.indexAtPosition ? indexPath.indexAtPosition(0) : indexPath[0];
  return this.subviews[index];
};

InsideRoom.prototype.createChildAtIndexPath = function (indexPath) {
  var index = indexPath.indexAtPosition ? indexPath.indexAtPosition(0) : indexPath[0];
  // Each page is just an iAd.View
  var child = new iAd.View();
  this.insertChildAtIndexPath(child, indexPath);
  return child;
};

/**
 *  Adds view to component to child cells at index
 *  @param {iAd.View} child
 *  @param {boolean} animated Animates insertion
 *  @param {function} callback Function to be executed after insertion
 *  @private
 */
InsideRoom.prototype.insertChildAtIndexPath = function (child, indexPath, callback) {
  var index = indexPath.indexAtPosition ? indexPath.indexAtPosition(0) : indexPath[0];
  if (callback) {
    this._insertChildCallback = callback;
  }
  // Add the DOM Node
  if (index >= this.cellCount) {
    this._hostingLayer.appendChild(child.layer);
  }
  else {
    this._hostingLayer.insertBefore(child.layer, this.getChildAtIndexPath([index]).layer);
  }
  // Add to subviews
  this.subviews.splice(index, 0, child);
  this.syncViewsToContent();
};

/**
 *  Removes child cell
 *  @param {boolean} animated Animates removal
 *  @param {function} callback Function to be executed after removal
 *  @private
 */
InsideRoom.prototype.removeChildAtIndexPath = function (indexPath, animated, callback) {
  var index = indexPath.indexAtPosition ? indexPath.indexAtPosition(0) : indexPath[0];
  if (callback) {
    this._animationCallback = callback;
  }
  if (index >= 0 && index < this.cellCount) {
    var child = this.subviews.splice(index, 1)[0];
    // Ensure the child hasn't already been removed from the DOM
    if (child.layer && child.layer.parentNode) {
      this._hostingLayer.removeChild(child.layer);
    }
    this._selectedIndex = index;
    this.syncViewsToContent();
  }
};

InsideRoom.prototype.setSelectedIndex = function (index, callback) {
  this.setSelectedIndexAnimated(index, false, callback);
};

/**
 *  Sets selected index to show cell with animation
 *  @param {integer} index
 *  @param {boolean} animated Animates the selection
 *  @param {function} callback Function to be executed after cell is selected
 */
InsideRoom.prototype.setSelectedIndexAnimated = function (index, animated, callback) {
  this._selectedIndex = index;
  this.selectedCell = this.subviews[index];
  if (callback) {
    this._animationCallback = callback;
  }
  this.rotation = index * (360 / this.cellCount) * -1 - 360;
};

/**
 *  Updates layout and selects cell
 *  @param {integer} index
 *  @param {boolean} animated Animates the selection
 *  @param {function} callback Function to be executed after cell is selected
 */
InsideRoom.prototype.syncViewsToContent = function () {
  this.layout();
  this.setSelectedIndex(this.selectedIndex);
};

/**
 *  Sets size of component
 *  @param {iAd.Size} aSize
 */
InsideRoom.prototype.setSize = function (aSize) {
  // resize
  this.callSuper(aSize);
  this.layout();
};

/* ------------------------ Event Handling ------------------------ */

InsideRoom.prototype.touchesBegan = function (event) {
  // do not do anything if we've fired the default ADView event handler
  if ((event.touches && event.touches.length > 1)) {
    return;
  }
  //
  this.callSuper(event);
  //
  // track base information about this interaction
  this.startRotation = this.rotation;
  this.startTouchPosition = iAd.Point.fromEventInElement(event, this.layer);
  this.startAngle = this.getAngleFromPoint(this.startTouchPosition);
  // for tracking taps
  this.touchDate = new Date();
  this.isTouchUnmoved = true;
  // set up default values for flags
  this.trackingMoved = false;
  // set up array to track interaction positions
  this.trackingPoints = [];
  this.storeEventLocation(this.startTouchPosition);
};


InsideRoom.prototype.touchesMoved = function (event) {
  this.callSuper(event);
  // we actually moved our finger, useful to track selections
  var touchPosition = iAd.Point.fromEventInElement(event, this.layer);
  this.storeEventLocation(touchPosition);
  this.trackingMoved = true;
  var angleDelta = this.startAngle - this.getAngleFromPoint(touchPosition);
  if (this.isTouchUnmoved && (
      Math.abs(touchPosition.x - this.startTouchPosition.x) > 5 ||
      Math.abs(touchPosition.y - this.startTouchPosition.y) > 5
    )
  ) {
    this.isTouchUnmoved = false;
  }
  // update the rotation angle
  if (!isNaN(angleDelta)) {
    this.rotation = this.startRotation + iAd.Utils.radiansToDegrees(angleDelta);
  }
};


InsideRoom.prototype.touchesEnded = function (event) {
  this.callSuper(event);
  //
  this.startAnimating();
  //
  if (this.isTouchUnmoved) {
    var now = new Date();
    if (now - this.touchDate < 400) {
      this.tap(now);
    }
  }
};

/**
 *  Tracks taps - when user touches down, then releases quickly
 *  @param {Date} now The current time
 *  @private
 */
InsideRoom.prototype.tap = function(now) {
  if (this.singleTapTime) {
    if (now - this.singleTapTime < 470
      // second tap should be in the same area
      && Math.abs(this.singleTouchPosition.x - this.startTouchPosition.x) < 40
      && Math.abs(this.singleTouchPosition.y - this.startTouchPosition.y) < 40
    ) {
      this.doubletap();
    } else
    { // too slow for double tap, reset single tap time
      this.singleTouchPosition = this.startTouchPosition;
      this.singleTapTime = now;
    }
  } else {
    // first tap or after double tap
    // set new single tap
    this.singleTouchPosition = this.startTouchPosition;
    this.singleTapTime = now;
  }
  
};

/**
 *  Two quick taps, which toggles isZoomedIn
 *  @private
 */
InsideRoom.prototype.doubletap = function() {
  this.singleTapTime = null;
  this.isZoomedIn = !this.isZoomedIn;
};

/* -------------------------- Animation -------------------------- */

/**
 *  Triggers animation after touch ended
 *  @private
 */
InsideRoom.prototype.startAnimating = function () {
  // get the first interesting index
  var firstIndex = -1;
  for (var i = this.trackingPoints.length - 1; i > 0; --i) {
    // XXX also check max y bounds
    if (this.trackingPoints[i].pos !== 0) {
      firstIndex = i - 1;
      break;
    }
  }
  // do nothing if we have no useful data to process
  if (firstIndex < 0) {
    return false;
  }
  // otherwise keep going
  var secondIndex = firstIndex + 1;
  // the last item is the touchend event, we just want to look at its date
  var releaseDelay = this.trackingPoints[secondIndex].date - this.trackingPoints[firstIndex].date;
  var delta = (this.trackingPoints[secondIndex].pos - this.trackingPoints[firstIndex].pos);
  // do nothing if the interaction delta is too small or the interaction was too slow
  if (Math.abs(delta) < 3.5 || releaseDelay > 120) {
    this.snapToCell(this.rotation);
    return false;
  }
  // get the interaction angle delta
  var angleDelta = Math.atan(delta / this.radius),
      totalAngle = angleDelta * 360 * this.rotationMultiplier;

  // track the rotation before the animation started
  this.rotationBeforeAnimation = this.rotation;
  // set the rotation for when the animation completes so that the animation seems to have freeze fill
  this.animationAngle = totalAngle * this.scrubSensitivity;
  //
  this.snapToCell(this.rotationBeforeAnimation + this.animationAngle);
  //
  return true;
};

/**
 *  Given an angle, sets the rotation to the nearest cell
 *  @param {Number} angle
 *  @private
 */
InsideRoom.prototype.snapToCell = function(angle) {
  // enable transition
  this.enableHostingLayerTransition();
  var cellAngle = 360 / this.cellCount;
  this.rotation = (Math.round( angle / cellAngle)) * cellAngle;
};

/**
 *  keeps track of touch points
 *  @param {iAd.Point} aPoint
 *  @private
 */
InsideRoom.prototype.storeEventLocation = function (aPoint) {
  var point = { pos : (this.isVertical ? aPoint.y : aPoint.x), date : new Date() };
  // push the new one
  this.trackingPoints.push(point);
  // dump the old
  if (this.trackingPoints.length > 10) {
    this.trackingPoints.shift();
  }
};

InsideRoom.prototype.enableHostingLayerTransition = function() {
  this._transitionsNeedRemoval = true;
  this._hostingLayer.style.webkitTransitionDuration = iAd.ScrollView.PAGING_TRANSITION_DURATION;
};

/* -------------------------- Event Handling -------------------------- */

InsideRoom.prototype.handleWebkitTransitionEnd = function(event) {
  if (this._animationCallback) {
    // NOTE: it is critical that we clear _animationCallback *before* we call the callback method; otherwise, calling the callback
    // may itself trigger a new callback, which may need to be assigned to _animationCallback (whew!)
    var callback = this._animationCallback;
    delete this._animationCallback;
    
    this._animationCallback = null;
    callback();
  }
  if (this._transitionsNeedRemoval) {
    this._hostingLayer.style.webkitTransitionDuration = 0;
    this._transitionsNeedRemoval = false;
  }
};