/**
 * Created by panda on 27/04/2015.
 */

function CreateFct(node){
    "use strict";
    return function(){
        CreateMenu(node);
    };
}

function CreateMenu(node){
    "use strict";
    if(node.link !== ""){
        window.location.href = node.link;
    }

    $("#mainMenu").html("");

    for(var i = 0; i < node.childs.length; i+=1){
        var elem = $("<div class='menuGame'>"+node.childs[i].name+"</div>");
        elem.click(CreateFct(node.childs[i]));
        $("#mainMenu").append(elem);
    }

    var ret = $("<div class='menuReturn'>Return</div>");
    if(node.parent === null){
        ret.addClass("menuReturnDisabled");
    } else {
        ret.click(CreateFct(node.parent));
    }
    $("#mainMenu").append(ret);

}
(function(){
    "use strict";
    CreateMenu(mainMenu);
})();