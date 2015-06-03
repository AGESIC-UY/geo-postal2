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

/**
 * Esta clase contiene la logica de la representación de los resultados en un
 * mapa (el pasado en el constructor).
 * 
 */

function IsisResultado(isisMapa, featureSelectedEvent) {
    this.isisMapa = isisMapa;
    this.featureSelectedEvent = featureSelectedEvent;
 
//    this.layer_poligonos = null;
//    this.marcadores = new IsisCapaMarcadores(IsisCapaMarcadores.PIN_DIRECCION, 40, 120);
//    
//    var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['select']);
//    layer_style.fillOpacity = 0.5;
//    layer_style.graphicOpacity = 1;    
//
//    /*
//     * Blue style
//     */
//    this.style_unselected = OpenLayers.Util.extend({}, layer_style);
//    this.style_unselected.strokeColor = "#FFD800";
//    this.style_unselected.fillColor = "#FFD800";
//    //    this.style_unselected.strokeColor = "transparent";
//    //    this.style_unselected.fillColor = "transparent";
//    this.style_unselected.graphicName = "circle";
//    this.style_unselected.pointRadius = 20;
//    this.style_unselected.strokeWidth = 2;
//    this.style_unselected.rotation = 45;   
//    this.style_unselected.strokeLinecap = "butt";    
//    
//    this.style_selected = OpenLayers.Util.extend({}, layer_style);
//    this.style_unselected.strokeColor = "#FFD800";
//    this.style_unselected.fillColor = "#FFD800";
//    //    this.style_selected.strokeColor = "transparent";
//    //    this.style_selected.fillColor = "transparent";
//    this.style_selected.graphicName = "circle";
//    this.style_selected.pointRadius = 20;
//    this.style_selected.strokeWidth = 2;
//    this.style_selected.rotation = 45;
//    this.style_selected.strokeLinecap = "butt";
//      
//    
//    this.estiloMapa = new OpenLayers.StyleMap({
//        "default": this.style_unselected, 
//        "select": this.style_selected
//    });

}

//FIXME: Arreglar estooooooooo
//OpenLayers.Handler.Feature.prototype.activate = function() {
//    var activated = false;
//    if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
//        //this.moveLayerToTop();
//        this.map.events.on({
//            "removelayer": this.handleMapEvents,
//            "changelayer": this.handleMapEvents,            
//            scope: this
//        });
//        activated = true;
//    }
//    return activated;
//};

