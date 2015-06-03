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
* Clase IsisVisualizador
*/

function IsisVisualizador() {
}

IsisVisualizador.prototype = {    
    }

IsisVisualizador.onReady = function (){
    IsisUtils.comprobarBrowser();
    IsisSesion.setIsisPerfil(IsisUtils.obtenerParametroDeUrl(document.URL, 'perfil'));
    if (IsisSesion.getIsisPerfil() == null){
        IsisSesion.setIsisPerfil('Default');
    } 
    $.ajax({
        url: IsisConfiguracion.getHostAnubis() + '/getplugins.jsf',
        method: 'GET',
        data: {
            perfil: IsisSesion.getIsisPerfil()
        }
    }).fail(function(){
        IsisSesion.getIsisExt().mostrarMensaje('Error', 'Ocurrió un error y no fue posible completar el pedido.');
    }).done(function (msg){
        IsisSesion.getIsisExt().agregarLogo();
        $('#resJson').html(msg);  
        var inner = $('#jsonRes').html();
        var PI = $.parseJSON(inner);
        IsisSesion.setIsisMapa(new IsisMapa(PI));
        IsisSesion.getIsisExt().inicializarMapPanel(IsisSesion.getIsisMapa());
        IsisSesion.setIsisPlugins(new IsisPlugins(PI));
        IsisSesion.getIsisPlugins().cargarScripts();
        /** Cargar capas según perfil **/
        $.ajax({
            url: IsisConfiguracion.getHostAnubis() + '/getcapas.jsf',
            data: {
                perfil: IsisSesion.getIsisPerfil()
            }, 
            method: 'GET'
        }).fail(function(){
            IsisSesion.getIsisExt().mostrarMensaje('Error', 'Ocurrió un error y no fue posible traer la información.');
        }).done(function(msg){
            $('#resJson').html(msg);  
            var inner = $('#jsonRes').html();
            IsisSesion.setIsisCAPAS($.parseJSON(inner));
            IsisVisualizador.cargarCapasAMapa();
            IsisSesion.getIsisExt().inicializarComponentes(IsisSesion.getIsisMapa());
            IsisSesion.setIsisBusquedaEspecifica(new IsisBusquedaEspecifica()); // Aca ya se genera el formulario 
                    
            // var visibilidades = IsisUtils.obtenerParametroDeUrl(document.URL, 'visibilidad');
            // if(visibilidades != null && visibilidades != ""){
            //    var array_visibilidades = decodeURIComponent(visibilidades, "UTF-8").evalJSON();  
            //      IsisSesion.getIsisMapa().setearVisibilidades(array_visibilidades);
            //  }
            IsisSesion.getIsisMapa().agregarControles();
            IsisSesion.getIsisPlugins().agregarPluginsPostMapa();
            $('#sidebar-content').niceScroll({
                styler:"fb",
                cursorcolor:"#2E2F33", 
                cursorborder:"1px solid #2E2F33", 
                cursoropacitymax: 0.6
            });
            //  IsisSesion.getIsisExt().agregarTootips();
            setTimeout(function(){
                hideFakeLoader();
            }, 0.5);
            ol.control.LayerSwitcher.refreshAvailable();
          
        });
    });
},

/**
*  Carga las capas que especificadas en IsisSesion.getIsisCAPAS() en el mapa
**/
IsisVisualizador.cargarCapasAMapa = function (){
    IsisSesion.getIsisMapa().getCapabilities();
    //var grupos = ["Politico", "Politico", "Territorios", "Territorios", "Territorios", "Territorios", "Politico", "Territorios", "Territorios", "Territorios", "Territorios", "Politico", "Territorios", "Territorios", "Territorios", "Territorios", "Politico", "Territorios", "Territorios", "Territorios", "Territorios"]
    var capasBases = IsisSesion.getIsisCAPAS().bases.reverse();
    for(var k = 0; k< capasBases.length; k++){
        IsisSesion.getIsisMapa().agregarCapasBase(capasBases[k].Etiqueta,capasBases[k].Capas);
    }
    for(var i = 0; i<IsisSesion.getIsisCAPAS().capas.length; i++){
        var capa = IsisSesion.getIsisCAPAS().capas[i];
        var nombreCapa = capa.Tabla;  
        var nombreMostrar = capa.Nombre; 
        var capaVisible = capa.Visible;
        var grupo = capa.grupo == null ? "" : capa.grupo ;
        var metadato = capa.metadato == null ? "" : capa.metadato ;
        var escalaMinima = capa.escalaMinima == null ? "" : capa.escalaMinima ;
        var escalaMaxima = capa.escalaMaxima == null ? "" : capa.escalaMaxima ;
        var buscable = capa.buscable;        
        SoloBuscable = capa.soloBuscable;
        if (SoloBuscable){
            IsisSesion.setCantiadadCapasSoloBuscables(IsisSesion.getCantiadadCapasSoloBuscables()+1);
        }else{
            IsisSesion.getIsisMapa().agregarCapa(nombreMostrar,nombreCapa,capaVisible, false, grupo, metadato, escalaMinima, escalaMaxima, buscable);            
        }
    }  
},



