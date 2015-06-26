/*
 * Licensed under the GPL License.  You may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 *
 *     http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * THIS PACKAGE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTIBILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 */

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function IsisMapa(){
    /**
     * Atributos
     */
    this.map = null;
    this.mapPanel = null;
    this.format = 'image/png';
    this.layer_poligonos = null;
    this.layer_marcador = null;
    this.capabilities = null;
    this.escalas = [1000, 2000,3000,5000,10000,15000,20000,30000,50000,80000,100000,200000,400000,500000,1000000,2000000,3000000,5000000];
    this.resolutions = [];
    //    this.resolutions = [
    //        1763.8924166737224,
    //        1058.3354500042333,
    //        705.5569666694889,
    //        352.77848333474446,
    //        176.38924166737223,
    //        141.11139333389778,
    //        70.55569666694889,
    //        35.277848333474445,
    //        28.222278666779562,
    //        17.638924166737223,
    //        10.583354500042333,
    //        7.055569666694891,
    //        5.291677250021166,
    //        3.5277848333474453,
    //        1.7638924166737227,
    //        1.0583354500042335,
    //        0.705556966669489,
    //        0.3527784833347445
    //    ]; // se calcula automaticamente a partir de escalas, en getResolutions    
    //    this.escalas = [];
    //    this.escalas.push(0,5206859334845961);
    //    this.escalas.push(533,1823958882264);
    //    this.escalas.push(1.066,3647917764529);
    //    this.escalas.push(2.132,7295835529058);
    //    this.escalas.push(4.265,4591671058115);
    //    this.escalas.push(8.530,918334211623);
    
    /**
     * Constructor
     */
    //    
    //    var view = new ol.View({
    //        projection: "EPSG:900913"
    //    });
    
    var view = new ol.View({
        resolutions: this.getResolutions(),
        resolution: 1763.8924166737224,
        //        center: ol.proj.transform([-6230946.505053505, -3874239.541910441], 'EPSG:900913', 'EPSG:900913'),
        center: ol.proj.transform([-6011477.407389778, -3872497.30722128], 'EPSG:900913', 'EPSG:900913'),
        zoom: 4
    });
     
    /*  var options = { 
        scales: this.getEscalas(),
        //minScale: 5000000000000,
        //maxScale: 1000,
        controls: [],   
        // maxResolution: 156543.0339,
        projection: "EPSG:900913",
        fractionalZoom: false,
        numZoomLevels: 18,        
        units: 'degrees',        
        maxExtent: new OpenLayers.Bounds(-6567849.956803141, -4300621.372044271, -5788613.521250226, -3439440.0607312606)
    }; */
    
    //    var options = {
    //        resolutions: [19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677],
    //        projection: new OpenLayers.Projection('EPSG:900913'),
    //        maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
    //        units: "meters",
    //        controls: []
    //    }; 
    
    //    this.map = new ol.Map({
    //        target: 'map', 
    //        view: view
    //    });
    
    
    this.map = new ol.Map({
        target: 'map',
        //        layers: [
        //        new ol.layer.Tile({
        //            source: new ol.source.MapQuest({
        //                layer: 'sat'
        //            })
        //        })
        //        ],
        view: view
    });
    
    
    
    this.baseGroup = new ol.layer.Group({
        'title':'Base'
    });
    this.overlayGroup = new ol.layer.Group({
        'title':'Datos'
    });
    
    this.map.addLayer(this.baseGroup);
    this.map.addLayer(this.overlayGroup);
    this.overlayGroup.on("change:layers", function(){
        alert('hola')
    });
    
    
    
    
/*  this.map.addControl(new OpenLayers.Control.NavigationEx ({
        documentDrag: true, 
        minZoom: 5
    }));*/
    
}

