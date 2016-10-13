var EXAMPLE_MAX_HEIGHT = 98,
    DEFAULT_SHOW_PARAMS = 5;

$(document).ready(function() {
    // 导航
    $('.navbar-toggle').click(function(){
        $(this).next(".ydoc-nav").toggle();
    });
  $('.docs-sidenav li').click(function(e){
    //   e.preventdefault();
    //   e.stopPropagation();
    //   var link = $(this).attr('href'),url = window.location.href;
        $('.docs-sidenav li').removeClass('active');
        $(this).addClass('active');
    //    window.location.href = url + link;
    //   $(window).scrollTop($(window).scrollTop()+40);
  });
  // 折叠code
  $('.markdown-body pre').map(function(i,item){
      $(item).addClass('ydoc-example');
      if($(item).height() >EXAMPLE_MAX_HEIGHT){
          $(item).css({ "padding-bottom":30 });
          $(item).find('code').height(EXAMPLE_MAX_HEIGHT);
          $(item).append('<span class="extend">展开更多……</span>');
      };
  });

 $('.ydoc-example').delegate('.extend','click',function(){
      $(this).removeClass('extend').addClass('fold');
      $(this).html('折叠代码');
      $(this).prev().height('auto');
      $(this).prev().parent().height('auto');
  });
  $('.ydoc-example').delegate('.fold','click',function(){
      $(this).removeClass('fold').addClass('extend');
      $(this).parent().height(EXAMPLE_MAX_HEIGHT);
      $(this).prev().height(EXAMPLE_MAX_HEIGHT);
      $(this).html("展开更多……");
  });

  // 参数默认显示 5个
  $(".docs-table tbody").each(function(){
     var paramsLength = $(this).find('tr').length,
         paramsArray = $(this).find('tr'),
         curTbody = $(this).parents('.docs-table');

     if(paramsLength > DEFAULT_SHOW_PARAMS){
         curTbody.append('<span class="extend-params">展开更多参数……</span>');
         paramsArray.each(function(index,item){
             if(index >= DEFAULT_SHOW_PARAMS ){
                 $(this).removeClass('hide-params').addClass('hide-params');
             }
         });
     }
  });
  $(".docs-table").delegate('.extend-params', 'click',function(){
      $(this).parents('.docs-table').find('.hide-params').addClass('show-params');
      $(this).removeClass('extend-params').addClass('fold-params');
      $(this).html('折叠参数');
  });
  $('.docs-table').delegate('.fold-params','click',function(){
      $(this).removeClass('fold-params').addClass('extend-params');
       $(this).parents('.docs-table').find('.show-params').removeClass('show-params');
      $(this).html("展开更多参数……");
  });

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

    $(window).on('scroll', function(e) {
        if( $(this).scrollTop() >  ($('.footer').offset().top - $(window).height()) ){
            winHeight = $(window).height() - $('.footer').outerHeight()-44,
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
    $(window).on('resize', function(e){
        var docSideNav = $('.docs-sidenav');
        var  ydocContainerCon= $('.ydoc-container-content');
        docSideNav.width(ydocContainerCon.width()*0.25);

    })
}