/**
* Esta función se llama desde el IsisMapa y es la encargada de generar el texto
* para el popup   FIXME: No me gusto mucho como queda esto aca
**/
IsisVisualizador.genPopTextWMS = function(result, evt){
    var temstr = "";
    var info = [];
    for (var i = 0, ii = result.length; i < ii; ++i) {

        var capa = null;
        //var texto = result[i].getId().replace(/.\d+/i, '');
        var texto = result[i].children[0].tagName.replace("visualizador:", "");
        var aux = IsisVisualizador.getCapaByNombre(texto);
        if(aux!=null){
            capa = aux;
            texto = capa.Nombre;
            temstr+="<div class='popUp'><fieldset>";
            temstr+="<legend class='title'><b>" + texto + "</b></legend>"; 
            var campos = null;
            if(capa!=null){
                campos = capa.campos;
            }
            if(capa.templatePopUp != undefined && capa.templatePopUp!=""){
                var desc = capa.templatePopUp;
                var hash = [];
                if(campos!=null){
                    for (var k = 0; k < result[i].children[0].children.length; k++){
                        var key = result[i].children[0].children[k];
                        var laKey = key.tagName.replace("visualizador:", "");
                        var valor = key.textContent;
                        hash[laKey] = valor;
                    }
                //                for(var key in evt.features[i].attributes){ 
                //                    var valor = evt.features[i].attributes[key];
                //                    hash[key] = valor;
                //                }                 
                }
                desc = IsisVisualizador.evaluarVariablesPopUp(desc, hash);
                temstr += desc;
            }else{
                if(campos!=null){
                    for (var k = 0; k < result[i].children[0].children.length; k++){
                        //  var
                        //for (var index in result[i].children[0].children){
                        var key = result[i].children[0].children[k];
                        var laKey = key.tagName.replace("visualizador:", "");
                        
                        //                    for(var key in result[i].getKeys()){ 
                        //var laKey = result[i].getKeys()[key];
                        var auxCampo = IsisVisualizador.getCampoByNombre(capa, laKey);            
                        if(auxCampo != null && auxCampo.Etiqueta!= "")
                        {
                            var valor = key.textContent;
                            if((valor == "null")||(valor == null)){
                                valor = "";
                            }
                            temstr += "<p class='subtitle'><b>" + auxCampo.Etiqueta + "</b>: <span class='value'>" + valor + "</span></p>";
                        }    
                    }                 
                }
            }  
            temstr+="</fieldset>";  
            temstr+="</div>";
            var coordinate = evt.coordinate;
            IsisSesion.getIsisMapa().content.innerHTML = temstr;
            IsisSesion.getIsisMapa().overlay.setPosition(coordinate);
            // Se cambia esto porque open layers crea el pop up como le pinta
            var marginTop = parseInt("-"+$("#popup").css("height"), 10);
            marginTop -= 11;
            $("#popup").css("margin-top", marginTop+"px");
            $("#popup").css("margin-left", "-50px");
            $("#popup").css("max-width", $(window).width() / 2 + "px");
            $("#popup").css("max-height", $(window).height() / 2 + "px");
        
            
        }
    }       
    
    return temstr;
}




/*
*  FUNCIONES AUXILIARES       
*/   
IsisVisualizador.evaluarVariablesPopUp = function(template, valores){
    var keys = Object.keys(valores);
    for(var x = 0; x<keys.length; x++ ){
        var aRemplazar = "<#"+keys[x]+">";
        var remplazo = valores[keys[x]];
        template = template.replace(aRemplazar,remplazo);
    }
    return template;
}


IsisVisualizador.getCapaByNombre = function(nombreCapa){    
    for(var i=0; i< IsisSesion.getIsisCAPAS().capas.length;i++){
        if(IsisSesion.getIsisCAPAS().capas[i].Tabla == nombreCapa){
            return IsisSesion.getIsisCAPAS().capas[i];
        }
    }    
    return null;
}

IsisVisualizador.getCampoByNombre = function(capa, nombreCampo){    
    for(var i=0; i< capa.campos.length;i++){
        if(capa.campos[i].NombreColumna == nombreCampo){
            return capa.campos[i];
        }
    }    
    return null;
}  

$( document ).ready(function() {
    IsisVisualizador.onReady();
});

