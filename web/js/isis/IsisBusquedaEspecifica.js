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
 * En esta clase se encuentra la logica de las busquedas especificas, junto con 
 * los eventos de hacer click en el resultado de la busqueda.
 */

function IsisBusquedaEspecifica() {
    this.actualizarFormularioDeBusqueda();
    this.resultado_busqueda = null;
    this.capa_resultado_busqueda = null;
    this.isisResultado = null;
    this.historial = [];
    this.busquedaActivaIndex = -1;
    this.acordeon = "";
}

IsisBusquedaEspecifica.prototype = {
    actualizarFormularioDeBusqueda : function (){
        var numCapas = IsisSesion.getIsisCAPAS().capas.length;
        // Es el combo que se despliega para ver los distintos formultarios
        var combo = "<select id='comboBusqueda' onChange='IsisBusquedaEspecifica.cambioSeleccionComboBusqueda();'> <option value='null'>[Seleccione una capa]</option>";
        // Es un hash que contiene los formularios de cada capa (sin los filtros), la clave es el nombre para mostrar
        var hashBusquedasCapas = [];
        // Es un hash que contiene, para cada capa, el conjunto de ids que hay que modificar cuando se agregue el formulario de filtro
        var hashCapasFiltro = [];
        for(var i = 0; i<numCapas; i++){ // Se itera en todas las capas para generar los formularios (sin filtros)
            var capa = IsisSesion.getIsisCAPAS().capas[i];
            var nombreCapa = capa.Tabla;  
            var nombreMostrar = capa.Nombre; 
            var soloBuscable = capa.soloBuscable;
            var buscable = capa.buscable;            
            // Se agrega el item al combo
            if(buscable || soloBuscable){
                combo += " <option value='"+nombreCapa+"' >"+nombreMostrar+"</option>";
            }
            var formularioCapa = "<div id='fieldSetResultado"+nombreMostrar+"'><table>";
            var campos_busqueda = [];  // Aca se van a guardar los ids a reemplazar
            // Se recorren todos los campos para agregarlos al formulario
            var hayBusqueda = false;
            for(var j=0;j<capa.campos.length;j++){ 
                var esLista = false;
                var campo = capa.campos[j]; 
                if((campo != null) && (campo.Etiqueta!= "")){
                    if (campo.CriterioBusqueda == "Ninguno"){
                        formularioCapa += "<tr style='display:none'><td>" + campo.Etiqueta + "</td> <td><input class='x-form-text x-form-field' id='"+ IsisBusquedaEspecifica.generarEtiquetaParaCampo(nombreCapa, campo.Etiqueta, false)+"'/> </td></tr>";            
                    }else if(campo.CriterioBusqueda == "Lista"){
                        hayBusqueda = true;
                        esLista = true;
                        formularioCapa += "<tr> <td> "+ decodeURIComponent(campo.lista, "UTF-8" )+" </td></tr>";                               
                    }
                    else{
                        hayBusqueda = true;
                        var input = "<a class='info'><input placeholder='"+campo.Etiqueta+"' class='x-form-text x-form-field' id='"+ IsisBusquedaEspecifica.generarEtiquetaParaCampo(nombreCapa, campo.Etiqueta, false)+"' title='Criterio: " +IsisBusquedaEspecifica.generarEtiquetaAPartirDeTipo(campo.CriterioBusqueda) +"' />  </a> ";
                        formularioCapa += "<tr><td> "+input+" </td></tr>";           
                    }
                    // Se agrega el id, para que despues se reemplace si se utiliza el formulario como formulario de filtro
                    campos_busqueda.push(IsisBusquedaEspecifica.generarEtiquetaParaCampo(nombreCapa, campo.Etiqueta, esLista));
                }
            }
            hashCapasFiltro[nombreMostrar] = campos_busqueda;
            if(!hayBusqueda){
                formularioCapa += "<p>No hay búsquedas disponibles para esta capa.</p>"
            }
            formularioCapa +="</table></div>"; 
            hashBusquedasCapas[nombreMostrar] = formularioCapa;
            
        }
        combo += "</select>"; // Se termina el combo
        // Es el formulario final, donde se van a agregar todos los formularios con los filtros 
        var formularioDeBusqueda = "<form id='formBusquedaEspecifica'> <div class='scrollableDiv'>"; 
        // Se recorren nuevamente las capas para generar generar los formularios con los filtros
        for(i = 0; i<numCapas; i++){
            capa = IsisSesion.getIsisCAPAS().capas[i];
            nombreCapa = capa.Tabla;  
            nombreMostrar = capa.Nombre;
            soloBuscable = capa.soloBuscable;
            buscable = capa.buscable;           
            if(buscable || soloBuscable){ 
                formularioDeBusqueda += "<div id='divForm"+nombreMostrar.replace(/ /g, '')+"' style='display: none'>";
                formularioDeBusqueda += hashBusquedasCapas[nombreMostrar];
                if(capa.filtros.length>0){                
                    formularioDeBusqueda += "</br><p>FILTROS:</p>";                
                    for(var f= 0; f<capa.filtros.length; f++){
                        var formularioFiltros = hashBusquedasCapas[capa.filtros[f]];
                        var campos_ = hashCapasFiltro[capa.filtros[f]];
                        for(var t=0; t<campos_.length;t++){
                            formularioFiltros = formularioFiltros.replace(campos_[t],nombreMostrar +"---" + campos_[t]);
                        }
                        formularioDeBusqueda += "<fieldset id='fieldSet" + capa.filtros[f] + "' class='fieldSetResultado'><legend> " + capa.filtros[f] +"</legend>";
                        //formularioDeBusqueda += hashBusquedasCapas.get(capa.filtros[p]).replace('fieldSetBusqueda', 'fieldSetFiltro');
                        formularioDeBusqueda += formularioFiltros.replace('fieldSetResultado', 'fieldSetFiltro');
                        formularioDeBusqueda += "</fieldset>";
                    }               
                }
                formularioDeBusqueda += "</div>";
            }
        }
        formularioDeBusqueda+="<button type='button' id='buscar' class='buttonSave' onClick='IsisSesion.getIsisBusquedaEspecifica().generarBusquedaJSON()'>Buscar</button> </div></form>";
        var contenidoBusqueda = "<fieldset class='fieldSetResultado'> <legend> " + combo +"</legend>" + formularioDeBusqueda + "</fieldset>";
        IsisSesion.getIsisExt().refreshBusquedaPanel(contenidoBusqueda);
    }, 
    generarBusquedaJSON: function(){
        var list = document.getElementById("comboBusqueda");
        if(list[list.selectedIndex].value !='null'){
            var capa = IsisBusquedaEspecifica.getCapaByNombre(list[list.selectedIndex].value);
        }
        var numCapas = IsisSesion.getIsisCAPAS().capas.length;
        var consulta = null;
        var nombreCapa = capa.Tabla;
        var numCampos = capa.campos.length;
        var campos = capa.campos;
        var etiquetaHistorial = "<b>" + capa.Nombre.toUpperCase() + "</b>" + "<br>";
        for(var j=0;j<numCampos;j++){  
            var campo = campos[j];
            if(campo != null && campo.Etiqueta!= ""){
                if(campo.CriterioBusqueda == "Lista"){
                    var etiqueta = "combo_" + nombreCapa+"_"+ campo.Etiqueta;
                    var elemento = document.getElementById(etiqueta);
                    if( elemento.value != null && elemento.value!= "" && elemento.value != "null" ){
                        var valor = '"Valor":"'+ encodeURIComponent(elemento.value)+'","Criterio":"Igual"';
                        consulta = IsisBusquedaEspecifica.agregarCampo(consulta, nombreCapa, campo.NombreColumna, valor);
                        etiquetaHistorial += "&nbsp&nbsp" + campo.Etiqueta.toUpperCase() + ": " + elemento.value.toUpperCase() + "<br>";
                    }
                }
                else{
                    var etiqueta = IsisBusquedaEspecifica.generarEtiquetaParaCampo(nombreCapa, campo.Etiqueta, false);
                    var elemento = document.getElementById(etiqueta);
                    if(elemento.value != null && elemento.value!= ""){
                        var valor = '"Valor":"'+ encodeURIComponent(elemento.value)+'","Criterio":"'+campo.CriterioBusqueda+'"';
                        consulta = IsisBusquedaEspecifica.agregarCampo(consulta, nombreCapa, campo.NombreColumna, valor);
                        etiquetaHistorial += "&nbsp&nbsp" + campo.Etiqueta.toUpperCase() + ": " + elemento.value.toUpperCase() + "<br>";
                    }
                }                    
            }
        }
        var consulta_filtros = null;
        if(capa.filtros.length > 0){
            for(var p= 0; p<capa.filtros.length; p++){   
                for(var i = 0; i<numCapas; i++){
                    var capa_aux = IsisSesion.getIsisCAPAS().capas[i];
                    var capa_filtro=null;
                    if(capa_aux.Nombre == capa.filtros[p]){
                        capa_filtro = capa_aux;
                        break;
                    }                    
                }
                var nombreCapaFiltro = capa_filtro.Tabla;
                var numCamposFiltro = capa_filtro.campos.length;
                var camposFiltro = capa_filtro.campos;
                for(var j=0;j<numCamposFiltro;j++){  
                    var campoFiltro = camposFiltro[j];
                    if(campoFiltro != null && campoFiltro.Etiqueta!= ""){
                        if(campoFiltro.CriterioBusqueda == "Lista"){
                            var etiqueta = capa.Nombre + "---" + "combo_" + nombreCapaFiltro+"_"+ campoFiltro.Etiqueta;
                            var elemento = document.getElementById(etiqueta);
                            if( elemento.value != null && elemento.value!= "" && elemento.value != "null" ){
                                var valor = '"Valor":"'+ encodeURIComponent(elemento.value)+'","Criterio":"Igual"';
                                consulta_filtros = IsisBusquedaEspecifica.agregarCampo(consulta_filtros, nombreCapaFiltro, campoFiltro.NombreColumna, valor);
                            }
                        }
                        else{
                            var etiqueta = capa.Nombre + "---"+ IsisBusquedaEspecifica.generarEtiquetaParaCampo(nombreCapaFiltro, campoFiltro.Etiqueta, false);
                            var elemento = document.getElementById(etiqueta);
                            if(elemento.value != null && elemento.value!= ""){
                                var valor = '"Valor":"'+ encodeURIComponent(elemento.value)+'","Criterio":"'+campoFiltro.CriterioBusqueda+'"';
                                consulta_filtros = IsisBusquedaEspecifica.agregarCampo(consulta_filtros, nombreCapaFiltro, campoFiltro.NombreColumna, valor);
                            }
                        }                    
                    }
                }
            }  
        }
        //    }
    
        if(consulta == null && consulta_filtros == null){
            IsisSesion.getIsisExt().mostrarMensaje('Búsqueda Específica', 'No hay campos especificados para la búsqueda.');
            return;
        }        
        
        var json='{"perfil":"'+ IsisSesion.getIsisPerfil() + '" ,"consultas":[';
        if(consulta != null){
            for(var capa2 in consulta){
                json += '{"NombreCapa":"'+capa2+'","consultaCampos":[';
                for(var campo2 in consulta[capa2]){
                    json +='{"NombreCampo":"'+campo2+'",'+consulta[capa2][campo2]+'},';
                }
                json = json.substring(0, json.length -1);
                json += ']';
            }    
        }else if(consulta_filtros!=null){
            json += '{"NombreCapa":"'+nombreCapa+'","consultaCampos":[';       
            json += ']';
            json+=', "filtros":['
            if(capa.filtros.length > 0){
                if(consulta_filtros != null){
                    for(var capa3 in consulta_filtros){
                        json += '{"NombreCapa":"'+capa3+'","consultaCampos":[';
                        for(var campo3 in consulta_filtros[capa3]){
                            json +='{"NombreCampo":"'+campo3+'",'+consulta_filtros[capa3][campo3]+'},';
                        }
                        json = json.substring(0, json.length -1);
                        json += ']},';
                    }  
                    json = json.substring(0, json.length -1);            
                }
            }   
            json += ']';
        }
    
        if(consulta != null){
            json+=', "filtros":['
            if(capa.filtros.length > 0){
                if(consulta_filtros != null){
                    for(var capa3 in consulta_filtros){
                        json += '{"NombreCapa":"'+capa3+'","consultaCampos":[';
                        for(var campo3 in consulta_filtros[capa3]){
                            json +='{"NombreCampo":"'+campo3+'",'+consulta_filtros[capa3][campo3]+'},';
                        }
                        json = json.substring(0, json.length -1);
                        json += ']},';
                    }  
                    json = json.substring(0, json.length -1);            
                }
            }           
            json += ']';
        }   
    
        json += '}]}';
        
        //if(primerBusqueda==undefined){   
        this.busquedaActivaIndex =  this.historial.length;
        this.historial.push(new IsisHistorialBusquedaEspecifica(json, etiquetaHistorial));
        //}
        this.ejecutarBusquedaFromJson(json);
        
          
           
    },
    ejecutarBusquedaFromJson: function (json){
        IsisSesion.getIsisExt().mostrarLoader("Buscando...");
        $.ajax({
            timeout: 100000000000000000,
            url: IsisConfiguracion.getHostAnubis() + '/busquedaEspecifica.jsf',
            method: 'GET',
            data: {
                campos: json
            }
        }).fail(function(){
            IsisSesion.getIsisExt().mostrarMensaje('Error', 'Ocurrió un error y no fue posible completar el pedido.');
        }).done(function (msg){
            $('#resJson').html(msg);  
            var inner = $('#jsonBusqueda').html();
            
            var res = $.parseJSON(inner);
            if(res.error==0){                
                IsisSesion.isisBusquedaEspecifica.resultado_busqueda = res.resultado;   
                IsisSesion.isisBusquedaEspecifica.capa_resultado_busqueda = res.capa;
                IsisSesion.isisBusquedaEspecifica.recargarResultados(res.capa, res.resultado);
            //                var hash = $H(res.resultado);
            //                IsisSesion.isisBusquedaEspecifica.resultado_busqueda = hash;   
            //                IsisSesion.isisBusquedaEspecifica.capa_resultado_busqueda = res.capa;
            //                IsisSesion.isisBusquedaEspecifica.recargarResultados(res.capa, hash);
            }	
        });
    },
    
    historialEliminadoEvent : function(index){
        var thiz = IsisSesion.getIsisBusquedaEspecifica();
        thiz.historial.splice(index, 1);
        if (thiz.busquedaActivaIndex == index){
            thiz.busquedaActivaIndex = -1;
        }else{
            if (thiz.busquedaActivaIndex > index){
                thiz.busquedaActivaIndex --;
            }
        }
        document.getElementById('contenedorHistorialBusquedasEspecificas').innerHTML = thiz.generarFieldSetHistorial();
    },
    historialSeleccionadoEvent : function(index){
        IsisSesion.getIsisBusquedaEspecifica().busquedaActivaIndex = index;
        var busqueda= IsisSesion.getIsisBusquedaEspecifica().historial[index];
        IsisSesion.getIsisBusquedaEspecifica().ejecutarBusquedaFromJson(busqueda.getJson());
    //buscarDIR(busqueda.dpto, busqueda.loc, busqueda.calle, busqueda.num, null,false);

    } ,

    limpiarResultadosEvent : function(){
        IsisSesion.getIsisBusquedaEspecifica().busquedaActivaIndex = 0;
        IsisSesion.getIsisBusquedaEspecifica().historial = [];
        document.getElementById('contenedorHistorialBusquedasEspecificas').innerHTML = "";

    },
    generarFieldSetHistorial : function (){
        var toReturn = "";
        if (this.historial.length>0){   
            toReturn += "<fieldset class='fieldSetBusquedasEspecificasAnteriores'> <legend> Historial de búsquedas</legend> ";  
            toReturn += "<div stlye='clear:both' align='right'> <button type='button' id='limpiarHistorialBusquedasEspecificasButton' class='buttonlimpiar' onClick='IsisSesion.getIsisBusquedaEspecifica().limpiarResultadosEvent()'>Borrar Historial</button></div> <table>";  
            for (var j = 0; j < this.historial.length; j++){
                var checked = "";
                if (j == this.busquedaActivaIndex ){
                    checked = "checked";
                }   
                toReturn += '<tr><td><input type="radio" name="historialBusquedaEspecificaDireccionGrupo" value="'+j+'" '+checked+' onclick="IsisSesion.getIsisBusquedaEspecifica().historialSeleccionadoEvent('+j+')"> <p class="etiquetaHistorialBusqueda">' +this.historial[j].getEtiqueta() + ' </p></td> <td> <a href="javascript:IsisSesion.getIsisBusquedaEspecifica().historialEliminadoEvent('+j+');"><div class="borrarDivButton"></div></a></td></tr>';
            }
            toReturn += "</table></fieldset>";
        }
        return toReturn;
    },
    agregarBotonResultados: function(){
        $("#resultadobusqueda").html($("#resultadobusqueda").html() + "<div stlye='clear:both' align='right'> <button type='button' id='limpiarButton' class='buttonlimpiar' onClick='IsisSesion.getIsisBusquedaEspecifica().limpiarResultados()'>Limpiar Resultados</button></div>"+        
            "<div stlye='clear:both' align='right'><p stlye='float:right'> <label for='mostrartodos'>Mostrar todos</label> <input type='checkbox' id='mostrartodos' name='mostrartodos' onclick='IsisSesion.getIsisBusquedaEspecifica().mostrarTodos();'/> </p> </div>");
        
    },
    recargarResultadoCapa: function(nombrecapa, resultado_b, tamanio){
        var ids = [];
        for (var name in resultado_b){
            ids.push(name);
        } 
        var acordeon ="";
        if (ids.length == 0){
            // Se agrega en el panel de busqueda que no hay rsutlados
            var resultados = "<fieldset class='fieldSetResultado'> <legend> Resultados </legend> No se encontraron resultados </fieldset>";       
            resultados +=	"<div id='contenedorHistorialBusquedasEspecificas' style='padding:0px;'> ";
            resultados += this.generarFieldSetHistorial() + "</div>"; 
            $("#resultadobusqueda").html(resultados);
            IsisSesion.getIsisExt().ocultarLoader();
            return "";
        }
        
        var capaecontrada = IsisBusquedaEspecifica.getCapaByNombre(nombrecapa);
	
        var resultados = "<fieldset class='fieldSetResultado'> <legend> "+ capaecontrada.Nombre +" </legend> "
        var paraAcordeon = "<ul>";    
        
        var etiqueta;
        var numEtiqueta = 1;        
        for(var i=tamanio; i<ids.length; i++){
            // Para todos los resultados, se agregan al mapa, y se agregan al panel
            paraAcordeon += "<li><ul>";
            var id = i;
            var nombre = resultado_b[ids[id]].nombre;
            if(this.resultado_busqueda[ids[id]].capa!=null)
                this.isisResultado.agregarResultados(resultado_b[ids[id]]);	
            if(resultado_b[ids[id]].nombre == "" ){
                etiqueta = "Resultado " + numEtiqueta;
                numEtiqueta++;
            }else{
                etiqueta = resultado_b[ids[id]].nombre;
            }
            paraAcordeon += "<li><a href='#' onclick='IsisSesion.getIsisBusquedaEspecifica().seleccionarResultado("+id+"); return false;' class='resultadoLink' style='float:rigth'>"+ etiqueta +"</a><li>";
            if(resultado_b[id].cp!=0)
                paraAcordeon +=	"<li><label class='tabbedItem'>C&oacute;digo Postal: </label><b>"+this.resultado_busqueda[id].cp+"</b></li>";
            var hpropiedades = resultado_b[ids[id]].propiedades;
            for(var prop in hpropiedades){
                if(prop!="color"){
                    var valor = hpropiedades[prop];
                    if(valor == "null"){
                        valor = "";
                    }
                    var label =IsisBusquedaEspecifica.getCampoByNombre(capaecontrada,prop);
                    if(label==null)
                        label = prop;
                    else
                        label = label.Etiqueta;
                    if(label=="")
                        label = prop;
                    paraAcordeon +="<li><label class='tabbedItem'>"+label+":</label> "+ valor +"</li>";

                }
            }
            
       
            paraAcordeon += "</ul></li>";
        }
        paraAcordeon +=	"</ul> ";
        resultados += paraAcordeon;
        resultados += " </fieldset><div id='contenedorHistorialBusquedasEspecificas' style='padding:0px;'> ";
        
        acordeon += "<div><div class='bendoneonHeader'> <div style='color: #00A3E2; display:inline-block;'>+</div> " + capaecontrada.Nombre + "</div> <div class='beandoneonContnet' style='display:none'><div>"+ paraAcordeon +"</div></div></div>";

        
        resultados += this.generarFieldSetHistorial() + "</div>"; 
        $("#resultadobusqueda").html($("#resultadobusqueda").html() + "</br>" +resultados);

        for (var i=0; i<ids.length; i++){
            this.seleccionarResultado(ids[i]);
        } 
        
        return acordeon;
    },
    recargarResultados: function (nombrecapa, hash){
        if (this.isisResultado == null){
            this.isisResultado = new IsisResultado(IsisSesion.getIsisMapa(), IsisSesion.getIsisBusquedaEspecifica().GenPopText);
        }
        this.isisResultado.resetearResultados();
        //Agrega el resultado de una capa
        $("#resultadobusqueda").html("");
        this.agregarBotonResultados();
        this.recargarResultadoCapa(nombrecapa, hash, 0);
        
        this.isisResultado.centrarMapaEnTodosLosPuntos();
        IsisSesion.isisPlugins.setUltimoPluginActivo(null);
        IsisSesion.getIsisExt().ocultarLoader();
    },    
    seleccionarResultado: function(id) {
        var elemento = this.resultado_busqueda[id];
        this.isisResultado.agregarMarcador(elemento.x,elemento.y);
        this.isisResultado.centrarMapaEnPunto(elemento.x, elemento.y);
    },
    mostrarTodos: function (){
        // var ids = this.resultado_busqueda.keys();
        this.isisResultado.resetearMarcadores();
        if($("#mostrartodos").is(":checked")){
            for(var i in this.resultado_busqueda){
                var elemento = this.resultado_busqueda[i];
                this.isisResultado.agregarMarcador(elemento.x,elemento.y);
                
            }
            this.isisResultado.centrarMapaEnTodosLosPuntos();
        }else{
            this.seleccionarResultado(0);
        }
    },
    GenPopText: function(evt){
        var campos = null;
        var capaecontrada = IsisBusquedaEspecifica.getCapaByNombre(IsisSesion.isisBusquedaEspecifica.capa_resultado_busqueda);
        campos = $H(evt.feature.attributes._object);
        var temstr = "";
        temstr+="<div class='popUp'><fieldset>";
        temstr+="<legend class='title'><b>Búsqueda</b></legend>";
        //    var f = $H(evt.feature.attributes);
        var keys = campos.keys();
        for(var i=0; i<keys.length; i++){
            var key = keys[i];
            var campo = key;
            var texto = campos.get(key);
        
            if((campo != "Código Postal" || texto != "0")&& texto!="null")
            {
                var label = campo;
                if(capaecontrada!=null){
                    label =IsisBusquedaEspecifica.getCampoByNombre(capaecontrada,campo);
                    if(label==null)
                        label = campo;
                    else
                        label = label.Etiqueta;
                    if(label=="")
                        label = campo;
                }
                temstr += "<p class='subtitle'><b>" + label + "</b>: <span class='value'>" + texto + "</span></p>"; 
            }
        }
        temstr+="</fieldset></div>";
    
        var X = evt.feature.geometry.getCentroid().x;
        var Y = evt.feature.geometry.getCentroid().y;
        var lonlat = new OpenLayers.LonLat(X,Y);
        IsisSesion.getIsisMapa().getMap().addPopup(new OpenLayers.Popup.FramedCloud(
            "",        
            lonlat,
            null,
            temstr,
            null,
            true
            ));
    },
    limpiarResultados: function (){
        if (this.isisResultado != null){
            this.isisResultado.resetearResultados();
        }
        this.busquedaActivaIndex = -1;
        this.resultado_busqueda = null;
        var resultados =	"<div id='contenedorHistorialBusquedasEspecificas' style='padding:0px;'> ";
        resultados += this.generarFieldSetHistorial() + "</div>"; 
        $("#resultadobusqueda").html(resultados);
    //$("resultadobusqueda").innerHTML = ""; 
    }
}

