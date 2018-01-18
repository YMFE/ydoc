<html>
  <meta charSet="UTF-8" />
  <meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <link rel="apple-touch-icon" href="icon.png" />
  <link rel="apple-touch-icon-precomposed" href="icon.png" />
  <meta httpEquiv="Cache-Control" content="no-transform" />
  <meta httpEquiv="Cache-Control" content="no-siteapp" />
  {
    // console.log(props)
  }
  <Head asserts={props.asserts} title={props.page.title} distPath={props.page.distPath} />
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
        <Footer distPath={props.page.distPath} />
      </div>
    </div>
    <Scripts asserts={props.asserts} page={props.page} />
  </body>
</html>