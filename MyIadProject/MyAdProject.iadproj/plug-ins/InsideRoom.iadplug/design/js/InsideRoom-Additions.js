
InsideRoom.prototype.setIsPushed = function (pushed) {
  this._isPushed = !!pushed;
  this.layer.toggleClassName('is-pushed');

  this.isZoomedIn = this.isPushed;
  this.positionHostingLayer();
};

InsideRoom.prototype.setEditorDropRingVisible = function (editorDropRingVisible) {  
  if (this._editorDropRingVisible == editorDropRingVisible) {
    return;
  }
  this._editorDropRingVisible = editorDropRingVisible;
  
  // don't highlight the entire paging view; just the cells
  for (var i = 0; i < this.subviews.length; i++) {
    var subview = this.subviews[i];
    subview.editorDropRingVisible = editorDropRingVisible;
  }
};


(function () {
  
  iAd.Class.processMethod(InsideRoom, 'setHasBeenEdited');
  InsideRoom.prototype.setHasBeenEdited = function (value) {
    /* overridden */
    return;
  };
  
  
})();