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

/* 
 * En esta clase se almacenan los atributos de la sesión, es decir todos los
 * atributos que son compartidos por diferentes partes del sistema, como por 
 * ejemplo el objeto IsisCapas que contiene las capas que se muestran junto
 * con sus configuraciones.
 */


function IsisSesion() {

}


IsisSesion.isisPerfil;

IsisSesion.isisPlugins;

IsisSesion.isisMapa;

IsisSesion.isisCAPAS;

IsisSesion.isisExt = new IsisExt();

IsisSesion.cantiadadCapasSoloBuscables = null;

IsisSesion.isisBusquedaEspecifica;


/**
 * Getters
 */
IsisSesion.getIsisPerfil = function(){
    if (IsisConfiguracion.getPublico()){
        return "Internet";    
    }else{
        return IsisSesion.isisPerfil;
    }
};

IsisSesion.getIsisPlugins = function(){
    return IsisSesion.isisPlugins;
};

IsisSesion.getIsisMapa = function(){
    return IsisSesion.isisMapa;
};

IsisSesion.getIsisCAPAS = function(){
    return IsisSesion.isisCAPAS;
};

IsisSesion.getIsisExt = function(){
    return IsisSesion.isisExt;
};

IsisSesion.getCantiadadCapasSoloBuscables = function(){
    return IsisSesion.cantiadadCapasSoloBuscables;
};

IsisSesion.getIsisBusquedaEspecifica = function(){
    return IsisSesion.isisBusquedaEspecifica;
};


/**
 * Setters
 */

IsisSesion.setIsisPerfil = function(valor){
    IsisSesion.isisPerfil = valor;
};

IsisSesion.setIsisPlugins = function(valor){
    IsisSesion.isisPlugins = valor;
};

IsisSesion.setIsisMapa = function(valor){
    IsisSesion.isisMapa = valor;
};

IsisSesion.setIsisCAPAS = function(valor){
    IsisSesion.isisCAPAS= valor;
};

IsisSesion.setIsisExt = function(valor){
    IsisSesion.isisExt = valor;
};

IsisSesion.setCantiadadCapasSoloBuscables = function(valor){
    IsisSesion.cantiadadCapasSoloBuscables = valor;
};

IsisSesion.setIsisBusquedaEspecifica = function(valor){
    IsisSesion.isisBusquedaEspecifica = valor;
};

