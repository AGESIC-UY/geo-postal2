/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

MyLayerSwitcher.prototype = new OpenLayers.Control.LayerSwitcher;           // Define sub-class 
MyLayerSwitcher.prototype.constructor = MyLayerSwitcher; 
function MyLayerSwitcher() 
{ 
    OpenLayers.Control.LayerSwitcher.call(this);                                         // derived constructor = call super-class constructor 
} 

MyLayerSwitcher.prototype.onLabelClick = function(){  
    //alert(this.layer.name);
    this.map.zoomToScale(IsisSesion.getIsisMapa().getEscalaCercana(this.layer.escalaMaxima) ,true);
    this.layer.setVisibility(true);
}

/**
     * Method: redraw
     * Goes through and takes the current state of the Map and rebuilds the
     *     control to display that state. Groups base layers into a
     *     radio-button group and lists each data layer with a checkbox.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
MyLayerSwitcher.prototype.redraw = function(){    
    
    //if the state hasn't changed since last redraw, no need
    // to do anything. Just return the existing div.
    if (!this.checkRedraw()) {
        return this.div;
    }

    //clear out previous layers
    this.clearLayersArray("base");
    this.clearLayersArray("data");

    var containsOverlays = false;
    var containsBaseLayers = false;

    // Save state -- for checking layer if the map state changed.
    // We save this before redrawing, because in the process of redrawing
    // we will trigger more visibility changes, and we want to not redraw
    // and enter an infinite loop.
    var len = this.map.layers.length;
    this.layerStates = new Array(len);
    for (var i=0; i <len; i++) {
        var layer = this.map.layers[i];
        this.layerStates[i] = {
            'name': layer.name,
            'visibility': layer.visibility,
            'inRange': layer.inRange,
            'id': layer.id
        };
    }

    var layers = this.map.layers.slice();
    if (!this.ascending) {
        layers.reverse();
    }
    for(var i=0, len=layers.length; i<len; i++) {
        var layer = layers[i];
        var baseLayer = layer.isBaseLayer;

        if (layer.displayInLayerSwitcher) {

            if (baseLayer) {
                containsBaseLayers = true;
            } else {
                containsOverlays = true;
            }

            // only check a baselayer if it is *the* baselayer, check data
            //  layers if they are visible
            var checked = (baseLayer) ? (layer == this.map.baseLayer)
            : layer.getVisibility();

            // create input element
            var inputElem = document.createElement("input"),
            // The input shall have an id attribute so we can use
            // labels to interact with them.
            inputId = OpenLayers.Util.createUniqueID(
                this.id + "_input_"
                );

            inputElem.id = inputId;
            inputElem.name = (baseLayer) ? this.id + "_baseLayers" : layer.name;
            inputElem.type = (baseLayer) ? "radio" : "checkbox";
            inputElem.value = layer.name;
            inputElem.checked = checked;
            inputElem.defaultChecked = checked;
            inputElem.className = "olButton";
            inputElem._layer = layer.id;
            inputElem._layerSwitcher = this.id;

            if (!baseLayer && !layer.inRange) {
                inputElem.disabled = true;
            }

            // create span
            var labelSpan = document.createElement("label");
            // this isn't the DOM attribute 'for', but an arbitrary name we
            // use to find the appropriate input element in <onButtonClick>
            labelSpan["for"] = inputElem.id;
            OpenLayers.Element.addClass(labelSpan, "labelSpan olButton");
            labelSpan._layer = layer.id;
            labelSpan._layerSwitcher = this.id;
            if (!baseLayer && !layer.inRange) {
                labelSpan.style.color = "gray";
            }
            labelSpan.style.cursor = "pointer";
            labelSpan.innerHTML = layer.name;
            labelSpan.style.verticalAlign = (baseLayer) ? "bottom"
            : "baseline";
            
            var context = {
                'layer': layer,
                'map': this.map
            };
            
            OpenLayers.Event.observe(labelSpan, "click",
                OpenLayers.Function.bindAsEventListener(this.onLabelClick, context)
                );
            
            // create line break
            var br = document.createElement("br");


            var groupArray = (baseLayer) ? this.baseLayers
            : this.dataLayers;
            groupArray.push({
                'layer': layer,
                'inputElem': inputElem,
                'labelSpan': labelSpan
            });


            var groupDiv = (baseLayer) ? this.baseLayersDiv
            : this.dataLayersDiv;
            groupDiv.appendChild(inputElem);
            groupDiv.appendChild(labelSpan);
            groupDiv.appendChild(br);
        }
    }

    // if no overlays, dont display the overlay label
    this.dataLbl.style.display = (containsOverlays) ? "" : "none";

    // if no baselayers, dont display the baselayer label
    this.baseLbl.style.display = (containsBaseLayers) ? "" : "none";

    return this.div;
    
    
    
}
  
MyLayerSwitcher.prototype.loadContents = function()                                 // redefine Method 
{ 
    OpenLayers.Control.LayerSwitcher.prototype.loadContents.call(this);         // Call super-class method 
    this.baseLbl.innerHTML = OpenLayers.i18n("xxx");                                   //change title for base layers 
    this.dataLbl.innerHTML = OpenLayers.i18n("yyy");                                   //change title for overlays (empty string "" is an option, too)
    var br = document.createElement("br");
    
    
    this.selectDiv = document.createElement("div");
    this.selectDiv.id = this.id + "_selectallDiv";
    OpenLayers.Element.addClass(this.selectDiv, "baseLayersDiv");
    
    var inputElem2 = document.createElement("input");
    inputElem2.id = this.id + "_input_selectall";
    inputElem2.name = this.id + "_selectall";
    inputElem2.type = "checkbox";
    inputElem2.value = "Seleccionar todas";
    inputElem2.checked = false;
    inputElem2.defaultChecked = false;
            
    var labelSpan2 = document.createElement("span");
    OpenLayers.Element.addClass(labelSpan2, "labelSpan")                    
    labelSpan2.innerHTML = "Seleccionar todas";
    labelSpan2.style.verticalAlign = "bottom" ;
    //                    OpenLayers.Event.observe(labelSpan2, "click", 
    //                        OpenLayers.Function.bindAsEventListener(this.onInputClick,
    //                            context)
    //                        );
            
    //            this.selectDiv.push({                       
    //                'inputElem': inputElem2,
    //                'labelSpan': labelSpan
    //            });  
    
    var context = {
        'inputElem': inputElem2,        
        'layerSwitcher': this
    };
    OpenLayers.Event.observe(inputElem2, "mouseup", 
        OpenLayers.Function.bindAsEventListener(this.onSelectAllClick,
            context)
        );
    
    this.selectDiv.appendChild(br);
    this.selectDiv.appendChild(inputElem2);
    this.selectDiv.appendChild(labelSpan2);    
    
    this.layersDiv.appendChild(br); 
    this.layersDiv.appendChild(this.selectDiv);    
   
};

MyLayerSwitcher.prototype.onSelectAllClick = function(e) { 
    var map = IsisSesion.getIsisMapa().getMap();
    var isChequed= !this.inputElem.checked;
    for(var i=0, len=map.layers.length; i<len; i++) {
        var layer = map.layers[i];
        if(!layer.isBaseLayer && layer.name!="B&uacute;squeda" && layer.name!="Marcadores" && layer.inRange){
            layer.setVisibility(isChequed);
        }        
    }
    this.layerSwitcher.updateMap();
//   OpenLayers.Event.stop(e);    
}

