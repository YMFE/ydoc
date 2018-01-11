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
  <Head data={props} />
  <body>
    {
      // console.log(JSON.stringify(props.config.nav, null, 2))

    }
    <div className="g-doc">
      {
        (props.summary && props.summary.length) ? (
          <Summary summary={props.summary} />
        ) : null
      }
      <div className="m-main">
        <Header
          nav={props.config.nav}
          bookpath={props._bookpath}
          distPath={props.page.distPath}
        />
        <Content content={props.page.content} />
      </div>
    </div>
    <Scripts distPath={props.page.distPath} />
  </body>
</html>