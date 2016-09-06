$(document).ready(function() {
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

  $('.docs-sidenav>li').click(function(e){
      if($(this).hasClass('active')){
          $(this).removeClass('active');
      }else{
        $(this).addClass('active').siblings('li').removeClass('active');
      }
      if($(this).next('ul')){
          $(this).next('ul').toggle().siblings('ul').hide();
      }
     return false;
  });
  $(window).scroll(function(e){
      var docSideNav = $('.docs-sidenav'),
          ydocContainerCon= $('.ydoc-container-content');
      docSideNav.width(ydocContainerCon.width()*0.25);
      docSideNav.css({
          'left': $(window).width()/2-ydocContainerCon.width()/2
      });
      console.log('windowscrolltop',$(window).scrollTop());
      console.log('footertop',$('.footer').offset().top);
      if($(window).scrollTop() >=  ydocContainerCon.offset().top && $(window).scrollTop() < $('.footer').offset().top){
          docSideNav.addClass('fixed');
      }else{
          docSideNav.removeClass('fixed');
      }
  });
  // 折叠code
  $('.markdown-body pre').map(function(i,item){
      console.log('thisHeight',$(this).height());
      console.log('itemHeight', item);

      if($(item).height() >98){
          $(item).css({ "padding-bottom":30 });
          $(item).find('code').height(98);
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
      $(this).parent().height(98);
      $(this).prev().height(98);
      $(this).html("展开更多……");
  })
  // $('.extend').click(function(){
  //     $(this).removeClass('extend').addClass('fold');
  //     $(this).html('折叠代码');
  //     $(this).prev().height('auto');
  //     $(this).prev().parent().height('auto');
  // });
  // $('.fold').click(function(){
  //     alert('sdfsdaf');
  //     $(this).removeClass('fold').addClass('extend');
  //     $(this).parent().height(120);
  //     $(this).prev().height(98);
  //     $(this).html("展开更多……");
  // });
})
