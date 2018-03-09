<html>
  {
    // console.log(JSON.stringify(props.title, null, 2))
  }
  <Head asserts={props.asserts} title={props.title} distPath={props.page.distPath} />
  <body>
    <div className="g-doc">
      {
        (props.summary && props.summary.length) ? (
          <Summary summary={props.summary} releativePath={props.page.releativePath} distPath={props.page.distPath} />
        ) : null
      }
      <div className="m-main" id="js-panel">
        <Header nav={props.config.nav} distPath={props.page.distPath} buildPath={props.config.buildPath} ydoc={props} />
        <Content content={props.page.content} type={props.page.type} ydoc={props} />
      </div>
    </div>
    <Scripts asserts={props.asserts} page={props.page} />
  </body>
</html>