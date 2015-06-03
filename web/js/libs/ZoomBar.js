/* Copyright (c) 2006-2010 by OpenLayers Contributors (see authors.txt for
* full list of contributors). Published under the Clear BSD license.
* See http://svn.openlayers.org/trunk/openlayers/license.txt for the
* full text of the license. */
/**
* @requires OpenLayers/Control.js
*/
/**
* Class: OpenLayers.Control.ZoomBar
* The ZoomBar control displays a bar for zooming levels in and out. Clicking
* anywhere on the bar computes the new zoom level. The current level is shown
* when hovering over the slider handle.
*
* Inherits from:
* - <OpenLayers.Control>
*/
OpenLayers.Control.ZoomBar = OpenLayers.Class(OpenLayers.Control, {
/**
* APIProperty: minZoom
* {integer} Allows to set the minimal zoom level.
*/
minZoom: 0,
/**
* APIProperty: zoomStopWidth
*/
zoomStopWidth: 18,
/**
* APIProperty: zoomStopHeight
*/
zoomStopHeight: 11,
/**
* Property: slider
*/
slider: null,
/**
* Property: sliderEvents
* {<OpenLayers.Events>}
*/
sliderEvents: null,
/**
* Property: zoombarDiv
* {DOMElement}
*/
zoombarDiv: null,
/**
* Property: divEvents
* {<OpenLayers.Events>}
*/
divEvents: null,
/**
* APIProperty: forceFixedZoomLevel
* {Boolean} Force a fixed zoom level even though the map has
* fractionalZoom
*/
forceFixedZoomLevel: false,
/**
* Property: mouseDragStart
* {<OpenLayers.Pixel>}
*/
mouseDragStart: null,
/**
* Property: zoomStart
* {<OpenLayers.Pixel>}
*/
zoomStart: null,
/**
* Constructor: OpenLayers.Control.ZoomBar
*/
initialize: function() {
OpenLayers.Control.prototype.initialize.apply(this, arguments);
},
/**
* APIMethod: destroy
*/
destroy: function() {
this._removeZoomBar();
this.map.events.un({
"changebaselayer": this.redraw,
scope: this
});
OpenLayers.Control.prototype.destroy.apply(this, arguments);
delete this.mouseDragStart;
delete this.zoomStart;
},
/**
* Method: setMap
*
* Parameters:
* map - {<OpenLayers.Map>}
*/
setMap: function(map) {
OpenLayers.Control.prototype.setMap.apply(this, arguments);
this.map.events.register("changebaselayer", this, this.redraw);
},
/**
* Method: redraw
* clear the div and start over.
*/
redraw: function() {
if (this.div != null) {
this.removeButtons();
this._removeZoomBar();
}
this.draw();
},
/**
* Method: draw
*
* Parameters:
* px - {<OpenLayers.Pixel>}
*/
draw: function(px) {
// initialize our internal div
OpenLayers.Control.prototype.draw.apply(this, arguments);
// place the controls
this.buttons = [];
var sz = new OpenLayers.Size(18,18);
var centered = new OpenLayers.Pixel(0,0);
this._addButton("zoomin", "zoom-plus-mini.png", centered, sz);
centered = this._addZoomBar(centered.add(0, sz.h));
this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
return this.div;
},
/**
* Method: _addZoomBar
*
* Parameters:
* location - {<OpenLayers.Pixel>} where zoombar drawing is to start.
*/
_addZoomBar:function(centered) {
var imgLocation = OpenLayers.Util.getImagesLocation();
var id = this.id + "_" + this.map.id;
var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
var slider = OpenLayers.Util.createAlphaImageDiv(id,
centered.add(-1, zoomsToEnd * this.zoomStopHeight),
new OpenLayers.Size(20,9),
imgLocation+"slider.png",
"absolute");
this.slider = slider;
this.sliderEvents = new OpenLayers.Events(this, slider, null, true,
{includeXY: true});
this.sliderEvents.on({
"mousedown": this.zoomBarDown,
"mousemove": this.zoomBarDrag,
"mouseup": this.zoomBarUp,
"dblclick": this.doubleClick,
"click": this.doubleClick
});
var sz = new OpenLayers.Size();
sz.h = this.zoomStopHeight * Math.max (this.map.getNumZoomLevels()-this.minZoom, 1);
sz.w = this.zoomStopWidth;
var div = null;
if (OpenLayers.Util.alphaHack()) {
var id = this.id + "_" + this.map.id;
div = OpenLayers.Util.createAlphaImageDiv(id, centered,
new OpenLayers.Size(sz.w,
this.zoomStopHeight),
imgLocation + "zoombar.png",
"absolute", null, "crop");
div.style.height = sz.h + "px";
} else {
div = OpenLayers.Util.createDiv(
'OpenLayers_Control_ZoomBar_Zoombar' + this.map.id,
centered,
sz,
imgLocation+"zoombar.png");
}
this.zoombarDiv = div;
for (var i=this.map.getNumZoomLevels()-1; i>=Math.max(this.minZoom,0); --i) {
var h = this.zoomStopHeight * ((this.map.getNumZoomLevels()-1) - i);
this.zoombarDiv.appendChild (this.createElement("Level"+i, "", h));
}
this.divEvents = new OpenLayers.Events(this, div, null, true,
{includeXY: true});
this.divEvents.on({
"mousedown": this.divClick,
"mousemove": this.passEventToSlider,
"dblclick": this.doubleClick,
"click": this.doubleClick
});
this.div.appendChild(div);
this.startTop = parseInt(div.style.top);
this.div.appendChild(slider);
this.map.events.register("zoomend", this, this.moveZoomBar);
centered = centered.add(0,
this.zoomStopHeight * Math.max (this.map.getNumZoomLevels()-this.minZoom, 1));
return centered;
},
/**
* Method: _removeZoomBar
*/
_removeZoomBar: function() {
this.sliderEvents.un({
"mousedown": this.zoomBarDown,
"mousemove": this.zoomBarDrag,
"mouseup": this.zoomBarUp,
"dblclick": this.doubleClick,
"click": this.doubleClick
});
this.sliderEvents.destroy();
this.divEvents.un({
"mousedown": this.divClick,
"mousemove": this.passEventToSlider,
"dblclick": this.doubleClick,
"click": this.doubleClick
});
this.divEvents.destroy();
this.div.removeChild(this.zoombarDiv);
this.zoombarDiv = null;
this.div.removeChild(this.slider);
this.slider = null;
this.map.events.unregister("zoomend", this, this.moveZoomBar);
},
/**
* Method: passEventToSlider
* This function is used to pass events that happen on the div, or the map,
* through to the slider, which then does its moving thing.
*
* Parameters:
* evt - {<OpenLayers.Event>}
*/
passEventToSlider:function(evt) {
this.sliderEvents.handleBrowserEvent(evt);
},
/**
* Method: _addButton
*
* Parameters:
* id - {String}
* img - {String}
* xy - {<OpenLayers.Pixel>}
* sz - {<OpenLayers.Size>}
*
* Returns:
* {DOMElement} A Div (an alphaImageDiv, to be precise) that contains the
* image of the button, and has all the proper event handlers set.
*/
_addButton:function(id, img, xy, sz) {
var imgLocation = OpenLayers.Util.getImagesLocation() + img;
var btn = OpenLayers.Util.createAlphaImageDiv(
this.id + "_" + id,
xy, sz, imgLocation, "absolute");
//we want to add the outer div
this.div.appendChild(btn);
OpenLayers.Event.observe(btn, "mousedown",
OpenLayers.Function.bindAsEventListener(this.buttonDown, btn));
OpenLayers.Event.observe(btn, "dblclick",
OpenLayers.Function.bindAsEventListener(this.doubleClick, btn));
OpenLayers.Event.observe(btn, "click",
OpenLayers.Function.bindAsEventListener(this.doubleClick, btn));
btn.action = id;
btn.map = this.map;
//we want to remember/reference the outer div
this.buttons.push(btn);
return btn;
},
/**
* Method: _removeButton
*
* Parameters:
* btn - {Object}
*/
_removeButton: function(btn) {
OpenLayers.Event.stopObservingElement(btn);
btn.map = null;
this.div.removeChild(btn);
OpenLayers.Util.removeItem(this.buttons, btn);
},
/**
* Method: removeButtons
*/
removeButtons: function() {
for(var i=this.buttons.length-1; i>=0; --i) {
this._removeButton(this.buttons[i]);
}
},
/**
* Method: createElement
* Creates an div element absolutely positioned with hidden overflow and left offset.
*
* Parameters:
* cls - {String} Class name suffix.
* text - {String} Text for child node.
* top - {Float} Top offset.
* width - {Float} Optional width of an element
* height - {Float} Optional height of an element
*
* Returns:
* {Element} An element.
*/
createElement: function(cls, text, top, width, height) {
var element = document.createElement("div");
element.className = this.displayClass + cls;
OpenLayers.Util.extend (element.style, {
fontSize: Math.round ((height? height: this.zoomStopHeight)-2) + "px",
position: "absolute",
textAlign: "center",
overflow: "hidden",
top: Math.round(top) + "px",
width: Math.round (width? width: this.zoomStopWidth) + "px",
height: Math.round (height? height: this.zoomStopHeight) + "px"
});
element.appendChild(document.createTextNode(text));
return element;
},
/**
* Method: divClick
* Picks up on clicks directly on the zoombar div
* and sets the zoom level appropriately.
*/
divClick: function (evt) {
if (!OpenLayers.Event.isLeftClick(evt)) {
return;
}
var y = evt.xy.y;
var top = OpenLayers.Util.pagePosition(evt.object)[1];
var levels = (y - top)/this.zoomStopHeight;
if(this.forceFixedZoomLevel || !this.map.fractionalZoom) {
levels = Math.floor(levels);
}
var zoom = (this.map.getNumZoomLevels() - 1) - levels;
zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
this.map.zoomTo(zoom);
OpenLayers.Event.stop(evt);
},
/**
* Method: doubleClick
*
* Parameters:
* evt - {Event}
*
* Returns:
* {Boolean}
*/
doubleClick: function (evt) {
OpenLayers.Event.stop(evt);
return false;
},
/*
* Method: zoomBarDown
* event listener for clicks on the slider
*
* Parameters:
* evt - {<OpenLayers.Event>}
*/
zoomBarDown:function(evt) {
if (!OpenLayers.Event.isLeftClick(evt)) {
return;
}
this.map.events.on({
"mousemove": this.passEventToSlider,
"mouseup": this.passEventToSlider,
scope: this
});
this.mouseDragStart = evt.xy.clone();
this.zoomStart = evt.xy.clone();
this.div.style.cursor = "move";
// reset the div offsets just in case the div moved
this.zoombarDiv.offsets = null;
OpenLayers.Event.stop(evt);
},
/**
* Method: buttonDown
*
* Parameters:
* evt - {Event}
*/
buttonDown: function (evt) {
if (!OpenLayers.Event.isLeftClick(evt)) {
return;
}
switch (this.action) {
case "zoomin":
this.map.zoomIn();
break;
case "zoomout":
this.map.zoomOut();
break;
}
OpenLayers.Event.stop(evt);
},
/*
* Method: zoomBarDrag
* This is what happens when a click has occurred, and the client is
* dragging. Here we must ensure that the slider doesn't go beyond the
* bottom/top of the zoombar div, as well as moving the slider to its new
* visual location
*
* Parameters:
* evt - {<OpenLayers.Event>}
*/
zoomBarDrag:function(evt) {
if (this.mouseDragStart != null) {
var deltaY = this.mouseDragStart.y - evt.xy.y;
var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
if ((evt.clientY - offsets[1]) > 0 &&
(evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
var newTop = parseInt(this.slider.style.top) - deltaY;
this.slider.style.top = newTop+"px";
this.mouseDragStart = evt.xy.clone();
}
OpenLayers.Event.stop(evt);
}
},
/*
* Method: zoomBarUp
* Perform cleanup when a mouseup event is received -- discover new zoom
* level and switch to it.
*
* Parameters:
* evt - {<OpenLayers.Event>}
*/
zoomBarUp:function(evt) {
if (!OpenLayers.Event.isLeftClick(evt)) {
return;
}
if (this.mouseDragStart) {
this.div.style.cursor="";
this.map.events.un({
"mouseup": this.passEventToSlider,
"mousemove": this.passEventToSlider,
scope: this
});
var deltaY = this.zoomStart.y - evt.xy.y;
var zoomLevel = this.map.zoom;
if (!this.forceFixedZoomLevel && this.map.fractionalZoom) {
zoomLevel += deltaY/this.zoomStopHeight;
zoomLevel = Math.min(Math.max(zoomLevel, 0),
this.map.getNumZoomLevels() - 1);
} else {
zoomLevel += Math.round(deltaY/this.zoomStopHeight);
}
this.map.zoomTo (Math.max (zoomLevel, this.minZoom));
this.mouseDragStart = null;
this.zoomStart = null;
OpenLayers.Event.stop(evt);
}
},
/*
* Method: moveZoomBar
* Change the location of the slider to match the current zoom level.
*/
moveZoomBar:function() {
var newTop =
((this.map.getNumZoomLevels()-1) - Math.max(this.map.getZoom(),this.minZoom)) *
this.zoomStopHeight + this.startTop + 1;
this.slider.style.top = newTop + "px";
this.slider.setAttribute ('title', OpenLayers.i18n("zoom") + " = " + this.map.getZoom());
},
CLASS_NAME: "OpenLayers.Control.ZoomBar"
});
OpenLayers.Lang.de = OpenLayers.Util.extend (OpenLayers.Lang.de,
{"zoom" : "Zoomstufe"
});
OpenLayers.Lang.en = OpenLayers.Util.extend (OpenLayers.Lang.en,
{"zoom" : "Zoom level"
});
OpenLayers.Lang.fr = OpenLayers.Util.extend (OpenLayers.Lang.fr,
{"zoom" : "Zoom niveau"
});
OpenLayers.Lang.it = OpenLayers.Util.extend (OpenLayers.Lang.it,
{"zoom" : "Zoom level"
}); 
