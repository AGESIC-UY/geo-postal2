/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * @description Constructor del panel
 * @param parent: IsisPanel padre, si es null se agrega el contenido al root
 * @param title: Titulo que se mostrara en la barra
 * @param htmlContent: String con el contenido en html que se pondra en la barra.
 */

// Se crea la estructura inicial de la barra lateral

IsisPanel.rootNode = null;
IsisPanel.idGen = 0;
IsisPanel.panels = [];

function IsisPanel(id, parent ,title, htmlContent){
    if (id == null){
        this.id = IsisPanel.idGen;
        IsisPanel.idGen ++;
    }else{
        this.id = id;
    }
    IsisPanel.panels.push(this);
    this.parent = parent;
    this.title = title;
    this.htmlContent = htmlContent;
    if (htmlContent == null || htmlContent == 'undefined'){
        this.htmlContent = "";    
    }
    this.onExpandCallback = null;
    this.doLayout();
}


IsisPanel.getPanelById = function(id){
    var toRet = null;
    $.each(IsisPanel.panels, function (index, value){
        if (value.id == id){
            toRet = value;
        }
    });
    return toRet;
}



IsisPanel.BarClickedEvent = function(object, panelId){
    //e.preventDefault();
    IsisPanel.getPanelById(panelId).toogle();
    // $(e).parent().children('.accordeon-content').toggle( "blind" );
    return false;
}



IsisPanel.prototype = {
    /**
     * @description Genera el html a mostrar y se lo agrega al padre
     * @returns Algo
     */
    doLayout : function (){
        var htmlContent = "<div id='isisPanel"+this.id+"'class='accordeon-item'><div class='accordeon-title' onclick='IsisPanel.BarClickedEvent(this,\""+this.id+"\")'><div class='title-content'>"+this.title + "</div><div class='close-button'></div></div><div class='accordeon-content'>"+this.htmlContent+"</div></div>" ;
        if (IsisPanel.rootNode == null){
            $("#wrapper").append("<div id='sidebar'><div id='sidebar-content'><div class='accordeon'></div></div></div>");
            IsisPanel.rootNode = $("#wrapper").find(".accordeon");
        }
        var rootN = IsisPanel.rootNode;
        if (this.parent != null){
            rootN = this.parent.getHtmlContentObject();
        }
        rootN.html( htmlContent + rootN.html());
        $('#isisPanel' + this.id + ".accordeon-item > .accordeon-content ").hide();
    },
    addChild : function (isisPanelChild){
        isisPanelChild.parent = this;
        isisPanelChild.doLayout();
    },
    expand : function (){
        
        this.getHtmlContentObject().show();
        if (this.onExpandCallback != null){
            this.onExpandCallback();
        }
        $('#isisPanel' + this.id + ".accordeon-item").addClass("open-item");
        setTimeout(function(){  $('#sidebar-content').getNiceScroll().resize(); }, 650);
    },
    collapse : function (){
        $('#isisPanel' + this.id + ".accordeon-item > .accordeon-content ").hide();
        $('#isisPanel' + this.id + ".accordeon-item").removeClass("open-item");
       
        setTimeout(function(){  $('#sidebar-content').getNiceScroll().resize(); }, 650);
    }, 
    toogle : function (){
        if (  $('#isisPanel' + this.id + ".accordeon-item > .accordeon-content ").is(":hidden")){
            if (this.onExpandCallback != null){
                this.onExpandCallback();
            }
        }
        $('#isisPanel' + this.id + ".accordeon-item > .accordeon-content ").slideToggle("blind");
        $('#isisPanel' + this.id + ".accordeon-item").toggleClass("open-item");
        setTimeout(function(){  $('#sidebar-content').getNiceScroll().resize(); }, 650);
        
        
    },
    onExpand : function (callback){
        this.onExpandCallback = callback;
    },
    replaceContent : function (htmlContent){
        $('#isisPanel' + this.id + ".accordeon-item > .accordeon-content ").html(htmlContent);
    },
    appendContent : function (htmlContent){
        getHtmlContentObject().html(getHtmlContentObject().html() + htmlContent);
    },
    getHtmlContentObject : function (){
        return $('#isisPanel' + this.id + ".accordeon-item > .accordeon-content ");
    }
}








