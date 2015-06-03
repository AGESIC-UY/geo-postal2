/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
IsisCapaMarcadores.PIN_UTE = IsisConfiguracion.getHost() + '/geopostal/resources/images/pin_ute.png';
IsisCapaMarcadores.PIN_DIRECCION = IsisConfiguracion.getHost() + '/geopostal/resources/images/blue_pin.png';



function IsisCapaMarcadores(pin, width, height) {
    this.pin = pin;
    this.width = width;
    this.height = height;
    this.inicializarCapas();
}

function featureSeleccionada(){
    alert('Seleccionado');
}

function featureSelectedEvent(evt) {
    alert('Seleccionado');
}


IsisCapaMarcadores.prototype = {
    inicializarCapas : function(){
        this.sourceLayer = new ol.source.Vector({
            //create empty vector
            });
        
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 1.0,
                src: 'css/images/correo_pin.png'
            }))
        }); 
        this.vectorLayer = new ol.layer.Vector({
            source: this.sourceLayer ,
            style: iconStyle
        });
        IsisSesion.getIsisMapa().getMap().addLayer(this.vectorLayer);
    },
    limpiarMarcadores : function (){
        IsisSesion.getIsisMapa().getMap().removeLayer(this.vectorLayer);
        this.inicializarCapas();        
    },
    agregarMarcador: function(x, y){
        var iconFeature = new ol.Feature({
            geometry: new  
            ol.geom.Point(ol.proj.transform([x, y], "EPSG:4326", IsisSesion.getIsisMapa().getMap().getView().getProjection())),
            name: 'Punto: [' + x + ", " + y + "]",
            population: 4000,
            rainfall: 500
        });
        
        this.sourceLayer.addFeature(iconFeature);
        
        
        
        
//        var point = new OpenLayers.Geometry.Point(x,y).transform(
//            new OpenLayers.Projection("EPSG:4326"),
//            IsisSesion.getIsisMapa().getMap().getProjectionObject());
//        var pointFeature = new OpenLayers.Feature.Vector(point,null,this.style_mark);
//        this.vectorLayer.addFeatures([pointFeature]);    
//        this.vectorLayer.events.on({
//            "featureselected":function (e){
//                alert('hola');
//            }
//        });
    },
    getMarcadoresLayer: function(){
        return this.vectorLayer;
    },
    mostrarTodosLosMarcadores: function(){
        //FIXME: Agregar esta parte
        var cantidad = this.sourceLayer.getFeatures().length;
        var puntos = new Array();
        
        var mPoint = new ol.geom.MultiPoint([]);
        
        for (var i = 0; i < cantidad; i++){     
            mPoint.appendPoint(this.sourceLayer.getFeatures()[i].getGeometry());
//            puntos.push(this.vectorLayer.features[i].geometry);
        }
       // var geometria = new OpenLayers.Geometry.MultiPoint(puntos);
//        IsisSesion.getIsisMapa().getMap().zoomToExtent(mPoint.getExtent()); 
        var mapita = IsisSesion.getIsisMapa().getMap();
        mapita.getView().fitExtent(mPoint.getExtent(), mapita.getSize());
    }
    
    
    
    
}

