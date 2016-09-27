var EXAMPLE_MAX_HEIGHT = 98,
    DEFAULT_SHOW_PARAMS = 5;

$(document).ready(function() {
    // 导航
    $('.navbar-toggle').click(function(){
        $(this).next(".ydoc-nav").toggle();
    });

    $('code').each(function(i, block) {
    if (block.innerHTML.indexOf('\n') !== -1) {
        var pn = block.parentNode;
        if (pn.tagName.toUpperCase() === 'PRE') {
            try {
                hljs.highlightBlock(block);
            } catch(e) {
                console.log(e);
             }
        } else {
            pn.innerHTML = '<pre class="ydoc-example"><code>' + block.innerHTML + '</code></pre>';
            try {
                hljs.highlightBlock(pn.childNodes[0].childNodes[0]);
            } catch(e) {
                console.log(e);
            }
        }
    }
    });

  $('.docs-sidenav li').click(function(){
      $('.docs-sidenav li').removeClass('active')
      $(this).addClass('active');
    //   if($(this).next('ul')){
    //       $(this).next('ul').show().siblings('ul').hide();
    //   }
  });

  // 鼠标在sidebar区域内滚动 不触发浏览器滚动条
  // var winHeight = $(window).height() - 40;
  // var docSideNav = $('.docs-sidenav'), barScroll = true,activeMenu;
  // docSideNav.on('mouseover',function(){
  //     barScroll = false;
  // });
  // docSideNav.on('mouseout', function(){
  //     barScroll = true;
  // });
  // $(window).scroll(function(e){
  //   var docSideNav = $('.docs-sidenav');
  //   var  ydocContainerCon= $('.ydoc-container-content');
  //   docSideNav.width(ydocContainerCon.width()*0.25);
  //   if($(window).scrollTop() >=  ydocContainerCon.offset().top){
  //       docSideNav.addClass('fixed');
  //   }else{
  //       docSideNav.removeClass('fixed');
  //   };
  //    if(barScroll){
  //        // 一级导航展开
  //        // var contentIdArray = $('.page-header');
  //        var contentH2Array = $("h2[id]");
  //        for(var i = 0; i < contentH2Array.length; i++){
  //            if($(window).scrollTop() > contentH2Array.eq(i).offset().top){
  //                if($("a[href='#"+($(contentH2Array.eq(i)).attr("id"))+"']")){
  //                    var curScrollEl = $("a[href='#"+($(contentH2Array.eq(i)).attr("id"))+"']").parent('li');
  //                    curScrollEl.addClass('active').siblings('li').removeClass('active');
  //                    //curScrollEl.next('ul').show().siblings('ul').hide();
  //                    if($(curScrollEl.next())[0].tagName.toLowerCase()  === "ul"){
  //                        curScrollEl.next('ul').show().siblings('ul').hide();
  //                    }else{
  //                       curScrollEl.siblings('ul').hide();
  //                       curScrollEl.siblings('ul').find('li').removeClass('active');
  //                    };
  //                }
  //
  //            }
  //        }
  //        // 二级导航展开
  //         var contentIdArray = $("h3[id]");
  //         for(var i = 0; i < contentIdArray.length; i++){
  //            if($(window).scrollTop() > contentIdArray.eq(i).offset().top){
  //                if( $("a[href='#"+($(contentIdArray).eq(i).attr("id"))+"']")){
  //                    var curScrollEl = $("a[href='#"+($(contentIdArray.eq(i)).attr("id"))+"']").parent('li');
  //                    curScrollEl.addClass('active').siblings('li').removeClass('active');
  //                    if(curScrollEl.next('ul')){
  //                        curScrollEl.next('ul').show().siblings('ul').hide();
  //                       //  var curExtendEl = curScrollEl.next('ul').find('li');
  //                       //  for(var j = 0; j>curExtendEl.length; j++){
  //                       //      if($(window).scrollTop() > curExtendEl.eq(j).offset().top){
  //                       //          var curSecondScrollEl = $("a[href=#"+($(contentIdArray.eq(i)).attr("id"))+"]").parent('li');
  //                       //      }
  //                       //  }
  //                    }
  //                }
  //            };
  //        };
  //         contentIdArray.each(function(i,item){
  //            if($(window).scrollTop() > $(item).offset().top){
  //                $("a[herf='"+$(item).id+"']").parent().addClass('active').siblings('li').removeClass('active');
  //                $("a[herf='"+$(item).id+"']").parent().next('ul').show();
  //            }
  //         });
  //     }
  //
  //     if (!barScroll) {
  //           var activeItem = $('.docs-sidenav li.active a');
  //           if (activeItem.length) {
  //               if (!activeMenu || (activeMenu.attr('href') != activeItem.attr('href'))) {
  //                   activeMenu = activeItem;
  //                   var top = activeMenu.offset().top - docSideNav.offset().top;
  //                   if (top < 0) {
  //                       docSideNav.scrollTop(docSideNav.scrollTop() + top);
  //                   } else if (top > winHeight - 30) {
  //                       docSideNav.scrollTop(docSideNav.scrollTop() + top - winHeight + 30);
  //                   }
  //               }
  //           }
  //       }
  // });

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



})
