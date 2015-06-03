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
 * Clase IsisExt
 */

function IsisExt() {   
    this.myMask = null;
    this.busquedaPanel = null;
    this.ayudaPanel = null;
    this.tabPanel = null;
    this.menuPanel = null;
    this.mapPanel = null;
    this.instructivoPanel = null;
        
    this.plugins = [];
    this.plugInMappanel = [];
    this.plugInTabpanel = [];
    this.plugInBusquedas = [];
    this.mostrandoLoader = false;
}

IsisExt.prototype = {
    /**
     * Muestra el spinner junto con el mensaje pasado por parametro
     */

    mostrarLoader: function(mensaje) {
        if(!this.mostrandoLoader){
            $("#loader").toggleClass("active");
            this.mostrandoLoader = true;
        }
    },
    /**
     * Oculta el spinner
     */
    ocultarLoader: function() {
        if (this.mostrandoLoader){
            $("#loader").toggleClass("active");
            this.mostrandoLoader = false;
        }
        
    },
    /**
     * Muestra una ventana de mensaje, con el titulo y mensaje pasados por
     * parametro
     */
    mostrarMensaje:function(titulo, mensaje){
        if (this.mostrandoLoader){
            this.ocultarLoader();
        }
        var closeButton = "<div style='clear:both'/><div style='  padding-top: 10px;  text-align: center;'><button onclick='IsisSesion.getIsisExt().ocultarMensaje()'> Aceptar </button></div>";
        $("#message #text").html(mensaje + closeButton );
        $("#message #title").html(titulo);
        var marginLeft = -($("#message").width() /2);
        $('#message').css('margin-left', marginLeft + "px");
        var marginTop = -($("#message").height() /2);
        $('#message').css('margin-top', marginTop  + "px");
        $("#message").addClass("active"); 
    },
    
    ocultarMensaje:function(){
        $("#message").removeClass("active"); 
        
    },
    
    /**
     * Inicializa el map panel 
     **/
    inicializarMapPanel: function (mapa){  // FIXME: ver si se puede cambiar a inicializarComponentes
        
        
    },
    
    /**
     * Inicializa los componentes basicos de EXT
     */
    inicializarComponentes: function (mapa){
        var contactoPanel = new IsisPanel ("contacto", null, "Contacto", null);
        var ayudaPanel = new IsisPanel("ayudaPanel", null, "Ayuda", null );
        htmlNavegacion = "<div id='ayudaDiv' style='width:100%;'><table><tr><td><b>Desplazamiento</b></td></tr><tr><td><p>Para desplazarse sobre el mapa haga clic sobre <img src='/IsisVisualizador/resources/images/mover.png'/>  y luego arrastre el mapa moviendo el mouse.</p></td></tr><tr><td><img src='/IsisVisualizador/resources/images/ayuda_mover.png' style='max-width:230px;' ></td></tr><tr><td><b>Zoom</b></td></tr><tr><td><p> Para realizar zoom haga clic en <img src='/IsisVisualizador/resources/images/zoom.png'/> o mantenga presionada la tecla SHIFT y haga clic sobre el mapa para dibujar el área objetivo.</p></td></tr><tr><td><img src='/IsisVisualizador/resources/images/ayuda_zoom.png' style='max-width:230px;' ></td></tr></table></div>";
        var navegacionPanel = new IsisPanel (null, ayudaPanel, "Navegacion", htmlNavegacion);
        var instructivoPanel = new IsisPanel (null, ayudaPanel, "Instructivo", "Descargue el instructivo <a href='/IsisVisualizador/resources/docs/Instructivo.pdf' target='_blank'>aqu&iacute;</a> </br>");
        var herramientasPanel = new IsisPanel ("herramientas", null, "Herramientas", null);
        var busquedaPanel = new IsisPanel ("busquedas", null, "Búsquedas", null);
        var panelBusqeudaEspecifica = new IsisPanel("busquedaEspecifica", busquedaPanel, "Búsqueda específica", "<div id='busquedaPanel'></div>");
//        
//  
//        this.tabPanel = new Ext.TabPanel({
//            region:"center",
//            id: "tabPanel",
//            xtype: 'tabpanel',
//            activeTab: 0,      // First tab active by default
//            /* TABS */
//            items: [{
//                /* Busquedas */                    
//                title:"Búsquedas",
//                region: "east",
//                width: 350,
//                /*height: 300,*/
//                layout: {                
//                    type: 'accordion',
//                    titleCollapse: true,
//                    animate: true,
//                    activeOnTop: false,
//                    animCollapse: true
//                },
//                id: "busquedas",
//                xtype:'panel',
//                items: [this.busquedaPanel],
//                plugins: this.plugInBusquedas,
//                listeners: {
//                    tabchange: function(tabPanel, tab) {
//                        // Esto se agrega para arreglar el problema que no se ven 
//                        // algunas pestañas hasta que se hace resize del browser
//                        IsisSesion.getIsisExt().menuPanel.doLayout();                     
//                    }
//                }
//            },
//            {
//                id:"herramientas",
//                title: 'Herramientas',                    
//                headerAsText : false,
//                header: false,
//                floatable: false,
//                xtype: 'panel',
//                split: true,
//                collapsible: true,
//                region: "east",
//                width: 350,           
//                /*  height: 300,*/
//                headers:false,
//                layout: {                
//                    type: 'accordion',
//                    titleCollapse: true,
//                    animate: true,
//                    activeOnTop: false,
//                    animCollapse: true
//                },
//                items: [], 
//                plugins: this.plugins
//            },
//            {
//                id:"ayuda",
//                title: 'Ayuda',
//                headerAsText : false,
//                header: false,
//                floatable: false,
//                xtype: 'panel',
//                split: true,
//                collapsible: true,
//                region: "east",
//                width: 350,           
//                /* height: 300,*/
//                headers:false,
//                layout: {                
//                    type: 'accordion',
//                    titleCollapse: true,
//                    animate: true,
//                    activeOnTop: false,
//                    animCollapse: true
//                },
//                items: panelesDeAyuda
//            }            
//            ],
//            listeners: {
//                tabchange: function() {
//                    // Esto se agrega para arreglar el problema que no se ven 
//                    // algunas pestañas hasta que se hace resize del browser
//                    IsisSesion.getIsisExt().menuPanel.doLayout();                     
//                }
//            },
//            plugins: this.plugInTabpanel
//        });
//        
//        
//        
//        this.menuPanel = new Ext.Panel({
//            /* MENU */
//            region: "east",
//            id: "menu",
//            collapsible: true,
//            collapsed: true,
//            titleCollapse: true,   
//            width: 350,
//            /* height: 300,*/
//            border: false,
//            layout: 'fit',
//            listeners: {
//                expand: function() {
//                    // Esto se agrega para arreglar el problema que no se ven 
//                    // algunas pestañas hasta que se hace resize del browser
//                    IsisSesion.getIsisExt().menuPanel.doLayout();                     
//                }
//            },
//            items: [this.tabPanel]
//        });
//        new Ext.Viewport({
//            layout: "border",
//            items: [ 
//            this.mapPanel, 
//            this.menuPanel]
//        });
       
    },
    /**
     * Retorna el Panel del mapa
     **/
    getMenu: function(){
        return this.menuPanel;
    },
    /**
     * Retorna el tab Panel del menu
     **/
    getTabPanel: function(){
        return this.tabPanel;
    },
    /*
     * Agrega el contenido pasado por parametro al panel de busqueda
     */
    refreshBusquedaPanel : function (contenido){ // FIXME: Alguna de las dos de abajo esta al pedo
        // Se diferencia el caso en el que se haya hecho una busqueda, para no eliminar los resultados anteriores
        if ($("#busquedaEPanelDiv").length != 0){
            // Ya se realizo una búsqueda
            $("#busquedaEPanelDiv").html(contenido);       
        }else{
            // Nunca se realizo una búsqueda
            $("#busquedaPanel").html("<div id='busquedaEPanelDiv'>"+contenido+"</div><div id='resultadobusqueda'></div>");       
        }
//        this.busquedaPanel.doLayout();
//        Ext.getCmp("busquedas").doLayout();
    }, 
    /**
     * Abre el menu, en la pestaña indicada por posicion
     */
    abrirMenu: function (posicion){
        $("#wrapper").removeClass("menuClosed");
    },
    /**
     * Agrega el logo
     */
    agregarLogo : function (){
        // Logo del Correo
        var divLogoCorreo = document.createElement("div");
        divLogoCorreo.id = 'divLogoCorreo';
        divLogoCorreo.style.cursor = 'pointer';
        divLogoCorreo.onclick = function() {
            window.open("http://www.correo.com.uy")
        }
        document.getElementsByTagName("body")[0].appendChild(divLogoCorreo);
    },
    
    getMapPanel: function (){
        return this.mapPanel;
    }
};



