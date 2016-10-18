var EXAMPLE_MAX_HEIGHT = 98,
    DEFAULT_SHOW_PARAMS = 5;

$(document).ready(function() {
    // 导航
    $('.navbar-toggle').click(function(){
        $(this).next(".ydoc-nav").toggle();
    });

    $('.docs-sidenav li').click(function(e){
        $('.docs-sidenav li').removeClass('active');
        $(this).addClass('active');
    });

    $('.markdown-body pre').map(function(i,item){
        $(item).addClass('ydoc-example');
    });

    $('code').each(function(i, block) {
        if (block.innerHTML.indexOf('\n') != -1) {
            var pn = block.parentNode;
            if (pn.tagName.toUpperCase() == 'PRE') {
                try {
                    hljs.highlightBlock(block);
                } catch(e) {}
            } else {
                pn.innerHTML = '<pre><code>' + block.innerHTML + '</code></pre>';
                try {
                    hljs.highlightBlock(pn.childNodes[0].childNodes[0]);
                } catch(e) {}
            }
        }
    });

    var winHeight = $(window).height() - 44,
        sidebar = $('.docs-sidebar');
    var docSideNav = $('.docs-sidenav');
    var  ydocContainerCon= $('.ydoc-container-content');
    docSideNav.width(ydocContainerCon.width()*0.25);
    if (sidebar.height() > winHeight) {
        sidebar.css('max-height', winHeight + 'px');
        $('.docs-sidenav').css('max-height', winHeight + 'px');
        $('.docs-sidenav').css({'overflow-y':'scroll','overflow-x':'hidden'});
        var activeMenu,
            barScroll = false;

        sidebar.on('mouseover', function() {
            barScroll = true;
        });
        sidebar.on('mouseout', function() {
            barScroll = false;
        });
    };

    $(window).on('scroll', function(e) {
        if( $(this).scrollTop() >  ($('.footer').offset().top - $(window).height()) ){
            winHeight = $(window).height() - $('.footer').outerHeight()-44;
            sidebar.css('max-height', winHeight + 'px');
            $('.docs-sidenav').css('max-height', winHeight + 'px');
        }else{
            winHeight = $(window).height() - 44;
            sidebar.css('max-height', winHeight + 'px');
            $('.docs-sidenav').css('max-height', winHeight + 'px');
        }

        if (!barScroll) {
            var activeItem = $('.docs-sidebar li.active a');
            if (activeItem.length) {
                if (!activeMenu || (activeMenu.attr('href') != activeItem.attr('href'))) {
                    activeMenu = activeItem;
                    var top = activeMenu.offset().top - sidebar.offset().top;
                    if (top < 0) {
                        //sidebar.scrollTop(sidebar.scrollTop() + top);
                        $('.docs-sidenav').scrollTop($('.docs-sidenav').scrollTop() + top);
                    } else if (top > winHeight - 88) {
                        //sidebar.scrollTop(sidebar.scrollTop() + top - winHeight + 44);
                        $('.docs-sidenav').scrollTop($('.docs-sidenav').scrollTop() + top - winHeight + 88);
                    }
                }
            }
        }
    });

    // 退出全屏浏览器窗口大小改变，不触发resize
    $(window).on('resize', function(e){
        resizeSidebar();
    });
});


function resizeSidebar(){
    var winHeight = $(window).height() - 44,
        sidebar = $('.docs-sidebar');
    var docSideNav = $('.docs-sidenav');
    var  ydocContainerCon= $('.ydoc-container-content');
    docSideNav.width(ydocContainerCon.width()*0.25);
    if (sidebar.height() > winHeight) {
        sidebar.css('max-height', winHeight + 'px');
        $('.docs-sidenav').css('max-height', winHeight + 'px');
        $('.docs-sidenav').css({'overflow-y':'scroll','overflow-x':'hidden'});
        var barScroll = false;

        sidebar.on('mouseover', function() {
            barScroll = true;
        });

        sidebar.on('mouseout', function() {
            barScroll = false;
        });
        // scroll
        if( $(window).scrollTop() >  ($('.footer').offset().top - $(window).height()) ){
            winHeight = $(window).height() - $('.footer').outerHeight()-44;
            sidebar.css('max-height', winHeight + 'px');
            $('.docs-sidenav').css('max-height', winHeight + 'px');
        }else{
            winHeight = $(window).height() - 44;
            sidebar.css('max-height', winHeight + 'px');
            $('.docs-sidenav').css('max-height', winHeight + 'px');
        }
    }
}
