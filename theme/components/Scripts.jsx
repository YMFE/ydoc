<script src={relePath(props.page.distPath, 'ydoc/scripts/plugins/dollar.min.js')}></script>
<script src={relePath(props.page.distPath, 'ydoc/scripts/plugins/responsive-nav.min.js')}></script>
<script src={relePath(props.page.distPath, 'ydoc/scripts/plugins/slideout.min.js')}></script>
<script src={relePath(props.page.distPath, 'ydoc/scripts/app.js')}></script>
{props.assets.js.map(item=>{
  return <script key={item}  src={relePath(props.page.distPath, item)} ></script>
})}