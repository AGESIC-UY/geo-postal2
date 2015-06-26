<%-- 
    Document   : index
    Created on : 19/03/2015, 08:21:11 AM
    Author     : Diego.Gonzalez
--%>
<!DOCTYPE html>
<% String version = "?NoVersion=201410071152";%>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Geopostal</title>

        <script type="text/javascript" src="js/libs/pace.js<%=version%>"></script>


        <link rel="stylesheet" href="js/libs/pace.css" type="text/css">
        <!-- Bootstrap -->
        <link href="js/bootstrap-3.3.4/css/bootstrap.min.css" rel="stylesheet">

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

        <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>


        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <!-- Include all compiled plugins (below), or include individual files as needed -->
        <link rel="stylesheet" href="http://openlayers.org/en/v3.3.0/css/ol.css" type="text/css">
        <link href="css/geopostal.css" rel="stylesheet">

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script type="text/javascript" src="js/libs/jquery-ui.js<%=version%>"></script>


        <script type="text/javascript" src="js/libs/jquery.nicescroll.min.js<%=version%>"></script>
        <script src="js/bootstrap-3.3.4/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/libs/proj4js-compressed.js<%=version%>"></script>
        <!--<script src="http://openlayers.org/en/v3.3.0/build/ol.js" type="text/javascript"></script>-->
        <script type="text/javascript" src="js/libs/proj4js-compressed.js<%=version%>"></script>
        <script type="text/javascript" src="js/libs/ol-debug.js<%=version%>"></script>
        <script type="text/javascript" src="js/libs/url.min.js<%=version%>"></script>


        <script type="text/javascript" src="js/libs/ol3-layerswitcher.js<%=version%>"></script>

        <link rel="stylesheet" href="js/libs/ol3-layerswitcher.css" type="text/css">

        <script type="text/javascript" src="js/libs/Bandoneon.js<%=version%>"></script>  
        <script type="text/javascript" src="js/libs/Interface.js<%=version%>"></script>        
        <script type="text/javascript" src="js/isis/IsisPanel.js<%=version%>"></script>        
        <script type="text/javascript" src="js/isis/IsisHistorialBusquedaEspecifica.js<%=version%>"></script>       
        <script type="text/javascript" src="js/isis/IsisResultado.js<%=version%>"></script>       
        <script type="text/javascript" src="js/isis/IsisBusquedaEspecifica.js<%=version%>"></script>       
        <script type="text/javascript" src="js/isis/IsisMapa.js<%=version%>"></script>        
        <script type="text/javascript" src="js/isis/IsisConfiguracion.js<%=version%>"></script>        
        <script type="text/javascript" src="js/isis/IsisUtils.js<%=version%>"></script>    
        <script type="text/javascript" src="js/isis/IsisCapaMarcadores.js<%=version%>"></script>       
        <script type="text/javascript" src="js/isis/IsisExt.js<%=version%>"></script>        
        <script type="text/javascript" src="js/isis/IsisSesion.js<%=version%>"></script>
        <script type="text/javascript" src="js/isis/IsisPlugins.js<%=version%>"></script>        
        <script type="text/javascript" src="js/isis/IsisVisualizador.js<%=version%>"></script> 

        <script type="text/javascript" src="js/libs/fakeLoader.min.js<%=version%>"></script>
        <script type="text/javascript" src="js/libs/ripple.js<%=version%>"></script>
        <link href="css/fakeLoader.css" rel="stylesheet">

    </head>
    <body> 
        <div id="fakeLoader"></div>
        <div id="message" >
            <div id="title">
                TITULO
            </div>
            <div id="text">
                TEXTO
            </div>
        </div>

        <div class="modalScreen" > </div>
        <div id="loader" >
            <div class="spinner">
                <div class="doublebounce1"></div>
                <div class="doublebounce2"></div>
            </div>
            <div style="float:left; margin-left: 16px; margin-top: 5px;">
                Cargando...
            </div>
        </div>

        <div id="resJson" style="display: none"></div>  

        <div id="wrapper" style="overflow:hidden">
            <div id="mapContainer" >
                <div id="mapHUD">
                    <a href="#menu-toggle" id="menu-toggle">
                        <img src="css/images/menu_button.png" style="margin-top: -3px;"/>
                    </a> 
                </div>
                <div id="map">  </div>
            </div>
        </div>


        <script>         
            $(document).on('click touchstart', '#menu-toggle', function (e){
                $("#wrapper").toggleClass("menuClosed");
                return false;
            })
            $($(".ol-unselectable.ol-control.layer-switcher li.group ul")[1]).sortable();
            //            $($(".ol-unselectable.ol-control.layer-switcher li.group")[1]).sortable();
            //            
            //            $("#menu-toggle").click(function(e) {
            //                e.preventDefault();
            //                $("#wrapper").toggleClass("menuClosed");
            //                return false;
            //            });
            
            
            
            
      

        </script>


        <script type="text/javascript">
            $("#fakeLoader").fakeLoader({
                timeToHide:1200, //Time in milliseconds for fakeLoader disappear
                zIndex:"999",//Default zIndex
                spinner:"spinner7",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'
                bgColor:"#ffffff" //Hex, RGB or RGBA colors
            });
            
            
            

            //            var map = new ol.Map({
            //                target: 'map',
            //                layers: [
            //                    new ol.layer.Tile({
            //                        source: new ol.source.MapQuest({layer: 'sat'})
            //                    })
            //                ],
            //                view: new ol.View({
            //                    center: ol.proj.transform([-6567849.956803141, -4300621.372044271, -5788613.521250226, -3439440.0607312606], 'EPSG:900913', 'EPSG:900913'),
            //                    zoom: 4
            //                })
            //            });


        </script>

    </body>
</html>

