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


function IsisPlugins(PI){
    /**
     * Atributos
     */
    //    this.numPlugins = 0;
    this.PI = PI;
    this.scriptsPluginCargados = 0;
    this.isisPlugins = [];
    this.ultimoPluginActivo = null;
    
/**
     * Constructor //FIXME: Cambiar la forma en que se cargan los scripts
     */
//    this.numPlugins = PI.plugins.size();    
//    for(var i = 0; i< this.numPlugins; i++){
//        var plugin = PI.plugins[i];        
//        IsisUtils.loadScript("/IsisVisualizador/plugins/" + plugin, this.agregarPlugins);    
//    }
//    this.numPlugins = PI.plugins.size();    
    
}


IsisPlugins.prototype = {
    
    /*    cargarScripts : function (){
        for(var i = 0; i< this.PI.plugins.size(); i++){
            var plugin = this.PI.plugins[i];        
            IsisUtils.loadScript("/IsisVisualizador/plugins/" + plugin,this.agregarPlugins);
        }
    },*/
    cargarScripts : function (){
        IsisUtils.loadScripts(IsisSesion.getIsisPlugins().PI.plugins, IsisSesion.getIsisPlugins().agregarPlugins);
       
    },
    agregarPlugins :function(){
        var numPlugins = IsisSesion.getIsisPlugins().isisPlugins.length;
        if (numPlugins > IsisSesion.getIsisPlugins().scriptsPluginCargados){
            this.scriptsPluginCargados++;
        }else if(numPlugins == IsisSesion.getIsisPlugins().scriptsPluginCargados){
            if (numPlugins > 0){   
                for(var i = 0; i<numPlugins; i++){
                    var pi = IsisSesion.getIsisPlugins().isisPlugins[i];
                    pi[1].prototype.preInit();
                }
            }
        }    
    }, 
    agregarPluginsPostMapa : function (){
        for(var i = 0; i<this.isisPlugins.length; i++){
            var pi = this.isisPlugins[i];
//            Ext.getCmp(pi[0]).addPlugin(pi[1]);
            pi[1].prototype.init(IsisPanel.getPanelById(pi[0]));
        }
    },
    /**
     * Agrega el plugin a isisPlugins, recibe como parametro un array con el 
     * componente donde se va a agregar y el plugin ej: ["herramientas", coordinatesPlugin]
     */
    agregarPlugin : function (plugin){
        this.isisPlugins.push(plugin);
    },
    
    /**
     * Getters y setters
     **/
    getUltimoPluginActivo: function (){
        return  this.ultimoPluginActivo;
    },
    setUltimoPluginActivo: function (valor){
        this.ultimoPluginActivo = valor;
    }
}


/***
 * Descripcion de la interfaz de los plugins
 */

var IsisPlugin = new Interface('IsisPlugin', ['getURL', 'init', 'preInit']); // Init se ejecuta despues de cargar el mapa, pre init antes

/* AGREGA UN PLUGIN A UN COMPONENTE EXT LUEGO QUE EL MISMO FUE RENDERIZADO
 * LUEGO DE AGREGADO LLAMA INICIALIZA EL PLUGIN */
/*Ext.override(Ext.Component, {
    addPlugin: function(p) {        
        var plugin = p;//this.constructPlugin(p);
        
        //Nos aseguramos que implemente la interfaz de plugin para Isis.
        Interface.ensureImplements(plugin, IsisPlugin);
        
        this.plugins.push(plugin);
        //pluginInit could get called here but
        //the less use of private methods the better
        plugin.prototype.init(this);

        return plugin;
    }
});*/


