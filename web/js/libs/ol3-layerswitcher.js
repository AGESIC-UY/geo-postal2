/**
 * OpenLayers 3 Layer Switcher Control.
 * See [the examples](./examples) for usage.
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object} opt_options Control options, extends olx.control.ControlOptions adding:
 *                              **`tipLabel`** `String` - the button tooltip.
 */



ol.control.LayerSwitcher = function(opt_options) {
    IsisSesion.getIsisMapa().getMap().getView().on('change:resolution', function(evt) {
        console.log(IsisSesion.getIsisMapa().getMap().getView().getResolution());
        ol.control.LayerSwitcher.refreshAvailable();
    });

    this.rendered = false;
    var options = opt_options || {};

    var tipLabel = options.tipLabel ?
    options.tipLabel : 'Legend';

    this.mapListeners = [];

    this.hiddenClassName = 'ol-unselectable ol-control layer-switcher';
    this.shownClassName = this.hiddenClassName + ' shown';

    var element = document.createElement('div');
    element.className = this.hiddenClassName;
    element.id = 'selectorCapas';

    var button = document.createElement('div');
    button.id = "showLayerSwitcherButton";
    document.getElementsByTagName('body')[0].appendChild(button);
    //    element.appendChild(button);

    this.panel = document.createElement('div');
    this.panel.className = 'panel';
    element.appendChild(this.panel);

    var this_ = this;

    element.onmouseover = function(e) {
    //        this_.showPanel();
    };
    button.onclick = function(e) {
        this_.showPanel();
    };
    element.onmouseout = function(e) {
        e = e || window.event;
        if (!element.contains(e.toElement)) {
        //            this_.hidePanel();
        }
    };
    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};


ol.control.LayerSwitcher.refreshAvailable = function(){
    var lista = ($($("#selectorCapas li.group ul")[0]));
    //($($("#selectorCapas li.group ul")[0]).children()[0]).children[0].id
    var cantCapas = lista.children().length;
    var currentResolution = IsisSesion.getIsisMapa().getMap().getView().getResolution();
    for (var i = 0; i< cantCapas; i++){
        var id = (lista.children()[i]).children[1].id;
        try {
            var layer = ol.control.LayerSwitcher.layers[id];
            if ((layer.getMaxResolution() < currentResolution)||(layer.getMinResolution() > currentResolution)){
                $(lista.children()[i]).addClass("noseve");
            }else{
                $(lista.children()[i]).removeClass("noseve");
            }
        } catch (exp){
        }
    }
}

ol.control.LayerSwitcher.layers = [];

ol.inherits(ol.control.LayerSwitcher, ol.control.Control);

/**
 * Show the layer panel.
 */
ol.control.LayerSwitcher.prototype.showPanel = function() {
    //    if (this.element.className != this.shownClassName) {
    //        this.element.className = this.shownClassName;
    //        this.renderPanel();
    //    }
    if (!this.rendered){
        this.renered = true;
        this.renderPanel();
    }
    $('#selectorCapas').toggleClass('shown');
    setTimeout(function(){
        $(".ol-unselectable.ol-control.layer-switcher").getNiceScroll().resize();
    }, 650);
    
};

/**
 * Hide the layer panel.
 */
ol.control.LayerSwitcher.prototype.hidePanel = function() {
    // TODO: Ocultar panel
    //    if (this.element.className != this.hiddenClassName) {
    //        this.element.className = this.hiddenClassName;
    //    }

    $('#selectorCapas').removeClass('shown');
};

/**
 * Re-draw the layer panel to represent the current state of the layers.
 */
