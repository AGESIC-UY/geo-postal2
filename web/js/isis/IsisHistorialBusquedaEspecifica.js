/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function IsisHistorialBusquedaEspecifica(json, etiqueta){
    this.json = json;
    this.etiqueta = etiqueta;
}


IsisHistorialBusquedaEspecifica.prototype = {
    getEtiqueta: function(){
        return this.etiqueta;
    },
    getJson: function(){
        return this.json;
    }
}

