/* 
 * CopyLeft Geomatica
 * 
 * FORMATO: 
 *     <div id="idBandoneon">
        <div>
             <div> Header </div>
             <div> Content </div>
        </div>
        <div>
             <div> Header </div>
             <div> Content </div>
        </div>
        <div>
             <div> Header </div>
             <div> Content </div>
        </div>         
    </div>
 */


function Bandoneon(idBandoneon){
    var cssChilds = " #" + idBandoneon + " > div > div";
    var divsChilds= $(cssChilds);
    for (var i=0; i< divsChilds.length; i++){
            var element1 = divsChilds[i];
        if (i % 2 == 0){
            // Es header
            $(element1).click(function(){
                    BandoneonClicked(this);
                
            });
        }else{
            element1.childNodes[0].style.maxHeight = (screen.height - 500) + "px";
            element1.childNodes[0].style.width = "100%";
            element1.childNodes[0].style.overflow = "auto";
        }
    }
}

function BandoneonClicked(divClicked){
    var cssChilds = " #" + divClicked.parentNode.parentNode.id + " > div > div" ;
    var divsChilds= $(cssChilds);
    var divClickedIndex = -1;
    for (var i=0; i< divsChilds.length; i++){
        if (i % 2 == 0){
            // Es header
            if (divsChilds[i] == divClicked){
                divClickedIndex = i+1;
            } 
        }else{
            // Es contenido
            if (i == divClickedIndex){
                // Es el contenido seleccionado
//                if(divsChilds[i].visible()){
//                    divsChilds[i].hide("blind");
//                }else{
//                    divsChilds[i].show("blind");
//                }
                $(divsChilds[i]).toggle("blind");
            }else{
                // No es el contenido seleccionado 
                divsChilds[i].hide("blind");
            }            
        }
    }
}

