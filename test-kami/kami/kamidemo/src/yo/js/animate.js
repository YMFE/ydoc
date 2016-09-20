var PageTransitions = (function() {

    var $main = $('#main'),
        $pages = $main.children('.page'),
        $iterate = $('#iterateEffects'),
        $outClass = $('#outClass'),
        $inClass = $('#inClass'),
        animcursor = 1,
        pagesCount = $pages.length,
        current = 0,
        isAnimating = false,
        endCurrPage = false,
        endNextPage = false;

    function init() {

        $pages.each(function() {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'));
        });

        $pages.eq(current).addClass('current');

        $iterate.on('click', function(e) {
            if(isAnimating) {
                return false;
            }
            if( $outClass.val()=='' && $inClass.val() == '' ){
                return false;    
            }
            nextPage($outClass.val(),$inClass.val());
        });

    }

    function nextPage(outClass,inClass) {
        if(isAnimating) {
            return false;
        }

        isAnimating = true;
        
        var $currPage = $pages.eq(current);

        if(current < pagesCount - 1) {
            ++current;
        } else {
            current = 0;
        }

        var $nextPage = $pages.eq(current).addClass('current');
        
        if(outClass != ''){
            $currPage.addClass(outClass).css('z-index','2').on("webkitAnimationEnd animationEnd", function() {
                $currPage.off("webkitAnimationEnd animationEnd");
                $currPage.css('z-index','0');
                endCurrPage = true;
                //if(endNextPage) {
                    onEndAnimation($currPage, $nextPage);
                //}
            });
        }
        
        if(inClass != ''){
            $nextPage.addClass(inClass).on("webkitAnimationEnd animationEnd", function() {            
                $nextPage.off("webkitAnimationEnd animationEnd");
                endNextPage = true;
                //if(endCurrPage) {
                    onEndAnimation($currPage, $nextPage);
                //}
            });
        }

    }

    function onEndAnimation($outpage, $inpage) {
        endCurrPage = false;
        endNextPage = false;
        resetPage($outpage, $inpage);
        isAnimating = false;
    }

    function resetPage($outpage, $inpage) {
        $outpage.attr('class', $outpage.data('originalClassList'));
        $inpage.attr('class', $inpage.data('originalClassList') + ' current');
    }
    
    return { init : init };

})();