/**
 * Manejador del evento onchange del combo que selecciona el formulario
 **/
IsisBusquedaEspecifica.cambioSeleccionComboBusqueda = function()
{
    document.getElementById('formBusquedaEspecifica').reset();
    var list = document.getElementById("comboBusqueda");
    var numCapas = IsisSesion.getIsisCAPAS().capas.length;   
    for(var i = 0; i<numCapas; i++){
        var capa = IsisSesion.getIsisCAPAS().capas[i];
        //divForm
        
        var idSet = "divForm"+capa.Nombre;
        idSet = idSet.replace(/ /g, '');
        var fieldset = document.getElementById(idSet);
        if(fieldset != null){
            fieldset.style.display="none";                
        }  
    }    
    if(list[list.selectedIndex].value !='null'){
        var idFieldSet = "divForm"+list[list.selectedIndex].text.replace(/ /g, '');
        fieldset = document.getElementById(idFieldSet);
        if(fieldset != null){
            fieldset.style.display="block";         
        } 
    }
}

/**
 * Funciones auxiliares
 */
IsisBusquedaEspecifica.agregarCampo = function(consulta, capa, campo, valor){
    if(consulta==null){
        consulta = {};
    }
    if(consulta.hasOwnProperty(capa)){
        consulta[capa][campo] = valor;
    }else{
        consulta[capa] = {};
        consulta[capa][campo] = valor;
    }
    return consulta;
}

