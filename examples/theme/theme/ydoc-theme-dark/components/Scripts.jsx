{
  (()=>{
    var script = `
    var $content = document.getElementById('js-content');
    var $summaryItems = Array.prototype.slice.call(document.querySelectorAll('#js-menu .href'));
    var $menu = document.getElementById('js-menu');
    if ($menu && sessionStorage.menuScrollTop) {
		$menu.scrollTop = sessionStorage.menuScrollTop;
    }
    // 刷新页面但不切换 pathname 的时候，内容区恢复到记忆的高度
    if ($content && sessionStorage.contentScrollTop && window.location.pathname == sessionStorage.locationPathname) {
      $content.scrollTop = sessionStorage.contentScrollTop;
    }
    sessionStorage.setItem('locationPathname', window.location.pathname);`
    return <script dangerouslySetInnerHTML={{ __html: script }}>

    </script>
  })()
}

<script src={relePath(props.page.distPath, 'ydoc/scripts/plugins/dollar.min.js')}></script>
<script src={relePath(props.page.distPath, 'ydoc/scripts/plugins/responsive-nav.min.js')}></script>
<script src={relePath(props.page.distPath, 'ydoc/scripts/plugins/slideout.min.js')}></script>
<script src={relePath(props.page.distPath, 'ydoc/scripts/app.js')}></script>
{props.assets.js.map(item=>{
  return <script key={item}  src={relePath(props.page.distPath, item)} ></script>
})}