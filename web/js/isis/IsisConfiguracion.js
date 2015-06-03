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
 * Clase IsisConfiguracion
 */

function IsisConfiguracion() {

}

IsisConfiguracion.hostGeoServer = "/geoserver";
IsisConfiguracion.hostAnubis = "/Anubis";
IsisConfiguracion.hostGeonetwork = "/geonetwork";


/**
 * Funciones estaticas para acceder a la configuración
 */
IsisConfiguracion.getHost = function(){
    return window.location.protocol + "//"+window.location.hostname;
}
IsisConfiguracion.getHostGeoserver = function(){
    return IsisConfiguracion.getHost() + IsisConfiguracion.hostGeoServer;
}
IsisConfiguracion.getHostAnubis = function(){
    return IsisConfiguracion.getHost() + IsisConfiguracion.hostAnubis;
}
IsisConfiguracion.getHostGeonetwork = function(){
    return IsisConfiguracion.getHost() + IsisConfiguracion.hostGeonetwork;
}

IsisConfiguracion.getVersion = function(){
    return "201410071151";
}


IsisConfiguracion.getPublico = function(){
    return false;
}


//IsisConfiguracion.version = '1.0';