/**
 * Devuelve la estructura de IsisCapas que esta en sesión para la capa con el 
 * nombre pasado por parametro.
 */ 

IsisBusquedaEspecifica.getCapaByNombre = function(nombreCapa){    
    for(var i=0; i< IsisSesion.getIsisCAPAS().capas.length;i++){
        if(IsisSesion.getIsisCAPAS().capas[i].Tabla == nombreCapa){
            return IsisSesion.getIsisCAPAS().capas[i];
        }
    }    
    return null;
}

IsisBusquedaEspecifica.getCampoByNombre = function(capa, nombreCampo){    
    for(var i=0; i< capa.campos.length;i++){
        if(capa.campos[i].NombreColumna == nombreCampo){
            return capa.campos[i];
        }
    }    
    return null;
}


IsisBusquedaEspecifica.generarEtiquetaParaCampo = function(capa, campo, esLista){
    if(esLista){
        return "combo_" + capa + "_" + campo;
    }
    else{
        return capa + "---" + campo;
    }
}

IsisBusquedaEspecifica.generarEtiquetaAPartirDeTipo = function (tipo){
    if (tipo = "Like"){
        return "Parecido";
    }
    else{
        return tipo;
    }
}

IsisBusquedaEspecifica.recargarBusquedaEsp = function(){
    if (IsisSesion.isisBusquedaEspecifica.isisResultado == null){
        IsisSesion.isisBusquedaEspecifica.isisResultado = new IsisResultado(IsisSesion.getIsisMapa(), IsisSesion.getIsisBusquedaEspecifica().GenPopText);
    }
    IsisSesion.isisBusquedaEspecifica.isisResultado.resetearResultados();
    IsisSesion.isisBusquedaEspecifica.resultado_busqueda = null;
    if(IsisSesion.isisBusquedaEspecifica.resultado_busqueda_barra.length>0){
        IsisSesion.isisBusquedaEspecifica.agregarBotonResultados();
    }
    IsisSesion.isisBusquedaEspecifica.acordeon = "<div id='bandoneonId'>";
    IsisSesion.isisBusquedaEspecifica.resultado_busqueda_barra.forEach(function(item) {
        var hash = item.resultado;
        var tamanioRes = 0;
        if(IsisSesion.isisBusquedaEspecifica.resultado_busqueda != null){
            tamanioRes = IsisSesion.isisBusquedaEspecifica.resultado_busqueda.length;
            var t= tamanioRes;
            //IsisSesion.isisBusquedaEspecifica.resultado_busqueda.update(hash); //IsisSesion.isisBusquedaEspecifica.resultado_busqueda = 
            hash.each(function(item) {
                IsisSesion.isisBusquedaEspecifica.resultado_busqueda.set(t, item[1]);
                t++;                        
            });
        }
        else{
            IsisSesion.isisBusquedaEspecifica.resultado_busqueda = hash;
        }
                   
        IsisSesion.isisBusquedaEspecifica.capa_resultado_busqueda = item.capa;
        IsisSesion.isisBusquedaEspecifica.acordeon += IsisSesion.isisBusquedaEspecifica.recargarResultadoCapa(item.capa, IsisSesion.isisBusquedaEspecifica.resultado_busqueda, tamanioRes);
    });
    IsisSesion.isisBusquedaEspecifica.acordeon += "</div>";           
    IsisSesion.isisBusquedaEspecifica.isisResultado.centrarMapaEnTodosLosPuntos();    
}

