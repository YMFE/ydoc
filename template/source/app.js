$(document).ready(function() {
    $('code').each(function(i, block) {
    if (block.innerHTML.indexOf('\n') != -1) {
        var pn = block.parentNode;
        if (pn.tagName.toUpperCase() == 'PRE') {
            try {
                hljs.highlightBlock(block);
            } catch(e) {}
        } else {
            console.log('block.innerHTML=============',block.innerHTML);
            pn.innerHTML = '<pre class="ydoc-example"><code>' + block.innerHTML + '</code></pre>';
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
          //return false;
      }
  });
  $(window).scroll(function(e){
      // sidebar fixed
      var docSideNav = $('.docs-sidenav'),
          ydocContainerCon= $('.ydoc-container-content');
      docSideNav.width(ydocContainerCon.width()*0.25);
      docSideNav.css({
          'left': $(window).width()/2-ydocContainerCon.width()/2
      });
      if($(window).scrollTop() >=  ydocContainerCon.offset().top && $(window).scrollTop() < $('.footer').offset().top){
          docSideNav.addClass('fixed');
      }else{
          docSideNav.removeClass('fixed');
      }

      // content fixed
     var contentIdArray = $('.page-header');
     contentIdArray.map(function(i,item){
        if($(window).scrollTop() > $(item).offset().top){
            $("a[herf="+$(item).id+"]").parent().addClass('active').siblings('li').removeClass('active');
            $("a[herf="+$(item).id+"]").parent().next('ul').show();
        }
     });
  });
  // 折叠code
  $('.markdown-body pre').map(function(i,item){
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
})