IsisMapa.prototype = {
    getMap: function (){
        return this.map;
    },
    setCapabilities: function(cap){
        this.capabilities = cap;   
    },
    getCapabilities: function(){
    // Lo saco porque no se usa.... creo...
    /*if(this.capabilities == null){
            OpenLayers.Request.GET({
                url : IsisConfiguracion.getHostGeoserver() + '/visualizador/wms',
                params : {
                    SERVICE: 'WMS',
                    VERSION: '1.3.0', // For example, '1.1.1'
                    REQUEST: 'GetCapabilities'
                },
                success: function(r){        
                    var XMLformat = new OpenLayers.Format.XML(); 
                    var xml = XMLformat.read(r.responseText); 
                    var CAPformat = new OpenLayers.Format.WMSCapabilities(); 
                    IsisSesion.getIsisMapa().setCapabilities(CAPformat.read(xml));                
                },
                failure : function(r) {                
                }
            });             
        }
        return this.capabilities;        */
    },    
    agregarCapasBase: function(etiqueta, nombres){
        var salida = null;
        var capas = [];
        
        if(etiqueta == "Bing Aerial Whit Labels"){
            try{
                var bing = new ol.layer.Tile({
                    visible: false,
                    preload: Infinity,
                    title: "Bing",
                    type: 'base',
                    source: new ol.source.BingMaps({
                        key: 'At8GFudIFN0g9EDaY19M22GyrHc5Kp1skIrlXllFtnJHytY__Pd1iN6qX-oMisHV',
                        imagerySet: "AerialWithLabels"
                    })
                });
                this.baseGroup.getLayers().push(bing);
            }
            catch(err){
                Ext.MessageBox.show( 'Open Street Map',  'No fue posible cargar Open Street Map .');
            }
        } else if(etiqueta == "Open Street Map"){
            try{
                /* var osm = new OpenLayers.Layer.OSM("Open Street Map", '', {
                    //numZoomLevels: 20,
                    minZoomLevel: 5,
                    maxZoomLevel: 20   
                });*/
                var osm = new ol.layer.Tile({
                    type: 'base',
                    title: etiqueta,
                    source: new ol.source.OSM()
                });
                this.baseGroup.getLayers().push(osm);
            }
            catch(err){
                Ext.MessageBox.show( 'Open Street Map',  'No fue posible cargar Open Street Map .');
            }
        } else if(etiqueta == "Google Physical"){
            try{
            /* var physical = new OpenLayers.Layer.Google(
                    "Google Physical",
                    {
                        type: google.maps.MapTypeId.TERRAIN,
                        numZoomLevels: 20,
                        minZoomLevel: 5,
                        maxZoomLevel: 20
                    }
                    ); 
                this.map.addLayers([physical]);  */              
            }
            catch(err){
                IsisExt.mostrarMensaje('Google', 'No fue posible cargar los mapas de Google.');
            }
        }else if(etiqueta == "Google Streets"){
            try{
            /*  var streets = new OpenLayers.Layer.Google(
                    "Google Streets", {
                        numZoomLevels: 20,
                        minZoomLevel: 5,
                        maxZoomLevel: 20
                    }
                    );
                this.map.addLayers([streets]);*/
            }
            catch(err){
                IsisExt.mostrarMensaje('Google', 'No fue posible cargar los mapas de Google.');
            }
        }else if(etiqueta == "Google Hybrid"){
            try{
            /*  var hybrid = new OpenLayers.Layer.Google(
                    "Google Hybrid",
                    {
                        type: google.maps.MapTypeId.HYBRID,
                        numZoomLevels: 20,
                        minZoomLevel: 5,
                        maxZoomLevel: 20
                    
                    
                    }
                    );
                this.map.addLayers([hybrid]); */
            }
            catch(err){
                IsisExt.mostrarMensaje('Google', 'No fue posible cargar los mapas de Google.');
            }           
        }else if(etiqueta == "Google Satellite"){
            try{
            /*var satellite = new OpenLayers.Layer.Google(
                    "Google Satellite",
                    {
                        type: google.maps.MapTypeId.SATELLITE,
                        numZoomLevels: 20,
                        minZoomLevel: 5,
                        maxZoomLevel: 20
                    }
                    );
                this.map.addLayers([satellite]); */
            }
            catch(err){
                IsisExt.mostrarMensaje('Google', 'No fue posible cargar los mapas de Google.');
            } 
        }else{
            //            var capasString = nombres[nombres.length-2];
            //            for(var i = nombres.length-1; i>0 ;i--){
            //                capasString += ",visualizador:" + nombres[i-1];
            //            }
            //            
            
            for(var i = 0; i<nombres.length;i++){
                capas.push("visualizador:" + nombres[i]);
            }
            
            var capasString = "" + capas; 
            
            
            var salida = new ol.layer.Tile({
                title: etiqueta , 
                type: 'base',
                
                //extent: se le saco el extent, gp2
                source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
                    url: IsisConfiguracion.getHostGeoserver() + '/wms',
                    params: {
                        'LAYERS':capasString, 
                        'TILED': true,
                        width: '256',
                        height: '256',
                        VERSION: '1.1.0'
                    },
                    serverType: 'geoserver'
                }))
            })
            this.baseGroup.getLayers().push(salida);
        //this.map.addLayer();
        //            var layers = this.map.getLayers();
        //            layers.insertAt(0, salida);
        }   	
    },   
    agregarCapa:function (nombre,layer, visibility, base, grupo, metadato, escalaMinima, escalaMaxima, capa_buscable){
        var salida = null;
        if (!base){
            salida = new ol.layer.Tile({
                title: nombre, 
                visible: visibility,
                //extent: se le saco el extent, gp2
                source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
                    url: IsisConfiguracion.getHostGeoserver() + '/wms',
                    params: {
                        'LAYERS':'visualizador:'+layer, 
                        'TILED': true,
                        'METADATO' : metadato,
                        VERSION: '1.1.0'
                        
                    },
                    serverType: 'geoserver'
                }))
            });
            
            if (escalaMaxima != "" && escalaMaxima != undefined && escalaMaxima != 0){
                salida.setMaxResolution(IsisUtils.getResolutionFromScale(escalaMaxima));
            }
            if (escalaMaxima != "" && escalaMinima != undefined && escalaMinima!= 0){
                salida.setMinResolution(IsisUtils.getResolutionFromScale(escalaMinima));
            }
            this.overlayGroup.getLayers().push(salida);
        // this.map.addLayer(salida);
        }
        
        if(escalaMaxima != ""){
            //            salida.maxResolution = OpenLayers.Util.getResolutionFromScale(escalaMaxima, 'm');
            salida.escalaMaxima = escalaMaxima;
        }
        
        if(escalaMinima != ""){
            //          salida.minResolution = OpenLayers.Util.getResolutionFromScale(escalaMinima, 'm');     
            salida.escalaMinima = escalaMinima;
        } 
        
        return salida;
    },
    obtenerCapaPorNombre: function(nombre){
        var capas = IsisSesion.getIsisCAPAS().capas;
        for (var i = 0; i< capas.length; i++){
            if (capas[i].Nombre == nombre){
                return capas[i];
            }
        }
        return null;
    }, 
    obtenerCapaPorIndice: function(indice){
        return this.map.layers[indice];
    }, 
    setearVisibilidades : function (visibilidades){
        var numCapas = this.map.layers.size();
        for(var i=0;i<numCapas;i++){
            if(visibilidades[this.map.layers[i].name]!=null){
                this.map.layers[i].setVisibility(visibilidades[this.map.layers[i].name]);
            }
        }
    },
    agregarPopUpControl: function(){
        $("body").append('<div id="popup" class="ol-popup"><a href="#" id="popup-closer" class="ol-popup-closer"></a><div id="popup-content"></div></div>');
        var container = document.getElementById('popup');
        var content = document.getElementById('popup-content');
        var closer = document.getElementById('popup-closer');
        /**
         * Elements that make up the popup.
         */
        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.closer = document.getElementById('popup-closer');


        /**
         * Add a click handler to hide the popup.
         * @return {boolean} Don't follow the href.
         */
        this.closer.onclick = function() {
            IsisSesion.getIsisMapa().overlay.setPosition(undefined);
            IsisSesion.getIsisMapa().closer.blur();
            return false;
        };


        /**
         * Create an overlay to anchor the popup to the map.
         */
        this.overlay = new ol.Overlay({
            element: container
        });
        
        IsisSesion.getIsisMapa().getMap().getOverlays().push(this.overlay);
        
    },
    agregarControles: function (){
        var layerSwitcher = new ol.control.LayerSwitcher({
            tipLabel: 'Legende' // Optional label for button
        });
        this.map.addControl(layerSwitcher);
        
        var scaleLine =  new ol.control.ScaleLine();
        this.map.addControl(scaleLine);
        
        var zoomslider = new ol.control.ZoomSlider();
        this.map.addControl(zoomslider);
        this.agregarPopUpControl();
      
        
        this.map.on('click', function(evt) {
            var viewProjection = IsisSesion.getIsisMapa().getMap().getView().getProjection();
            var viewResolution = IsisSesion.getIsisMapa().getMap().getView().getResolution();
            var layersToQuery = "";
            var layersQueryToQuery = "";
            var unaURL = null;
            for (var i in IsisSesion.getIsisMapa().getMap().getLayers().getArray()){
                var group = IsisSesion.getIsisMapa().getMap().getLayers().getArray()[i];
                if (group.getLayers){
                    for (var j in group.getLayers().getArray()){
                        var layer = group.getLayers().getArray()[j];
                        if (layer.getVisible() && (layer.getSource().getGetFeatureInfoUrl != undefined)){
                            var url_aux = layer.getSource().getGetFeatureInfoUrl(
                                evt.coordinate, viewResolution, viewProjection,
                                {
                                    'INFO_FORMAT': 'application/vnd.ogc.gml' /*,
                                    'INFO_FORMAT': 'application/vnd.ogc.gml' /*,
                                    'propertyName': 'formal_en'*/
                                });
                            unaURL = url_aux;   
                            var url_aux_obj = new Url(url_aux);
                            if(layersToQuery != ""){
                                layersToQuery += ","
                            }
                            layersToQuery += url_aux_obj.query.LAYERS;
                            if(layersQueryToQuery != ""){
                                layersQueryToQuery += ","
                            }
                            layersQueryToQuery += url_aux_obj.query.QUERY_LAYERS;
                        //layersToQuery += url_aux_obj
                        }
                    }
                }
            }
            
            if (unaURL !=  null) {
                var finalURL = new Url(unaURL); // Se crea la url a partir de una cualquiera, y se modifican las capas
                finalURL.query.LAYERS = layersToQuery;
                finalURL.query.QUERY_LAYERS = layersQueryToQuery;
                //                finalURL.query.SRS = "EPSG:900913";
                //                finalURL.query.VERSION = "1.1.1";
                finalURL.query.FEATURE_COUNT = 10;
                var parser = new ol.format.GML2();
                $.ajax({
                    url: finalURL.toString()
                }).done(function(response) {
                    var xmlResponse = $.parseXML(response);
                    var features = $(xmlResponse).find("featureMember");
                    //  var result = parser.readFeatures(response);
                    if (features.length) {
                        IsisVisualizador.genPopTextWMS(features, evt);
                    }
                });
            }
        });
        
        
        //Cambio de estilo del zoom box
        var interactions = this.map.getInteractions().getArray();
        for (var i = 0; i < interactions.length; i++){
            var interaction = interactions[i];
            if (ol.interaction.DragZoom.prototype.isPrototypeOf(interaction)){
                interaction.setProperties({
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(1, 143, 208, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#018FD0',
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: '#ffcc33'
                            })
                        })
                    })
                    }); 
            }
        }
    //        IsisSesion.getIsisMapa().getMap().getInteractions().getArray()[8].getProperties()
        
  
        
        
    },
    agregarControles2: function (){ // FIXME: Ver si se pueden agregar todos los controles juntos
        this.map.events.register('zoomend', this, function (event) {
            var x = this.map.getZoom();        
        //            if( x < 7)
        //          {
        //            this.map.zoomTo(7);
        //      }
        });
        // map.addControl(new OpenLayers.Control.LayerSwitcher());
        this.map.addControl( new MyLayerSwitcher() );
    
    
    
        this.map.addControl(new OpenLayers.Control.ScaleLine({
            bottomOutUnits: ''
        }));
        //map.addControl(new OpenLayers.Control.ScaleLineEx());
        this.map.addControl(new OpenLayers.Control.ZoomBar ({
            // minZoom: 1      
            }));
        this.map.addControl(new OpenLayers.Control.MovePanel());
        this.map.addControl(new OpenLayers.Control.ZoomBox({
            title: "Draw a box to ZOOM IN", 
            text: 'Click Me'
        }));
        
        
        var divControles = document.createElement("div");
        divControles.id = 'basic-controls';
        document.getElementsByTagName("body")[0].appendChild(divControles);
        
        var dragPan = new OpenLayers.Control.DragPan({
            'title': 'Mover'
        });
        var zoomBox = new OpenLayers.Control.ZoomBox({
            'title': 'Zoom'
        });
        var navToolBar = new OpenLayers.Control.Panel({
            'div': $('basic-controls')
        });
        navToolBar.addControls([dragPan, zoomBox]);
        navToolBar.defaultControl = dragPan;
 
        this.map.addControl(navToolBar);
    
        //map.addControl(new OpenLayers.Control.ZoomLevel())
        //alert("hola");
        this.map.addControl(new OpenLayers.Control.Navigation());
        //this.map.addControl(new OpenLayers.Control.KeyboardDefaults());
        //    map.addControl(new OpenLayers.Control.PanZoomBar({
        //        position: new OpenLayers.Pixel(2, 15),
        //        minZoom: 5
        //    }));
        var overview = new OpenLayers.Control.OverviewMap({
            maximized: false,
            minRatio: 24,
            maxRatio: 80
        });	
        this.map.addControl(overview);      
   
        var args = OpenLayers.Util.getParameters();
        if (!(args.mappanel_x && args.mappanel_y && args.mappanel_zoom)) {       
            var extent = new OpenLayers.Bounds(-6567849.956803141, -4300621.372044271, -5788613.521250226, -3439440.0607312606);
            this.map.zoomToExtent(extent);    
        }
        
        var labels = $$(".dataLbl");
        labels[0].innerHTML="Datos";
        labels = $$(".baseLbl");
        labels[0].innerHTML="Base";
        
        /** Pop Up **/    
        
        var fi = new OpenLayers.Control.WMSGetFeatureInfo({
            url: IsisConfiguracion.getHostGeoserver() + '/wms',
            title: 'Info',
            queryVisible: true,
            infoFormat:'application/vnd.ogc.gml',
            eventListeners: {
                beforegetfeatureinfo:function(event) {
                },
                nogetfeatureinfo:function(event) {
                } ,
                getfeatureinfo: function(evt) {
                    var texto = IsisVisualizador.genPopTextWMS(evt);
                    if(texto!=""){
                        this.map.addPopup(new OpenLayers.Popup.FramedCloud(
                            "",
                            this.map.getLonLatFromPixel(evt.xy),
                            null,
                            texto,
                            null,
                            true
                            ));
                    }
                }
            }
        });
        this.map.addControl(fi);
        fi.activate();      
    
        this.map.events.register('changelayer', null, function(evt){
            if(evt.property === "visibility") {
                IsisSesion.getIsisBusquedaEspecifica().actualizarFormularioDeBusqueda();            
            }
        }
        );    
        /**
         * FIXME: Ver si esto sirve para algo
         */
        $$('.olControlPanZoomBar').each(
            function (e) {
                e.setStyle({
                    display:'block'
                }); 
            } 
            );
      
    },
    zoomWorld: function(){
        var extent = new OpenLayers.Bounds(-6567849.956803141, -4300621.372044271, -5788613.521250226, -3439440.0607312606);
        this.map.zoomToExtent(extent);      
    },
    getEscalas: function(){
        return this.escalas;  
    },
    getResolutions: function(){
        if (this.resolutions.length == 0){
            var sc = this.escalas.reverse();
            for (var i = 0; i < sc.length; i++){
                var rs = IsisUtils.getResolutionFromScale(sc[i]);
                this.resolutions.push(rs);
            } 
        }
        return this.resolutions;
    },
    agregarControlesDeCoordenadas : function (){
        //        this.map.addControl(
        //            new OpenLayers.Control.MousePosition({
        //                prefix: '<a target="_blank" style="color: #4D4D4D" ' +
        //                'href="http://spatialreference.org/ref/epsg/900913/">' +
        //                'EPSG:900913</a> coordenadas: ',
        //                separator: ' | ',
        //                numDigits: 2,
        //                emptyString: 'El mouse no se encuentra sobre el mapa.'
        //            })
        //            ); 
                
                
                
        this.map.on("singleclick", function(e){
            if (document.getElementById("sistemaCoord") != null){ // El elemento puede ser null si el menu nunca se abrió
                //                var position = IsisSesion.getIsisMapa().getMap().getLonLatFromPixel(e.xy).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:32721"));                
                //                var point = new ol.geom.Point(e.coordinate);
                var point = ol.proj.transform(e.coordinate, IsisSesion.getIsisMapa().getMap().getView().getProjection(), new ol.proj.Projection({
                    code: "EPSG:4326"
                }));
                //                point = point.transform(IsisSesion.getIsisMapa().getMap().getView().getProjection(), new ol.proj.Projection({code: "EPSG:32721"}));
               
                var srid = document.getElementById("sistemaCoord").value;
            
                if(srid != null && srid!= ""){
                    obtenerPunto(point[0],point[1], srid);
                }
                else{
                    IsisSesion.getIsisExt().mostrarMensaje('Coordenadas', 'Debe ingresar un sistema de referencia.');
                }
            }
        });
    //        this.map.events.register("click", this.map, function(e) {
    //            if (document.getElementById("sistemaCoord") != null){ // El elemento puede ser null si el menu nunca se abrió
    //                var position = IsisSesion.getIsisMapa().getMap().getLonLatFromPixel(e.xy).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:32721"));                
    //                var srid = document.getElementById("sistemaCoord").value;
    //            
    //                if(srid != null && srid!= ""){
    //                    obtenerPunto(position.lon.toFixed(3),position.lat.toFixed(3), srid);
    //                }
    //                else{
    //                    Ext.MessageBox.show({
    //                        title: 'Coordenadas',
    //                        msg: 'Debe ingresar un sistema de referencia.',
    //                        buttons: Ext.MessageBox.OK                
    //                    });
    //                }
    //            }
    //        }); 
    },
    getEscalaCercana: function(scale){
        var encontre=false;
        var numE = 0;
        IsisSesion.getIsisMapa().getEscalas().reverse();
        var escalas = IsisSesion.getIsisMapa().getEscalas();
        var escalaZoom = escalas[numE];
        while(!encontre && (numE < escalas.length)){
            if(escalas[numE] < scale){                
                escalaZoom = escalas[numE];
                numE++;
            }
            else{
                encontre = true;
            }
        }
        IsisSesion.getIsisMapa().getEscalas().reverse();
        //        escalas.reverse();
        return escalaZoom;
    },
    viajarAPunto : function (punto){
        /* todavia no se usa */
        var duration = 2000;
        var start = +new Date();
        var pan = ol.animation.pan({
            duration: duration,
            source: (IsisSesion.getIsisMapa().getMap().getView().getCenter()),
            start: start
        });
        var bounce = ol.animation.bounce({
            duration: duration,
            resolution: 4 * IsisSesion.getIsisMapa().getMap().getView().getResolution(),
            start: start
        });
        IsisSesion.getIsisMapa().getMap().beforeRender(pan, bounce);
        IsisSesion.getIsisMapa().getMap().getView().setCenter(punto);
    }
}