IsisBusquedaEspecifica.busquedaBarra = function (camposBarra, callback){
    /*
    var json='{"perfil":"'+ IsisSesion.getIsisPerfil() + '" ,"consultas":[';
    var primeraConsulta=true;
    for(var i=0; i< IsisSesion.getIsisCAPAS().capas.size();i++){
        if(IsisSesion.getIsisCAPAS().capas[i].templateBusqueda != undefined && IsisSesion.getIsisCAPAS().capas[i].templateBusqueda != ""){
            var capa = IsisSesion.getIsisCAPAS().capas[i];
            var buscarTemplate = capa.templateBusqueda.split(',');
            var numbuscarTemplate = buscarTemplate.size();
            var nombreCapa = capa.Tabla;
            var numCampos = capa.campos.size();
            var campos = capa.campos;
            var consulta = null;
            
            for(var k=0; k < numbuscarTemplate && k < camposBarra.size() ;k++){
                var nomCampo=buscarTemplate[k];                
                for(var j=0;j<numCampos;j++){  
                    var campo = campos[j];
                    if(campo != null && campo.NombreColumna == nomCampo){
                        if(campo.CriterioBusqueda == "Lista"){                            
                            var valor = '"Valor":"'+ encodeURIComponent(camposBarra[k])+'","Criterio":"Igual"';
                            consulta = IsisBusquedaEspecifica.agregarCampo(consulta, nombreCapa, campo.NombreColumna, valor);                           
                        }
                        else{                            
                            var valor = '"Valor":"'+ encodeURIComponent(camposBarra[k])+'","Criterio":"'+campo.CriterioBusqueda+'"';
                            consulta = IsisBusquedaEspecifica.agregarCampo(consulta, nombreCapa, campo.NombreColumna, valor);                           
                        } 
                        break;
                    }                    
                }
            }  
            if(consulta != null){
                if(primeraConsulta){ 
                    primeraConsulta=false;
                }else{
                    json+=",";
                }
                for(var capa2 in consulta){
                    json += '{"NombreCapa":"'+capa2+'","consultaCampos":[';
                    for(var campo2 in consulta[capa2]){
                        json +='{"NombreCampo":"'+campo2+'",'+consulta[capa2][campo2]+'},';
                    }
                    json = json.substring(0, json.length -1); 
                    json += ']';
                    json+=', "filtros":[]'; 
                    json += '}';
                }                 
            } 
        }        
    }  
    json+= "]}";
    */
    var consultaCampos ="";
    var primero = true;
    for(var i=0; i<camposBarra.length; i++){
        if(!primero){
            consultaCampos+=",";
        }
        else{
            primero = false;
        }
        consultaCampos+='"'+camposBarra[i]+'"';       
    }
   
    $.ajax({
        url: IsisConfiguracion.getHostAnubis() + '/busquedaEspecificaBarra.jsf',
        method: 'GET',
        timeout: 100000000000000000,
        data: {
            campos: '{"perfil" : "' + IsisSesion.getIsisPerfil() + '"' + ' , "camposValores": [' + consultaCampos + ']}'
        }
    }).fail(function(){
        IsisSesion.getIsisExt().mostrarMensaje('Error', 'Ocurrió un error y no fue posible completar el pedido.');
    }).done(function (msg){  
        $('#resJson').html(msg);
        var inner = $('#jsonBusqueda').html();
        var res = $.parseJSON(inner);
        IsisSesion.isisBusquedaEspecifica.resultado_busqueda_barra = res.respuesta;
        IsisSesion.isisPlugins.setUltimoPluginActivo(null);
        barraBusquedaDIRPlugin.retorno();
    });   
}

