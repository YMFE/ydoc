<html>
  <meta charSet="UTF-8" />
  <meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <link rel="apple-touch-icon" sizes="180x180" href={relePath(props.page.distPath, 'ydoc/images/apple-touch-icon.png')} />
  <link rel="icon" type="image/png" sizes="32x32" href={relePath(props.page.distPath, 'ydoc/images/favicon-32x32.png')} />
  <link rel="icon" type="image/png" sizes="16x16" href={relePath(props.page.distPath, 'ydoc/images/favicon-16x16.png')} />
  <link rel="manifest" href={relePath(props.page.distPath, 'ydoc/images/manifest.json')} />
  <link rel="mask-icon" href={relePath(props.page.distPath, 'ydoc/images/safari-pinned-tab.svg"')} color="#5bbad5" />
  <meta name="theme-color" content="#ffffff" />
  <meta httpEquiv="Cache-Control" content="no-transform" />
  <meta httpEquiv="Cache-Control" content="no-siteapp" />
  {
    // console.log(JSON.stringify(props.title, null, 2))
  }
  <Head asserts={props.asserts} title={props.title} distPath={props.page.distPath} />
  <body>
    <div className="g-doc">
      {
        (props.summary && props.summary.length) ? (
          <Summary summary={props.summary} distPath={props.page.distPath} />
        ) : null
      }
      <div className="m-main" id="js-panel">
        <Header nav={props.config.nav} bookpath={props._bookpath} distPath={props.page.distPath} />
        <Content content={props.page.content} type={props.page.type} />
      </div>
    </div>
    <Scripts asserts={props.asserts} page={props.page} />
  </body>
</html>