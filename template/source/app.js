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
      if($(window).scrollTop() >=  ydocContainerCon.offset().top){
          docSideNav.addClass('fixed');
      }else{
          docSideNav.removeClass('fixed');
      }
  })
})