ol.control.LayerSwitcher.prototype.renderPanel = function() {
    this.rendered = true;
    this.ensureTopVisibleBaseLayerShown_();

    while(this.panel.firstChild) {
        this.panel.removeChild(this.panel.firstChild);
    }

    var ul = document.createElement('ul');
    this.panel.appendChild(ul);
    this.renderLayers_(this.getMap(), ul);
    $($("#selectorCapas li.group ul")[0]).sortable();
    $($("#selectorCapas li.group ul")[0]).on( "sortstop", function( event, ui ) {
        var cantCapas = ui.item.parent().children().length;
        for (var i = 0; i< cantCapas; i++){
            var cldn = ui.item.parent().children()[i];
            var id = cldn.children[1].id;
            var layer = ol.control.LayerSwitcher.layers[id];
            IsisSesion.getIsisMapa().overlayGroup.getLayers().setAt(cantCapas - i, layer);
        }
    } );
    $(".ol-unselectable.ol-control.layer-switcher").niceScroll({
        styler:"fb",
        cursorcolor:"#2E2F33", 
        cursorborder:"1px solid #2E2F33", 
        cursoropacitymax: 0.6,
        railpadding: {
            top:10,
            right:20,
            left:0,
            bottom:0
        }
    });
    
};

/**
 * Set the map instance the control is associated with.
 * @param {ol.Map} map The map instance.
 */
ol.control.LayerSwitcher.prototype.setMap = function(map) {
    // Clean up listeners associated with the previous map
    for (var i = 0, key; i < this.mapListeners.length; i++) {
        this.getMap().unByKey(this.mapListeners[i]);
    }
    this.mapListeners.length = 0;
    // Wire up listeners etc. and store reference to new map
    ol.control.Control.prototype.setMap.call(this, map);
    if (map) {
        var this_ = this;
        this.mapListeners.push(map.on('pointerdown', function() {
            this_.hidePanel();
        }));
        this.renderPanel();
    }
};

/**
 * Ensure only the top-most base layer is visible if more than one is visible.
 * @private
 */
ol.control.LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown_ = function() {
    var lastVisibleBaseLyr;
    ol.control.LayerSwitcher.forEachRecursive(this.getMap(), function(l, idx, a) {
        if (l.get('type') === 'base' && l.getVisible()) {
            lastVisibleBaseLyr = l;
        }
    });
    if (lastVisibleBaseLyr) this.setVisible_(lastVisibleBaseLyr, true);
};

/**
 * Toggle the visible state of a layer.
 * Takes care of hiding other layers in the same exclusive group if the layer
 * is toggle to visible.
 * @private
 * @param {ol.layer.Base} The layer whos visibility will be toggled.
 */
ol.control.LayerSwitcher.prototype.setVisible_ = function(lyr, visible) {
    var map = this.getMap();
    lyr.setVisible(visible);
    if (visible && lyr.get('type') === 'base') {
        // Hide all other base layers regardless of grouping
        ol.control.LayerSwitcher.forEachRecursive(map, function(l, idx, a) {
            if (l != lyr && l.get('type') === 'base') {
                l.setVisible(false);
            }
        });
    }
};

/**
 * Render all layers that are children of a group.
 * @private
 * @param {ol.layer.Base} lyr Layer to be rendered (should have a title property).
 * @param {Number} idx Position in parent group list.
 */
