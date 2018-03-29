
<a href={relePath(props.distPath, "index.html")} target="_self">
  <img className="logo"
    src={relePath(props.distPath, props.nav.logo)}
    srcSet={relePath(props.distPath, props.nav.logo).replace('@1x', '@2x') + ' 2x'} />
  <h6 className="name">{props.nav.title}</h6>
</a>