//http://cssmenumaker.com/menu/slabbed-accordion-menu#
( function( $ ) {
$( document ).ready(function() {
    //custom part start
    //fill the menu :)
    var menu = $("#cssmenu ul");
    for(var i = 0; i < mainMenu.childs.length; i+= 1 ){
        var n = createNode(mainMenu.childs[i]);
        menu.append(n);
    }

    function createNode(elem){
        "use strict";
        if(!elem.childs || elem.childs.length === 0){
            return $("<li><a href='"+elem.link+"'><span>"+elem.name+"</span></li>");
        }
        var node = $("<li class='has-sub'><a href='#'><span>"+elem.name+"</span></a></li>");
        var ul = $("<ul></ul>");
        for(var i = 0; i < elem.childs.length; i+=1){
            var li = createNode(elem.childs[i]);
            if( i === elem.childs.length -1){
                li.addClass("last");
            }
            ul.append(li);
        }

        node.append(ul);
        return node;
    }

    //custom part end
    function unfoldMenu(){
        $(this).removeAttr('href');
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp();
        }
        else {
            element.addClass('open');
            element.children('ul').slideDown();
            element.siblings('li').children('ul').slideUp();
            element.siblings('li').removeClass('open');
            element.siblings('li').find('li').removeClass('open');
            element.siblings('li').find('ul').slideUp();
        }
    }
    $('#cssmenu li.has-sub>a').on('click', unfoldMenu);

	$('#cssmenu>ul>li.has-sub>a').append('<span class="holder"></span>');

	(function getColor() {
		var r, g, b;
		var textColor = $('#cssmenu').css('color');
		textColor = textColor.slice(4);
		r = textColor.slice(0, textColor.indexOf(','));
		textColor = textColor.slice(textColor.indexOf(' ') + 1);
		g = textColor.slice(0, textColor.indexOf(','));
		textColor = textColor.slice(textColor.indexOf(' ') + 1);
		b = textColor.slice(0, textColor.indexOf(')'));
		var l = rgbToHsl(r, g, b);
		if (l > 0.7) {
			$('#cssmenu>ul>li>a').css('text-shadow', '0 1px 1px rgba(0, 0, 0, .35)');
			$('#cssmenu>ul>li>a>span').css('border-color', 'rgba(0, 0, 0, .35)');
		}
		else
		{
			$('#cssmenu>ul>li>a').css('text-shadow', '0 1px 0 rgba(255, 255, 255, .35)');
			$('#cssmenu>ul>li>a>span').css('border-color', 'rgba(255, 255, 255, .35)');
		}
	})();

	function rgbToHsl(r, g, b) {
	    r /= 255, g /= 255, b /= 255;
	    var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h, s, l = (max + min) / 2;

	    if(max == min){
	        h = s = 0;
	    }
	    else {
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max){
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }
	    return l;
	}
});
} )( jQuery );