IsisResultado.prototype = {
    resetearResultados: function (){
        if(this.layer_poligonos!=null){
            this.isisMapa.getMap().removeLayer(this.layer_poligonos);       
        }
        
        this.layer_poligonos_source = new ol.source.Vector({
            //create empty vector
            });
        this.layer_poligonos = new ol.layer.Vector({
            visible: true,
            source: this.layer_poligonos_source
        });
        IsisSesion.getIsisMapa().getMap().addLayer(this.layer_poligonos);
        
        
        
        
        var selectSingleClick = new ol.interaction.Select();
        selectSingleClick.on("click", function(){
            alert('hola');
        });
        IsisSesion.getIsisMapa().getMap().addInteraction(selectSingleClick);
        
        
    //        var selectSingleClick = new ol.interaction.Select();
    //        this.layer_poligonos.on('');
        
        
    //        if(this.layer_poligonos!=null){
    //            this.isisMapa.getMap().removeLayer(this.layer_poligonos);       
    //        }
    //        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    //        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
    //    
    //        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
    //        layer_style.fillOpacity = 0.1;
    //        layer_style.graphicOpacity = 0.1;
    //        this.layer_poligonos = new OpenLayers.Layer.Vector("B&uacute;squeda",{
    //            styleMap: this.estiloMapa,
    //            renderers: renderer,
    //            displayInLayerSwitcher: false
    //        });
    //        this.isisMapa.getMap().addLayer(this.layer_poligonos);
    //        this.marcadores.limpiarMarcadores();
    //        var feature = new OpenLayers.Control.SelectFeature(this.layer_poligonos, 
    //        {
    //            clickout: true,
    //            toggle: true,
    //            multiple: false,
    //            hover: false,           
    //            toggleKey: "ctrlKey", // ctrl key removes from selection
    //            multipleKey: "shiftKey", // shift key adds to selection
    //            box: false
    //        });
    //        /*var feature =  new OpenLayers.Control.SelectFeature(
    //        [this.layer_poligonos, this.marcadores.vectorLayer],
    //        {
    //            'hover':true,
    //            'callbacks': {               
    //            }
    //        });*/
    //        this.isisMapa.getMap().addControl(feature);
    //        feature.activate();
    //        this.layer_poligonos.events.on({
    //            'featureselected': this.featureSelectedEvent
    //        }); 
    },
    /**
     * Agrega una geometria a los resultados, recibe el resultado a agregar con 
     * el formato del json que devuelve el anubis
     */
    agregarResultados: function(resultado){
        var attributes = [];
        attributes["Código Postal"] =  resultado.cp;
        for (var prop in resultado.propiedades){
            if(prop != "color")
            {
                attributes[prop] = resultado.propiedades[prop];
            }       
        }
        var capa = resultado.capa;
        if(capa.tipo=="MultiPolygon"){
            var poligonos = [];
            for(var i=0;i<capa.geometrias.length;i++){
                var poligono = capa.geometrias[i];
                var pointList = [];
                for(var j=0;j<poligono.length;j++){
                    punto = poligono[j];
                    pointList.push(ol.proj.transform([punto.x, punto.y], "EPSG:4326", IsisSesion.getIsisMapa().getMap().getView().getProjection()));
                }
                pointList.push(ol.proj.transform([poligono[0].x,poligono[0].y], "EPSG:4326", IsisSesion.getIsisMapa().getMap().getView().getProjection()));
                
                
                var polygonFeature = new ol.Feature(new ol.geom.Polygon([pointList]));
                //                polygonFeature.getGeometry().transform('EPSG:4326', IsisSesion.getIsisMapa().getMap().getView().getProjection());
                polygonFeature.setStyle(new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.9)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                }));
        
                this.layer_poligonos_source.addFeature(polygonFeature);
            }
        }else if(capa.tipo=="MultiLineString"){
            var multilineas = [];
            for(var i=0;i<capa.geometrias.length;i++){
                var linea = capa.geometrias[i];
                var pointList = [];
                for(var j=0;j<linea.length;j++){
                    punto = linea[j];
                    var xy = new OpenLayers.LonLat(punto.x,punto.y).transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        this.getIsisMapa.getMap().getProjectionObject());
                    var newPoint = new OpenLayers.Geometry.Point(xy.lon,xy.lat);
	
                    pointList.push(newPoint);
                }            
                var glinea = new OpenLayers.Geometry.LinearRing(pointList);
                multilineas.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointList), attributes/*, this.style_blue*/));
            }
            this.cambiarEstiloPoligono(false);
            this.layer_poligonos.addFeatures(multilineas);
        }else if(capa.tipo=="Point"){
            var puntos = [];
            for(var i=0;i<capa.geometrias.length;i++){
                var punto = capa.geometrias[i];
                var geom = new  ol.geom.Point(ol.proj.transform([punto.x, punto.y], "EPSG:4326", IsisSesion.getIsisMapa().getMap().getView().getProjection()));
                var feature = new ol.Feature(geom);
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        opacity: 1.0,
                        src: IsisConfiguracion.getHost() + '/geopostal2/css/images/correo_pin.png'
                    }))
                }); 
                feature.setStyle(iconStyle);
                //puntos.push(new OpenLayers.Feature.Vector(newPoint,  attributes/*, this.style_blue */));
                this.layer_poligonos_source.addFeature(feature);
            //puntos.push(newPoint);
            }
        }else{
            alert("Tipo no soportado: "+capa.tipo);
            return;
        }	
    },
    cambiarEstiloPoligono: function (punto){
    /*  if (punto){
            this.layer_poligonos.styleMap.styles.default.defaultStyle.fillOpacity = 0.0;
            this.layer_poligonos.styleMap.styles.default.defaultStyle.graphicOpacity = 0.0;
            this.layer_poligonos.styleMap.styles.default.defaultStyle.strokeOpacity = 0.0;
            this.layer_poligonos.styleMap.styles.select.defaultStyle.graphicOpacity = 0.0;
            this.layer_poligonos.styleMap.styles.select.defaultStyle.fillOpacity = 0.0;
            this.layer_poligonos.styleMap.styles.select.defaultStyle.strokeOpacity = 0.0;
            
        }else{
            this.layer_poligonos.styleMap.styles.default.defaultStyle.fillOpacity = 0.5;
            this.layer_poligonos.styleMap.styles.default.defaultStyle.graphicOpacity = 1.0;
            this.layer_poligonos.styleMap.styles.default.defaultStyle.strokeOpacity = 1.0;
            this.layer_poligonos.styleMap.styles.select.defaultStyle.graphicOpacity = 1.0;
            this.layer_poligonos.styleMap.styles.select.defaultStyle.fillOpacity = 0.5;
            this.layer_poligonos.styleMap.styles.select.defaultStyle.strokeOpacity = 1.0;
            
        }*/
    }
    ,
    agregarMarcador: function(x,y){
    //        this.marcadores.agregarMarcador(x,y);  
    //        var index = this.isisMapa.getMap().getLayerIndex(this.marcadores.getMarcadoresLayer());
    //        $(this.isisMapa.getMap().layers[index].div).setStyle({
    //            "pointer-events":"none"
    //        }); 
    },
    centrarMapaEnPunto: function (x,y){
        var view = IsisSesion.getIsisMapa().getMap().getView();
        view.setResolution(1.194328566789627);
        //    IsisSesion.getIsisMapa().getMap().setCenter (new OpenLayers.LonLat(puntoNumeroCuentaUTE.x,puntoNumeroCuentaUTE.y).transform(
        view.setCenter(ol.proj.transform([x, y], "EPSG:4326", IsisSesion.getIsisMapa().getMap().getView().getProjection()))
    //    
    //        var zoom = 15;
    //        if(this.isisMapa.getMap().getZoom()>7){
    //            zoom = this.isisMapa.getMap().getZoom();
    //        }
    //        this.isisMapa.getMap().setCenter (new OpenLayers.LonLat(x,y).transform(
    //            new OpenLayers.Projection("EPSG:4326"),
    //            this.isisMapa.getMap().getProjectionObject()), zoom);
    },
    centrarMapaEnTodosLosPuntos: function (x,y){
        try{
            var layerExtent = this.layer_poligonos.getSource().getExtent();
            IsisSesion.getIsisMapa().getMap().getView().fitExtent(layerExtent, IsisSesion.getIsisMapa().getMap().getSize());

        //            var bound = IsisUtils.getBoundsOfGeometryArray(this.layer_poligonos.features);
        //            IsisSesion.getIsisMapa().getMap().zoomToExtent(bound);           
            
            
        //this.marcadores.mostrarTodosLosMarcadores();
        }catch(err){   
        }
    },
    resetearMarcadores: function (){
        // FIXME: No se agegaron marcadores por ahora
        // 
       // this.marcadores.limpiarMarcadores();        
    }
}




