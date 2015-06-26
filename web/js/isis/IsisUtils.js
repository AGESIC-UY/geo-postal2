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
 * Clase Utils
 */
IsisUtils.scripts = [];

function IsisUtils() {
}

navigator.sayswho = (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\  .\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M;
})();


/**
 * Retorna el bound de un array de geometrias 
 */
IsisUtils.getBoundsOfGeometryArray = function (featureArray){
    var bound = featureArray[0].geometry.getBounds();
    for (var i = 1; i < featureArray.size(); i ++ ){
        bound = IsisUtils.getBoundsOfBounds(bound, featureArray[i].geometry.getBounds());
    }
    return bound;
   
}

IsisUtils.normalizeScale = function (scale) {
    var normScale = (scale > 1.0) ? (1.0 / scale) 
    : scale;
    return normScale;
};

IsisUtils.getScaleFromResolution = function (resolution) {
    var scale;
    if (resolution) {
        scale = 1 / (resolution * 39.37 *72);   
        if(scale < 1){
            scale = 1/scale;
        }
    }
    return scale;
};



IsisUtils.getResolutionFromScale = function (scale) {
    var resolution;
    if (scale) {
        
        var normScale = IsisUtils.normalizeScale(scale);
        resolution = 1 / (normScale * 39.37 *72);        
        
    }
    return resolution;
};


IsisUtils.getResolutionFromScaleInDegrees = function (scale) {
    var resolution;
    if (scale) {
        
        var normScale = IsisUtils.normalizeScale(scale);
        resolution = 1 / (normScale * 4374754 *72);        
    }
    return resolution;
};

/**
 * Retonra el bound que envuelve a los 2 pasados por parametro
 */
IsisUtils.getBoundsOfBounds = function (a,b){
    var bottom = Math.min(a.bottom, b.bottom);
    var left = Math.min(a.left, b.left);
    var right = Math.max(a.right, b.right);
    var top = Math.max(a.top, b.top);
    return new OpenLayers.Bounds(left, bottom, right, top);
}


/**
 * Funciones estaticas para acceder a la configuración
 */
/**
 *  Muestra un mensaje en caso que el browser no sea recomendado.
 **/
IsisUtils.comprobarBrowser = function(){
    if(BrowserDetect.browser == "Explorer" && (BrowserDetect.version == "6" || BrowserDetect.version == "5.5")){
        alert("El visualizador no funciona correctamente con Internet Explorer 5.5 y 6.\nRecomendamos: Firefox, Chrome, IE7+.");
    }    
    else if (BrowserDetect.browser != "Explorer"  && BrowserDetect.browser != "Firefox" && BrowserDetect.browser != 'Chrome'){  
        alert("El visualizador no ha sido testeado en este navegador.\nRecomendamos: Firefox, Chrome, IE7+.");
    }
}

/**
 *  Obtiene el valor de un parametro dentro de la URL
 */
IsisUtils.obtenerParametroDeUrl = function (url, parametro){
    var aux = url.split(parametro + "=");
    if(aux!= url && aux != undefined){
        toRet = aux[1].split("&")[0];
        toRet = decodeURIComponent(toRet, "UTF-8" );
        return toRet;
    }else{
        return null;
    }
}

/**
 * Carga un javascript FIXME: Agregar un parametro para que cachee
 */
IsisUtils.loadScript  = function (url, callback) {
    if (IsisUtils.scripts[url.trim()] == undefined){
        IsisUtils.scripts[url.trim()] = 1;
        var finalUrl = url;
        if (url.indexOf("?") != -1){
            // Ya tiene parametros
            finalUrl = finalUrl + "&NoVersion=" + IsisConfiguracion.getVersion();
        }else{
            // No tiene parametros
            finalUrl = finalUrl + "?NoVersion=" + IsisConfiguracion.getVersion();
        }
        // adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = finalUrl;

        // then bind the event to the callback function 
        // there are several events for cross browser compatibility
        if(callback != undefined){
            script.onreadystatechange = callback;
            script.onload = callback;
            script.onReadyStateChange = callback;
            script.onLoad = callback;
        }
        
        // fire the loading
        head.appendChild(script);
    }else{
        if(callback!=undefined){
            callback();
        }
    }
}
    
IsisUtils.loadScriptNoRefresh = function(url, callback){
    var finalUrl = url;
    // adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = finalUrl;

    // then bind the event to the callback function 
    // there are several events for cross browser compatibility
    script.onreadystatechange = callback;
    script.onload = callback;
    script.onReadyStateChange = callback;
    script.onLoad = callback;

    // fire the loading
    head.appendChild(script);
}

/**
 * Carga varios javascripts
 */
IsisUtils.loadScripts = function (urls, callback){
    if (urls.length == 0){
        if(callback!=undefined){
            callback();
        }
    }else{
        
        if (urls.length == 1){
            IsisUtils.loadScript(urls[0], callback);
        }else{
            var url = urls[0];
            urls.splice(0, 1);
            IsisUtils.loadScript(url, IsisUtils.loadScripts(urls, callback));
        }
    }
}

/**
 * Carga un css
 */
IsisUtils.loadStyle = function (url) {
    // adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('link');
    script.rel="stylesheet";
    script.type="text/css";
    script.href=url;
    // fire the loading
    head.appendChild(script);
}  

IsisUtils.transformPoint = function(latitud, longitud, source, destination, callback){
    $.ajax({
        url: IsisConfiguracion.getHostAnubis() + '/ws/transformPoint',
        method: 'GET',
        data: {    
            "latitud": latitud,
            "londitud": longitud,
            "srid_source": source,
            "srid_destination": destination
        }
    }).fail(function(){
        
        }).done(function (msg){
        callback(msg);
    });
    
}


IsisUtils.obtenerParametroDeURL = function (name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * Detector de browsers
 * 
 */
var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
        || this.searchVersion(navigator.appVersion)
        || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++)	{
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
    {
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    },
    {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    },
    {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
    },
    {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
    },
    {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
    },
    {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
    },
    {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    },
    {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
    },
    {		// for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
    },
    {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
    },
    {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    },
    { 		// for older Netscapes (4-)
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
    }
    ],
    dataOS : [
    {
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    },
    {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
    },
    {
        string: navigator.userAgent,
        subString: "iPhone",
        identity: "iPhone/iPod"
    },
    {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
    }
    ]

};
BrowserDetect.init();