ol.control.LayerSwitcher.prototype.renderLayer_ = function(lyr, idx) {

    var this_ = this;

    var li = document.createElement('li');
    var moveImg = document.createElement('img');
    moveImg.setAttribute('src', 'css/images/icons/move.png');
    moveImg.className = "moveImg";
    var lyrTitle = lyr.get('title');
    var lyrId = lyr.get('title').replace(' ', '-') + '_' + idx;
    ol.control.LayerSwitcher.layers[lyrId] = lyr;

    var label = document.createElement('label');

    if (lyr.getLayers) {

        li.className = 'group';
        label.innerHTML = lyrTitle;
        li.appendChild(label);
        var ul = document.createElement('ul');
        li.appendChild(ul);

        this.renderLayers_(lyr, ul);

    } else {

        var input = document.createElement('input');
        if (lyr.get('type') === 'base') {
            input.type = 'radio';
            input.name = 'base';
        } else {
            input.type = 'checkbox';
            li.appendChild(moveImg);
        }
        input.id = lyrId;
        input.checked = lyr.get('visible');
        input.onchange = function(e) {
            this_.setVisible_(lyr, e.target.checked);
        };
        
        li.appendChild(input);

        //label.htmlFor = lyrId;
        label.innerHTML = lyrTitle;
        li.appendChild(label);
        if (lyr.get('type') !== 'base') {
            var divClose = document.createElement("div");
            divClose.className = "closeMetadata";
            divClose.onclick = ol.control.LayerSwitcher.openCloseMetaData;
            divClose.innerHTML = "<img src='css/images/icons/close.png' />";
            var div = document.createElement('div');
            var htmlContentDiv = "<img src='/geoserver/visualizador/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=15&height=15&layer="+lyr.getSource().getParams().LAYERS+"&TRANSPARENT=true'>" ;
            if (lyr.getSource().getParams().METADATO != null && lyr.getSource().getParams().METADATO != "" ){
                htmlContentDiv += '<a target="_blank" href="/geonetwork/srv/spa/metadata.show?id='+lyr.getSource().getParams().METADATO+'&currTab=simple"> Ver metadatos </a> ';
            }
            div.innerHTML = htmlContentDiv; 
            div.className = "metadataDiv closed";
            li.appendChild(divClose);
            li.appendChild(div);
            $(div).hide();
            $(label).dblclick(ol.control.LayerSwitcher.onLabelClick);
        //            $(label).click(function(){alert("single")});
        }
    }

    return li;

};



ol.control.LayerSwitcher.onLabelClick = function(){  
    if ($(this).parent().hasClass("noseve")){
        var capa = IsisSesion.getIsisMapa().obtenerCapaPorNombre(this.innerHTML);
        if (capa != null){
            if (capa.escalaMaxima){
                var resolucionCercana = IsisSesion.getIsisMapa().getEscalaCercana(capa.escalaMaxima);
                console.log("resolucion es: " + resolucionCercana);
                var escalaCercana = IsisUtils.getResolutionFromScale(resolucionCercana);
                var view = IsisSesion.getIsisMapa().getMap().getView();
                console.log("la escala es: " + escalaCercana);
                view.setResolution(escalaCercana);
            }
        }    
    }
}


ol.control.LayerSwitcher.openCloseMetaData = function (element){
    $(element.currentTarget).parent().children(".metadataDiv").slideToggle(200);
    $(element.currentTarget).toggleClass("closed");
    $(".ol-unselectable.ol-control.layer-switcher").getNiceScroll().resize(); 
}



/**
 * Render all layers that are children of a group.
 * @private
 * @param {ol.layer.Group} lyr Group layer whos children will be rendered.
 * @param {Element} elm DOM element that children will be appended to.
 */
ol.control.LayerSwitcher.prototype.renderLayers_ = function(lyr, elm) {
    var lyrs = lyr.getLayers().getArray().slice().reverse();
    for (var i = 0, l; i < lyrs.length; i++) {
        l = lyrs[i];
        if (l.get('title')) {
            elm.appendChild(this.renderLayer_(l, i));
        }
    }
};

/**
 * **Static** Call the supplied function for each layer in the passed layer group
 * recursing nested groups.
 * @param {ol.layer.Group} lyr The layer group to start iterating from.
 * @param {Function} fn Callback which will be called for each `ol.layer.Base`
 * found under `lyr`. The signature for `fn` is the same as `ol.Collection#forEach`
 */
ol.control.LayerSwitcher.forEachRecursive = function(lyr, fn) {
    lyr.getLayers().forEach(function(lyr, idx, a) {
        fn(lyr, idx, a);
        if (lyr.getLayers) {
            ol.control.LayerSwitcher.forEachRecursive(lyr, fn);
        }
    });
};


