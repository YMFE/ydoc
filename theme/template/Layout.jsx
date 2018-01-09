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
    <Header content={props.config.nav} path={props.page.distPath} />
    <Body content={props.page.content} />
    <Scripts data={props} />
  </body>
</html>