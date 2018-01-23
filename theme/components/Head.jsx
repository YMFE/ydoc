<head>
	<meta charSet="UTF-8" />
	<meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
	<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<link rel="apple-touch-icon" sizes="180x180" href={relePath(props.distPath, 'ydoc/images/apple-touch-icon.png')} />
	<link rel="icon" type="image/png" sizes="32x32" href={relePath(props.distPath, 'ydoc/images/favicon-32x32.png')} />
	<link rel="icon" type="image/png" sizes="16x16" href={relePath(props.distPath, 'ydoc/images/favicon-16x16.png')} />
	<link rel="manifest" href={relePath(props.distPath, 'ydoc/images/manifest.json')} />
	<link rel="mask-icon" href={relePath(props.distPath, 'ydoc/images/safari-pinned-tab.svg"')} color="#5bbad5" />
	<meta name="theme-color" content="#ffffff" />
	<meta httpEquiv="Cache-Control" content="no-transform" />
	<meta httpEquiv="Cache-Control" content="no-siteapp" />
	<title>{props.title}</title>
	<link rel="stylesheet" href={relePath(props.distPath, 'ydoc/styles/style.css')} />
	{props.asserts.css.map(item=>{
		return <link key={item} rel="stylesheet" href={relePath(props.distPath, item)} />
	})}
</head>