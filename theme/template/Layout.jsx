<html>
  <Head data={props} />
  <body>
    <div>
      <Header content={props.config.nav} />
      <Body content={props.page.content} />
    </div>
    <Scripts data={props} />
  </body>
</html>