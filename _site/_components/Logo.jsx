<a href={relePath(props.distPath, "index.html")} target="_self">
{
  props.nav.logo ? <img className="logo" width="36" 
    src={relePath(props.distPath, props.nav.logo)}
    srcSet={relePath(props.distPath, props.nav.logo).replace('@1x', '@2x') + ' 2x'} /> : null
}
{
    props.nav.title ? <h6 className="name">{props.nav.title}</h6> : null
}
</a>