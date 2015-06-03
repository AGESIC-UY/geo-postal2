/*
ZoomLevel.js by André Joost, modified by Otto Wyss
Version 2010-11-13
Dieses Modul erstellt ein zusätzliches Steuerelement für Openlayers,
mit dem die Zoomstufe in Text und Zahl dargestellt wird.
Für die Positionierung auf dem Bildschirm muß in der CSS-Datei folgender Abschnitt vorhanden sein:
.olControlZoomlevel {
left: 10px;
bottom: 2.5em;
display: block;
position: absolute;
}
*/
OpenLayers.Control.ZoomLevel = OpenLayers.Class(OpenLayers.Control,
{argParserClass:OpenLayers.Control.ArgParser,
element:null,base:'',
displayProjection:null,
initialize:function (element,base,options) {
OpenLayers.Control.prototype.initialize.apply (this, [options]);
this.element = OpenLayers.Util.getElement (element);
this.base = base||document.location.href;
},
destroy:function() {
if (this.element.parentNode == this.div) {
this.div.removeChild (this.element);
}
this.element = null;
this.map.events.unregister ('moveend', this, this.updateLink);
OpenLayers.Control.prototype.destroy.apply (this, arguments);
},
setMap:function(map) {
OpenLayers.Control.prototype.setMap.apply (this, arguments);
for (var i=0, len=this.map.controls.length; i<len; i++) {
var control = this.map.controls[i];
if (control.CLASS_NAME == this.argParserClass.CLASS_NAME) {
if (control.displayProjection != this.displayProjection) {
this.displayProjection = control.displayProjection;
}
break;
}
}
if (i == this.map.controls.length) {
this.map.addControl (new this.argParserClass ({'displayProjection': this.displayProjection}));
}
},
draw:function() {
OpenLayers.Control.prototype.draw.apply (this, arguments);
if (!this.element) {
this.div.className = this.displayClass;
this.element = document.createElement ("a");
this.element.innerHTML = OpenLayers.i18n("zoom");
this.element.href = "";
this.div.appendChild (this.element);
}
this.map.events.on ({'moveend': this.updateLink
,'changelayer': this.updateLink
,'changebaselayer': this.updateLink
,scope: this});
this.updateLink();
return this.div;
},
updateLink:function() {
this.element.innerHTML = OpenLayers.i18n("zoom") + " = " + this.map.getZoom();
},
CLASS_NAME: "OpenLayers.Control.ZoomLevel"
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
